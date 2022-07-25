export interface ISubmitError {
  timeStamp: number;
  appMonitorId: string;
  errorId?: string;
  url: string;
  userMonitorId: string;
  osName?: string;
  osVersion?: string;
  egName?: string;
  egVersion?: string;
  bsName?: string;
  bsVersion?: string;
  ua: string;
  errorType: string;
  errorMsg: string;
  errorStack?: string;
}
