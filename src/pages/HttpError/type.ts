export interface IErrorConutByTimeData {
  frontErrorConutByTime: Record<string, [number, number]>;
  backErrorConutByTime: Record<string, [number, number]>;
}

export interface IHttpsBackErrorCountData {
  time: string;
  errorCount: number;
}

export interface IHttpsBackErrorRateData {
  time: string;
  errorRate: number;
}

export interface IHttpErrorRecord {
  key: string;
  date: string;
  originUrl: string;
  requestUrl: string;
  method: string;
  status: number;
  httpMessage: string;
  duration: number;
  count: number;
}

export type HttpErrorData = {
  records: IHttpErrorRecord[];
  current: number;
  size: number;
  total: number;
};
