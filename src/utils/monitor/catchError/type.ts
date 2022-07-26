// 错误基类interface
export type BaseError = {
  timeStamp: number;
  appMonitorId: string;
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
};

export type JsErrorParams = {
  errorType: string;
  errorStack: string;
  errorMsg: string;
  APP_MONITOR_ID: string;
  errPos: string;
};

export type PromiseErrorParams = {
  errorType: string;
  errorStack: string;
  errorMsg: string;
  APP_MONITOR_ID: string;
};

export type ResourceErrorErrorParams = {
  errorType: string;
  errorMsg: string;
  resourceUrl: string;
  APP_MONITOR_ID: string;
};

export type HttpRequestErrorParams = {
  errorType: string;
  requestUrl: string;
  method: string;
  status: number;
  statusText: string;
  duration: string;
  APP_MONITOR_ID: string;
};

// JS错误type
export type JsTransportError = Omit<JsErrorParams & BaseError, 'APP_MONITOR_ID' | 'errPos'>;

// Promise错误type
export type PromiseTransportError = Omit<PromiseErrorParams & BaseError, 'APP_MONITOR_ID'>;

// 静态资源错误type
export type ResourceTransportError = Omit<ResourceErrorErrorParams & BaseError, 'APP_MONITOR_ID'>;

// Http请求错误type
export type HttpRequestTransportError = Omit<HttpRequestErrorParams & BaseError, 'APP_MONITOR_ID'>;
