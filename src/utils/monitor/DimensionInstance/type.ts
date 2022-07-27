export interface DimensionStructure {
  timeStamp: number;
  aid: string;
  errorId?: string;
  originUrl: string;
  userMonitorId: string;
  osName?: string;
  osVersion?: string;
  egName?: string;
  egVersion?: string;
  bsName?: string;
  bsVersion?: string;
  ua: string;
}
