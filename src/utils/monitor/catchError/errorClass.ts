import UAParser from 'ua-parser-js';
import { randomString, hashCode, objecToQuery } from '../utils';

// 错误基类interface
export interface IBaseError {
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
}

// JS错误interface
export interface IJsError extends IBaseError {
  errorType: string;
  errorMsg: string;
  errorStack: string;
}

// Promise错误interface
export interface IPromiseError extends IBaseError {
  errorType: string;
  errorMsg: string;
  errorStack: string;
}

// 静态资源错误interface
export interface IResourceError extends IBaseError {
  errorType: string;
  errorMsg: string;
}

// Http请求错误interface
export interface IHttpRequestError extends IBaseError {
  errorType: string;
  requestUrl: string | URL;
  method: string;
  status: number;
  statusText: string;
  duration: string;
}

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
  appMonitorId: string;
  originUrl: string;
  userMonitorId: string;
  osName?: string;
  osVersion?: string;
  egName?: string;
  egVersion?: string;
  bsName?: string;
  bsVersion?: string;
  ua: string;

  constructor(APP_MONITOR_ID: string) {
    const { getBrowser, getEngine, getOS, getUA } = new UAParser();
    const { name: osName, version: osVersion } = getOS();
    const { name: egName, version: egVersion } = getEngine();
    const { name: bsName, version: bsVersion } = getBrowser();

    // 获取本次上报时间戳
    this.timeStamp = new Date().getTime();
    // 用于区分应用的唯一标识（一个项目对应一个）
    this.appMonitorId = APP_MONITOR_ID;
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

  /**
   * @description: 错误上报方法，利用new Image上报，请求报文体积小且没有跨域问题
   * @param serverUrl
   */
  submitError(serverUrl: string, errorInfo: IJsError | IPromiseError | IResourceError | IHttpRequestError) {
    const delay = Reflect.has(window, 'requestIdleCallback') ? requestIdleCallback : setTimeout;

    // 浏览器任务队列空闲的时候再上报
    delay(() => {
      const beacon = new Image();

      beacon.src = serverUrl + encodeURI(objecToQuery(errorInfo));
    });
  }
}

/**
 * @description: JS错误类
 */
export class JsError extends SetJournalProperty {
  errorId?: string;

  constructor(
    public errorType: string,
    public errorStack: string,
    public errorMsg: string,
    APP_MONITOR_ID: string,
    errPos: string,
  ) {
    super(APP_MONITOR_ID);

    const { getErrorId, submitErrorIds } = SetJournalProperty;

    this.errorId = getErrorId(submitErrorIds, `${errorMsg}:${errPos}`);
  }
}

/**
 * @description: Promise错误类
 */
export class PromiseError extends SetJournalProperty {
  errorId?: string;

  constructor(public errorType: string, public errorStack: string, public errorMsg: string, APP_MONITOR_ID: string) {
    super(APP_MONITOR_ID);

    const { getErrorId, submitErrorIds } = SetJournalProperty;

    this.errorId = getErrorId(submitErrorIds, errorMsg);
  }
}

/**
 * @description: 静态资源错误类
 */
export class ResourceError extends SetJournalProperty {
  errorId?: string;

  constructor(public errorType: string, public errorMsg: string, resourceUrl: string, APP_MONITOR_ID: string) {
    super(APP_MONITOR_ID);

    const { getErrorId, submitErrorIds } = SetJournalProperty;

    this.errorId = getErrorId(submitErrorIds, resourceUrl);
  }
}

/**
 * @description: Http请求错误类
 */
export class HttpRequestError extends SetJournalProperty {
  errorId?: string;

  constructor(
    public errorType: string,
    public requestUrl: string | URL,
    public method: string,
    public status: number,
    public statusText: string,
    public duration: string,
    APP_MONITOR_ID: string,
  ) {
    super(APP_MONITOR_ID);

    const { getErrorId, submitErrorIds } = SetJournalProperty;

    this.errorId = getErrorId(submitErrorIds, `${errorType}${requestUrl}${method}`);
  }
}
