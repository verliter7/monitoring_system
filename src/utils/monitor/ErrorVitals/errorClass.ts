import DimensionInstance from '../DimensionInstance';
import { hashCode } from '../utils';
import type { initOptions } from '..';
import type { HttpRequestErrorParams, JsErrorParams, PromiseErrorParams, ResourceErrorErrorParams } from './type';

const submitErrorIds = new Set<string>();

function getErrorId(errorIds: Set<string>, input: string) {
  const errorId = hashCode(input);

  if (errorIds.has(errorId)) {
    return void 0;
  } else {
    errorIds.add(errorId);
    return errorId;
  }
}

/**
 * @description: JS错误类
 */
export class JsError extends DimensionInstance {
  errorType: string;
  errorStack: string;
  errorMsg: string;
  errorId?: string;

  constructor({ errorType, errorStack, errorMsg, errPos }: JsErrorParams, options: initOptions) {
    super(options);

    this.errorType = errorType;
    this.errorStack = errorStack;
    this.errorMsg = errorMsg;
    this.errorId = getErrorId(submitErrorIds, `${this.aid}${this.userMonitorId}${this.originUrl}${errorMsg}${errPos}`);
  }
}

/**
 * @description: Promise错误类
 */
export class PromiseError extends DimensionInstance {
  errorType: string;
  errorMsg: string;
  errorId?: string;
  errorStack?: string;

  constructor({ errorType, errorStack, errorMsg }: PromiseErrorParams, options: initOptions) {
    super(options);

    const mark = `${this.aid}${this.userMonitorId}${this.originUrl}${errorMsg}`;

    this.errorType = errorType;
    this.errorMsg = errorMsg;
    this.errorId = getErrorId(submitErrorIds, mark);
    !errorStack && Reflect.deleteProperty(this, 'errorStack');
  }
}

/**
 * @description: 静态资源错误类
 */
export class ResourceError extends DimensionInstance {
  errorType: string;
  errorMsg: string;
  resourceUrl: string;
  errorId?: string;

  constructor({ errorType, errorMsg, resourceUrl }: ResourceErrorErrorParams, options: initOptions) {
    super(options);

    const mark = `${this.aid}${this.userMonitorId}${this.originUrl}${resourceUrl}`;

    this.errorType = errorType;
    this.errorMsg = errorMsg;
    this.resourceUrl = resourceUrl;
    this.errorId = getErrorId(submitErrorIds, mark);
  }
}

/**
 * @description: Http请求错误类
 */
export class HttpRequestError extends DimensionInstance {
  errorType: string;
  requestUrl: string;
  method: string;
  status: number;
  statusText: string;
  duration: string;
  errorId?: string;

  constructor(
    { errorType, requestUrl, method, status, statusText, duration }: HttpRequestErrorParams,
    options: initOptions,
  ) {
    super(options);

    const mark = `${this.aid}${this.userMonitorId}${this.originUrl}${errorType}${requestUrl}${method}`;

    this.errorType = errorType;
    this.requestUrl = requestUrl;
    this.method = method;
    this.status = status;
    this.statusText = statusText;
    this.duration = duration;
    this.errorId = getErrorId(submitErrorIds, mark);
  }
}
