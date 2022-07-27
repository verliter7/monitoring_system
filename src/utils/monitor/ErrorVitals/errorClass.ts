import { randomString, hashCode } from '../utils';
import type { HttpRequestErrorParams, JsErrorParams, PromiseErrorParams, ResourceErrorErrorParams } from './type';

export class BaseErrorUtils {
  static submitErrorIds = new Set<string>();
  // 保存用户id到localStorage里面
  static setUserId() {
    const randomStr = randomString();

    localStorage.setItem('userMonitorId', JSON.stringify(randomStr));

    return randomStr;
  }
  static getErrorId(errorIds: Set<string>, input: string) {
    const errorId = hashCode(input);

    if (errorIds.has(errorId)) {
      return void 0;
    } else {
      errorIds.add(errorId);
      return errorId;
    }
  }
}

/**
 * @description: JS错误类
 */
export class JsError extends BaseErrorUtils {
  errorType: string;
  errorStack: string;
  errorMsg: string;
  errorId?: string;

  constructor({ errorType, errorStack, errorMsg, errPos }: JsErrorParams) {
    super();

    const { getErrorId, submitErrorIds } = BaseErrorUtils;

    this.errorType = errorType;
    this.errorStack = errorStack;
    this.errorMsg = errorMsg;
    this.errorId = getErrorId(submitErrorIds, `${errorMsg}:${errPos}`);
  }
}

/**
 * @description: Promise错误类
 */
export class PromiseError extends BaseErrorUtils {
  errorType: string;
  errorStack: string;
  errorMsg: string;
  errorId?: string;

  constructor({ errorType, errorStack, errorMsg }: PromiseErrorParams) {
    super();

    const { getErrorId, submitErrorIds } = BaseErrorUtils;

    this.errorType = errorType;
    this.errorStack = errorStack;
    this.errorMsg = errorMsg;
    this.errorId = getErrorId(submitErrorIds, errorMsg);
  }
}

/**
 * @description: 静态资源错误类
 */
export class ResourceError extends BaseErrorUtils {
  errorType: string;
  errorMsg: string;
  resourceUrl: string;
  errorId?: string;

  constructor({ errorType, errorMsg, resourceUrl }: ResourceErrorErrorParams) {
    super();

    const { getErrorId, submitErrorIds } = BaseErrorUtils;

    this.errorType = errorType;
    this.errorMsg = errorMsg;
    this.resourceUrl = resourceUrl;
    this.errorId = getErrorId(submitErrorIds, resourceUrl);
  }
}

/**
 * @description: Http请求错误类
 */
export class HttpRequestError extends BaseErrorUtils {
  errorType: string;
  requestUrl: string;
  method: string;
  status: number;
  statusText: string;
  duration: string;
  errorId?: string;

  constructor({ errorType, requestUrl, method, status, statusText, duration }: HttpRequestErrorParams) {
    super();

    const { getErrorId, submitErrorIds } = BaseErrorUtils;

    this.errorType = errorType;
    this.requestUrl = requestUrl;
    this.method = method;
    this.status = status;
    this.statusText = statusText;
    this.duration = duration;
    this.errorId = getErrorId(submitErrorIds, `${errorType}${requestUrl}${method}`);
  }
}
