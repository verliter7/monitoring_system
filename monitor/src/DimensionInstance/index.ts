import UAParser from 'ua-parser-js';
import { randomString } from '../utils';
import type { initOptions } from '..';

// 维度实例，用以初始化 uid、sid等信息
export default class DimensionInstance {
  static setUserId() {
    const randomStr = randomString();

    localStorage.setItem('userMonitorId', JSON.stringify(randomStr));

    return randomStr;
  }

  aid: string;
  timeStamp: number;
  originUrl: string;
  userMonitorId: string;
  // sessionId: string;
  // jsessionId: string;
  osName?: string;
  osVersion?: string;
  egName?: string;
  egVersion?: string;
  bsName?: string;
  bsVersion?: string;
  ua: string;

  constructor(options: initOptions) {
    const { getBrowser, getEngine, getOS, getUA } = new UAParser();
    const { name: osName, version: osVersion } = getOS();
    const { name: egName, version: egVersion } = getEngine();
    const { name: bsName, version: bsVersion } = getBrowser();

    this.timeStamp = Date.now();
    // 用于区分应用的唯一标识（一个项目对应一个）
    this.aid = options.aid;
    // 页面的url
    this.originUrl = window.location.href.split('?')[0].replace('/#', '');
    // 用于区分用户，所对应唯一的标识，清理本地数据后失效
    this.userMonitorId = `${JSON.parse(localStorage.getItem('userMonitorId') ?? DimensionInstance.setUserId())}`;
    this.osName = osName;
    this.osVersion = osVersion;
    this.egName = egName;
    this.egVersion = egVersion;
    this.bsName = bsName;
    this.bsVersion = bsVersion;
    this.ua = getUA();
    // this.sessionId = document.cookie.
  }
}
