export enum chartTypeEnum {
  HP = 'httpError',
  JS = 'jsError',
  RS = 'resourcesError',
  PL = 'pageLoad',
}

export interface IResourcesBackErrorCountData {
  time: string;
  errorCount: number;
}

export interface IResourcesErrorSum {
  front: number;
  back: number;
}

export interface IResourcesErrorData {
  backErrorCountData: IResourcesBackErrorCountData[];
  errorSum: IResourcesErrorSum;
  type: chartTypeEnum;
}

export interface IChartState {
  resources: IResourcesErrorData;
}
