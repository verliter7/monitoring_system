import { lazy } from 'react';
import NotAuthorization from '@/components/NotAuthorization';
import { HandleLocalStorage } from '@/utils';
import type { FC, LazyExoticComponent, ComponentType } from 'react';

interface IReturn {
  pathname: string;
  Component: FC | LazyExoticComponent<ComponentType<any>>;
}

/**
 * @description: 自定义懒加载权限控制hooks
 */

const useLazyPermissionsRouter = (
  routerConfig: {
    pathname: string;
    componentPath: string;
  }[],
): IReturn[] => {
  const pagesImporters = import.meta.glob<boolean, string, { default: ComponentType<any> }>('@/pages/*/index.tsx');
  const { permissions } = HandleLocalStorage.get('userInfo');

  return routerConfig.map(({ pathname, componentPath }) => {
    const Component = lazy(pagesImporters[componentPath]);
    const permissionSet = new Set(permissions);

    return {
      pathname,
      Component: permissionSet.has(pathname) ? Component : NotAuthorization,
    };
  });
};

export default useLazyPermissionsRouter;
