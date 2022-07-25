import UAParser from 'ua-parser-js';
import { randomString, hashCode, objecToQuery } from '../utils';

export interface ISubmitError {
  timeStamp: number;
  appMonitorId: string;
  errorId?: string;
  url: string;
  userMonitorId: string;
  osName?: string;
  osVersion?: string;
  egName?: string;
  egVersion?: string;
  bsName?: string;
  bsVersion?: string;
  ua: string;
  errorType: string;
  errorMsg: string;
  errorStack?: string;
}

// 设置日志对象类的通用属性
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
  url: string;
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

    this.timeStamp = new Date().getTime(); // 获取本次上报时间戳
    this.appMonitorId = APP_MONITOR_ID; // 用于区分应用的唯一标识（一个项目对应一个）
    this.url = window.location.href.split('?')[0].replace('#', ''); // 页面的url
    this.userMonitorId = `${this.url}@${JSON.parse(
      localStorage.getItem('userMonitorId') ?? SetJournalProperty.setUserId(),
    )}`; // 用于区分用户，所对应唯一的标识，清理本地数据后失效
    this.osName = osName;
    this.osVersion = osVersion;
    this.egName = egName;
    this.egVersion = egVersion;
    this.bsName = bsName;
    this.bsVersion = bsVersion;
    this.ua = getUA();
  }

  submitError(serverUrl: string) {
    const beacon = new Image();

    beacon.src = serverUrl + encodeURI(objecToQuery(this));
  }
}

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

  submitError(serverUrl: string) {
    const beacon = new Image();

    beacon.src = serverUrl + encodeURI(objecToQuery(this));
  }
}

export class PromiseError extends SetJournalProperty {
  errorId?: string;

  constructor(public errorType: string, public errorStack: string, public errorMsg: string, APP_MONITOR_ID: string) {
    super(APP_MONITOR_ID);

    const { getErrorId, submitErrorIds } = SetJournalProperty;

    this.errorId = getErrorId(submitErrorIds, errorMsg);
  }
}

export class ResourceError extends SetJournalProperty {
  errorId?: string;

  constructor(public errorType: string, public errorMsg: string, resourceUrl: string, APP_MONITOR_ID: string) {
    super(APP_MONITOR_ID);

    const { getErrorId, submitErrorIds } = SetJournalProperty;

    this.errorId = getErrorId(submitErrorIds, resourceUrl);
  }
}
