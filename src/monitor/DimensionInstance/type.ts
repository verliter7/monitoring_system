export default interface DimensionStructure {
  aid: string;
  timeStamp: number;
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
