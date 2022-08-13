import type { IResourceErrorRecord } from '@/pages/ResourcesError/type';

export interface IResourcesBackErrorCountData {
  time: string;
  errorCount: number;
}

export interface IResourcesErrorSum {
  front: number;
  back: number;
}

export interface IResourcesErrorChartData {
  backErrorCountData: IResourcesBackErrorCountData[];
  errorSum: IResourcesErrorSum;
}

export interface IResourcesErrorTableData {
  records: IResourceErrorRecord[];
  current: number;
  size: number;
  total: number;
}

export interface IResourcesErrorState {
  chart: IResourcesErrorChartData;
  table: IResourcesErrorTableData;
}
