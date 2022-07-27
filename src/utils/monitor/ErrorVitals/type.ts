// 错误基类interface
export type BaseError = {
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
};

export type JsErrorParams = {
  errorType: string;
  errorStack: string;
  errorMsg: string;
  aid: string;
  errPos: string;
};

export type PromiseErrorParams = {
  errorType: string;
  errorStack: string;
  errorMsg: string;
  aid: string;
};

export type ResourceErrorErrorParams = {
  errorType: string;
  errorMsg: string;
  resourceUrl: string;
  aid: string;
};

export type HttpRequestErrorParams = {
  errorType: string;
  requestUrl: string;
  method: string;
  status: number;
  statusText: string;
  duration: string;
  aid: string;
};

// JS错误type
export type JsTransportError = Omit<JsErrorParams & BaseError, 'aid' | 'errPos'>;

// Promise错误type
export type PromiseTransportError = Omit<PromiseErrorParams & BaseError, 'aid'>;

// 静态资源错误type
export type ResourceTransportError = Omit<ResourceErrorErrorParams & BaseError, 'aid'>;

// Http请求错误type
export type HttpRequestTransportError = Omit<HttpRequestErrorParams & BaseError, 'aid'>;
