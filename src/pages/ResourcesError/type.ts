import type { TableDefault } from '@/redux/tableSlice/type';

export interface IErrorConutByTimeData {
  frontErrorConutByTime: Record<string, number>;
  backErrorConutByTime: Record<string, number>;
}

export interface IErrorCountData {
  time: string;
  errorCount: number;
}

export interface IResourceErrorRecord {
  key: string;
  date: string;
  originUrl: string;
  requestUrl: string;
  count: number;
}

export type ResourceErrorData = {
  records: IResourceErrorRecord[];
} & TableDefault;
