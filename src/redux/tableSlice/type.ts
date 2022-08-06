import type { IResourceErrorRecord } from '@/pages/ResourcesError/type';

export type { ResourceErrorData } from '@/pages/ResourcesError/type';

export enum tableTypeEnum {
  HP = 'httpError',
  JS = 'jsError',
  RS = 'resourcesError',
  PL = 'pageLoad',
}

export type TableDefault = {
  current: number;
  size: number;
  total: number;
} & { type: tableTypeEnum };

export type HttpError = { records: Record<string, any>[] } & TableDefault;
export type JsError = { records: Record<string, any>[] } & TableDefault;
export type ResourcesError = { records: IResourceErrorRecord[] } & TableDefault;
export type PageLoad = { records: Record<string, any>[] } & TableDefault;

export interface ITableState {
  httpError: HttpError;
  jsError: JsError;
  resourcesError: ResourcesError;
  pageLoad: PageLoad;
}
