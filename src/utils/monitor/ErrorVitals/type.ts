import DimensionStructure from '../DimensionInstance/type';

export enum ErrorType {
  JS = 'JSError',
  RS = 'ResourceLoadedError',
  UJ = 'PromiseRejectedUnCatchError',
  HP = 'HttpRequestError',
  CS = 'CrossDomainScriptError',
  XC = 'XMLHttpRequestCrossDomainError',
  XE = 'XMLHttpRequestError',
  XN = 'XMLHttpRequestNetworkError',
  XT = 'XMLHttpRequestTimeoutError',
  XA = 'XMLHttpRequestAbortError',
}

export type JsErrorParams = {
  errorType: string;
  errorStack: string;
  errorMsg: string;
  errPos: string;
};

export type PromiseErrorParams = {
  errorType: string;
  errorMsg: string;
  errorStack?: string;
};

export type ResourceErrorErrorParams = {
  errorType: string;
  errorMsg: string;
  requestUrl: string;
};

export type HttpRequestErrorParams = {
  errorType: string;
  requestUrl: string;
  method: string;
  status: number;
  httpMessage: string;
  duration: string;
};

export type HttpRequestParams = {
  requestUrl: string;
  method: string;
  status: number;
  httpMessage: string;
  duration: string;
};

// JS错误type
export type JsTransportError = Omit<JsErrorParams & DimensionStructure, 'errPos'>;

// Promise错误type
export type PromiseTransportError = PromiseErrorParams & DimensionStructure;

// 静态资源错误type
export type ResourceTransportError = ResourceErrorErrorParams & DimensionStructure;

// Http请求错误type
export type HttpRequestTransportError = HttpRequestErrorParams & DimensionStructure;

// Http请求type
export type HttpRequestTransport = HttpRequestParams & DimensionStructure;
