import type { IHttpErrorRecord } from '@/pages/HttpError/type';

export interface IHttpBackErrorCountData {
  time: string;
  errorCount: number;
}

export interface IHttpBackErrorRateData {
  time: string;
  errorRate: number;
}

export interface IHttpErrorSum {
  front: number;
  back: number;
}

export interface IHttpErrorCardData {
  errorSum: IHttpErrorSum;
  errorRate: IHttpErrorSum;
}

export interface IHttpErrorChartData {
  backErrorCountData: IHttpBackErrorCountData[];
  backErrorRateData: IHttpBackErrorRateData[];
}

export interface IHttpErrorTableData {
  records: IHttpErrorRecord[];
  current: number;
  size: number;
  total: number;
}

export interface IHttpErrorState {
  pastDays: string;
  card: IHttpErrorCardData;
  chart: IHttpErrorChartData;
  table: IHttpErrorTableData;
}
