import { DimensionAttribute } from '../DimensionInstance/DimensionInstance';

export type JsErrorParams = {
  errorType: string;
  errorStack: string;
  errorMsg: string;
  errPos: string;
};

export type PromiseErrorParams = {
  errorType: string;
  errorStack: string;
  errorMsg: string;
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
export type JsTransportError = Omit<JsErrorParams & DimensionAttribute, 'errPos'>;

// Promise错误type
export type PromiseTransportError = PromiseErrorParams & DimensionAttribute;

// 静态资源错误type
export type ResourceTransportError = ResourceErrorErrorParams & DimensionAttribute;

// Http请求错误type
export type HttpRequestTransportError = HttpRequestErrorParams & DimensionAttribute;
