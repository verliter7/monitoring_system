import { lazy, Suspense, memo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import meunConfig from './meunConfig';
import Loading from '@/components/Loading';
import PageNotFound from '@/components/PageNotFound';
import type { FC, ReactElement, ComponentType } from 'react';

const pagesImporters = import.meta.glob<boolean, string, { default: ComponentType<any> }>('@/pages/*/index.tsx');

const HomePageRouters: FC = (): ReactElement => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Navigate to={meunConfig[0].pathname} />} />
        {meunConfig.map(({ pathname, componentPath }) => {
          const Component = lazy(pagesImporters[componentPath]);

          return <Route path={pathname} element={<Component />} key={pathname} />;
        })}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};

export default memo(HomePageRouters);
