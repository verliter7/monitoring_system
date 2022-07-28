import DimensionStructure from '../DimensionInstance/type';

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
  resourceUrl: string;
};

export type HttpRequestErrorParams = {
  errorType: string;
  requestUrl: string;
  method: string;
  status: number;
  statusText: string;
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
