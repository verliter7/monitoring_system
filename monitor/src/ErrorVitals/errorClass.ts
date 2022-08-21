import DimensionInstance from '../DimensionInstance';
import { hashCode } from '../utils';
import type { initOptions } from '..';
import {
  ErrorWideType,
  HttpRequestErrorParams,
  HttpRequestParams,
  JsErrorParams,
  PromiseErrorParams,
  ResourceErrorErrorParams,
} from './type';
import { transportKind } from '../Transport';

const submitErrorIds = new Set<string>();

function getId(errorIds: Set<string>, input: string) {
  const errorId = hashCode(input);

  if (errorIds.has(errorId)) {
    return void 0;
  } else {
    errorIds.add(errorId);
    return errorId;
  }
}

/**
 * @description: 通用错误类
 */
class CurrencyError extends DimensionInstance {
  constructor(public kind: transportKind, public type: ErrorWideType, options: initOptions) {
    super(options);
  }
}

/**
 * @description: JS错误类
 */
export class JsError extends CurrencyError {
  errorType: string;
  errorStack: string;
  errorMsg: string;
  errorId?: string;

  constructor({ errorType, errorStack, errorMsg, errPos }: JsErrorParams, options: initOptions) {
    super(transportKind.stability, ErrorWideType.JE, options);

    this.errorType = errorType;
    this.errorStack = errorStack;
    this.errorMsg = errorMsg;
    this.errorId = getId(submitErrorIds, `${this.aid}${this.userMonitorId}${this.originUrl}${errorMsg}${errPos}`);
  }
}

/**
 * @description: Promise错误类
 */
export class PromiseError extends CurrencyError {
  errorType: string;
  errorMsg: string;
  errorId?: string;
  errorStack?: string;

  constructor({ errorType, errorStack, errorMsg }: PromiseErrorParams, options: initOptions) {
    super(transportKind.stability, ErrorWideType.PE, options);

    const mark = `${this.aid}${this.userMonitorId}${this.originUrl}${errorMsg}`;

    this.errorType = errorType;
    this.errorMsg = errorMsg;
    this.errorStack = errorStack;
    this.errorId = getId(submitErrorIds, mark);
  }
}

/**
 * @description: 静态资源错误类
 */
export class ResourceError extends CurrencyError {
  errorType: string;
  errorMsg: string;
  requestUrl: string;
  errorId?: string;

  constructor({ errorType, errorMsg, requestUrl }: ResourceErrorErrorParams, options: initOptions) {
    super(transportKind.stability, ErrorWideType.RE, options);

    const mark = `${this.aid}${this.userMonitorId}${this.originUrl}${requestUrl}`;

    this.errorType = errorType;
    this.errorMsg = errorMsg;
    this.requestUrl = requestUrl;
    this.errorId = getId(submitErrorIds, mark);
  }
}

/**
 * @description: Http请求错误类
 */
export class HttpRequestError extends CurrencyError {
  errorType: string;
  requestUrl: string;
  method: string;
  status: number;
  httpMessage: string;
  duration: string;
  errorId?: string;

  constructor(
    { errorType, requestUrl, method, status, httpMessage, duration }: HttpRequestErrorParams,
    options: initOptions,
  ) {
    super(transportKind.stability, ErrorWideType.HE, options);

    const mark = `${this.aid}${this.userMonitorId}${this.originUrl}${errorType}${requestUrl}${method}`;

    this.errorType = errorType;
    this.requestUrl = requestUrl;
    this.method = method;
    this.status = status;
    this.httpMessage = httpMessage;
    this.duration = duration;
    this.errorId = getId(submitErrorIds, mark);
  }
}

export class HttpRequest extends DimensionInstance {
  requestUrl: string;
  method: string;
  status: number;
  httpMessage: string;
  duration: string;
  httpId?: string;

  constructor({ requestUrl, method, status, httpMessage, duration }: HttpRequestParams, options: initOptions) {
    super(options);

    const mark = `${this.aid}${this.userMonitorId}${this.originUrl}${requestUrl}${method}`;

    this.requestUrl = requestUrl;
    this.method = method;
    this.status = status;
    this.httpMessage = httpMessage;
    this.duration = duration;
    this.httpId = getId(submitErrorIds, mark);
  }
}
