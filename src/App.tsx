import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BaseLayout from '@/components/BaseLayout';
import Loading from '@/components/Loading';
import PageNotFound from '@/components/PageNotFound';
import { loginPagePath, notLoginPagePath, userInfoKey } from './utils/constant';
import type { FC, ReactElement } from 'react';

const Login = lazy(() => import('@/pages/Login'));
const App: FC = (): ReactElement => {
  const isLogin = !!localStorage.getItem(userInfoKey);

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Navigate to={isLogin ? loginPagePath : notLoginPagePath} />} />
        <Route path={notLoginPagePath} element={<Login />} />
        <Route path={`${loginPagePath}/*`} element={<BaseLayout />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;
