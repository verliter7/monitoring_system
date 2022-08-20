import { Suspense, memo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { routerConfig } from './routerConfig';
import Loading from '@/components/Loading';
import PageNotFound from '@/components/PageNotFound';
import { useLazyPermissionsRouter } from '@/hooks';
import type { FC, ReactElement } from 'react';

const HomePageRouters: FC = (): ReactElement => {
  const lazyRouters = useLazyPermissionsRouter(routerConfig);

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Navigate to={`/monitor${routerConfig[0].pathname}`} />} />
        {lazyRouters.map(({ pathname, Component }) => {
          return <Route path={pathname} element={<Component />} key={pathname} />;
        })}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};

export default memo(HomePageRouters);
