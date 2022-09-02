import { lazy } from 'react';
import NotAuthorization from '@/components/NotAuthorization';
import { HandleLocalStorage } from '@/utils';
import { userInfoKey } from '@/utils/constant';
import type { FC, LazyExoticComponent, ComponentType } from 'react';

interface IReturn {
  pathname: string;
  Component: FC | LazyExoticComponent<ComponentType<any>>;
}

/**
 * @description: 自定义懒加载权限控制方法
 */

const getLazyPermissionsRouter = (
  routerConfig: {
    pathname: string;
    componentPath: string;
  }[],
): IReturn[] => {
  const pagesImporters = import.meta.glob<boolean, string, { default: ComponentType<any> }>('@/pages/*/index.tsx');
  const { permissions } = HandleLocalStorage.get(userInfoKey);

  return routerConfig.map(({ pathname, componentPath }) => {
    const Component = lazy(pagesImporters[componentPath]);
    const permissionSet = new Set(permissions);

    return {
      pathname,
      Component: permissionSet.has(pathname) ? Component : NotAuthorization,
    };
  });
};

export default getLazyPermissionsRouter;
