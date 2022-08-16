export interface IErrorConutByTimeData {
  frontErrorConutByTime: Record<string, [number, number]>;
  backErrorConutByTime: Record<string, [number, number]>;
}

export interface IResourcesBackErrorCountData {
  time: string;
  errorCount: number;
}

export interface IResourcesBackErrorRateData {
  time: string;
  errorRate: number;
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
  current: number;
  size: number;
  total: number;
};
