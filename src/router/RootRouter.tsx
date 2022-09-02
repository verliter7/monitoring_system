import { lazy, memo, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import BaseLayout from '@/components/BaseLayout';
import Loading from '@/components/Loading';
import { routerConfig } from './routerConfig';
import { getLazyPermissionsRouter } from '@/utils';
import { loginPagePath, notLoginPagePath, userInfoKey } from '@/utils/constant';
import type { FC, ReactElement } from 'react';

const PageNotFound = lazy(() => import('@/components/PageNotFound'));
const RootRouter: FC = (): ReactElement => {
  const lazyRouters = getLazyPermissionsRouter(routerConfig);
  const isLogin = !!localStorage.getItem(userInfoKey);

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Navigate to={isLogin ? loginPagePath : notLoginPagePath} />} />
        <Route path={notLoginPagePath} element={<Login />} />
        <Route path={`${loginPagePath}/*`} element={<BaseLayout />}>
          <Route path="" element={<Navigate to={`${loginPagePath}${lazyRouters[0].pathname}`} />} />
          {lazyRouters.map(({ pathname, Component }) => {
            return <Route path={`${pathname.split('/')[1]}`} element={<Component />} key={pathname} />;
          })}
          <Route path="*" element={<PageNotFound />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};

export default memo(RootRouter);
