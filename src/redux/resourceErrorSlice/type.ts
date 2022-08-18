import type { IResourceErrorRecord } from '@/pages/ResourcesError/type';

export interface IResourcesBackErrorCountData {
  time: string;
  errorCount: number;
}

export interface IResourcesBackErrorRateData {
  time: string;
  errorRate: number;
}

export interface IResourcesErrorSum {
  front: number;
  back: number;
}

export interface IHttpErrorRate {
  front: number;
  back: number;
}

export interface IResourcesErrorCardData {
  errorSum: IResourcesErrorSum;
  errorRate: IHttpErrorRate;
}

export interface IResourcesErrorChartData {
  backErrorCountData: IResourcesBackErrorCountData[];
  backErrorRateData: IResourcesBackErrorRateData[];
}

export interface IResourcesErrorTableData {
  records: IResourceErrorRecord[];
  current: number;
  size: number;
  total: number;
}

export interface IResourcesErrorState {
  pastDays: string;
  card: IResourcesErrorCardData;
  chart: IResourcesErrorChartData;
  table: IResourcesErrorTableData;
}
