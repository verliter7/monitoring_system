import UAParser from 'ua-parser-js';
import { randomString, hashCode } from '../utils';
import type { HttpRequestErrorParams, JsErrorParams, PromiseErrorParams, ResourceErrorErrorParams } from './type';

/**
 * @description: 设置日志对象类的通用属性
 */
export class SetJournalProperty {
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

  timeStamp: number;
  aid: string;
  originUrl: string;
  userMonitorId: string;
  osName?: string;
  osVersion?: string;
  egName?: string;
  egVersion?: string;
  bsName?: string;
  bsVersion?: string;
  ua: string;

  constructor(aid: string) {
    const { getBrowser, getEngine, getOS, getUA } = new UAParser();
    const { name: osName, version: osVersion } = getOS();
    const { name: egName, version: egVersion } = getEngine();
    const { name: bsName, version: bsVersion } = getBrowser();

    // 获取本次上报时间戳
    this.timeStamp = new Date().getTime();
    // 用于区分应用的唯一标识（一个项目对应一个）
    this.aid = aid;
    // 页面的url
    this.originUrl = window.location.href.split('?')[0].replace('#', '');
    // 用于区分用户，所对应唯一的标识，清理本地数据后失效
    this.userMonitorId = `${this.originUrl}@${JSON.parse(
      localStorage.getItem('userMonitorId') ?? SetJournalProperty.setUserId(),
    )}`;
    this.osName = osName;
    this.osVersion = osVersion;
    this.egName = egName;
    this.egVersion = egVersion;
    this.bsName = bsName;
    this.bsVersion = bsVersion;
    this.ua = getUA();
  }
}

/**
 * @description: JS错误类
 */
export class JsError extends SetJournalProperty {
  errorType: string;
  errorStack: string;
  errorMsg: string;
  errorId?: string;

  constructor({ errorType, errorStack, errorMsg, aid, errPos }: JsErrorParams) {
    super(aid);

    const { getErrorId, submitErrorIds } = SetJournalProperty;

    this.errorType = errorType;
    this.errorStack = errorStack;
    this.errorMsg = errorMsg;
    this.errorId = getErrorId(submitErrorIds, `${errorMsg}:${errPos}`);
  }
}

/**
 * @description: Promise错误类
 */
export class PromiseError extends SetJournalProperty {
  errorType: string;
  errorStack: string;
  errorMsg: string;
  errorId?: string;

  constructor({ errorType, errorStack, errorMsg, aid }: PromiseErrorParams) {
    super(aid);

    const { getErrorId, submitErrorIds } = SetJournalProperty;

    this.errorType = errorType;
    this.errorStack = errorStack;
    this.errorMsg = errorMsg;
    this.errorId = getErrorId(submitErrorIds, errorMsg);
  }
}

/**
 * @description: 静态资源错误类
 */
export class ResourceError extends SetJournalProperty {
  errorType: string;
  errorMsg: string;
  resourceUrl: string;
  errorId?: string;

  constructor({ errorType, errorMsg, resourceUrl, aid }: ResourceErrorErrorParams) {
    super(aid);

    const { getErrorId, submitErrorIds } = SetJournalProperty;

    this.errorType = errorType;
    this.errorMsg = errorMsg;
    this.resourceUrl = resourceUrl;
    this.errorId = getErrorId(submitErrorIds, resourceUrl);
  }
}

/**
 * @description: Http请求错误类
 */
export class HttpRequestError extends SetJournalProperty {
  errorType: string;
  requestUrl: string;
  method: string;
  status: number;
  statusText: string;
  duration: string;
  errorId?: string;

  constructor({ errorType, requestUrl, method, status, statusText, duration, aid }: HttpRequestErrorParams) {
    super(aid);

    const { getErrorId, submitErrorIds } = SetJournalProperty;

    this.errorType = errorType;
    this.requestUrl = requestUrl;
    this.method = method;
    this.status = status;
    this.statusText = statusText;
    this.duration = duration;
    this.errorId = getErrorId(submitErrorIds, `${errorType}${requestUrl}${method}`);
  }
}
