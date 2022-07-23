import { nanoid } from 'nanoid';
import UAParser from 'ua-parser-js';
import { HttpReq } from '..';
import otherErrorType from '../constant/otherErrorType';

// 保存用户id到localStorage里面
function setUserId() {
  const randomStr = nanoid();

  localStorage.setItem('userMonitorId', JSON.stringify(randomStr));

  return randomStr;
}

const { getBrowser, getEngine, getOS, getUA } = new UAParser();

const WEB_MONITOR_ID = 'monitor_learn';
const { RESOURCELOADED, PROMISEREJECTED } = otherErrorType;
// 设置日志对象类的通用属性

class SetJournalProperty {
  time: number;
  appMonitorId: string;
  url: string;
  dataId: string;
  userMonitorId: string;
  os: UAParser.IOS;
  engine: UAParser.IEngine;
  browser: UAParser.IBrowser;
  ua: string;

  constructor() {
    this.time = new Date().getTime(); // 获取本次上报时间戳
    this.appMonitorId = WEB_MONITOR_ID; // 用于区分应用的唯一标识（一个项目对应一个）
    this.url = window.location.href.split('?')[0].replace('#', ''); // 页面的url
    this.dataId = `${this.time}@${nanoid()}`; // 用于区分数据，所对应唯一的标识，每条数据对应一个值
    this.userMonitorId = `${this.url}@${JSON.parse(localStorage.getItem('userMonitorId') ?? setUserId())}`; // 用于区分用户，所对应唯一的标识，清理本地数据后失效
    this.os = getOS();
    this.engine = getEngine();
    this.browser = getBrowser();
    this.ua = getUA();
  }
}

class JsErrorInfo extends SetJournalProperty {
  constructor(public errorType: string, public errorStack: string, public errorMsg: string) {
    super();
  }
}

class ResourceError extends SetJournalProperty {
  constructor(public errorType: string, public errorMsg: string) {
    super();
  }
}

window.addEventListener(
  'error',
  (errorEvent) => {
    const { localName, attributes } = errorEvent.target as HTMLElement;
    // e.target.localName有值就是资源错误，否者就是js代码执行出错
    if (localName) {
      const errorType = RESOURCELOADED;
      const url = attributes.getNamedItem('src')?.nodeValue ?? attributes.getNamedItem('href')?.nodeValue;
      const errorMsg = `Uncaught ${errorType} resourceUrl: ${url}`;
      const resourceError = new ResourceError(errorType, errorMsg);

      console.log(resourceError);
    } else {
      const { error, filename, message } = errorEvent;
      const errorType = error.toString().split(':')[0];
      const jsError = new JsErrorInfo(errorType, filename, message);
    }
  },
  true,
);

window.addEventListener('unhandledrejection', (errorEvent) => {
  const { message, stack } = errorEvent.reason;
  const errorType = PROMISEREJECTED;
  const promiseError = new JsErrorInfo(errorType, stack, message);

  HttpReq.send({
    url: '/error/jsExecute',
    method: 'POST',
    body: promiseError,
  });
});

fetch('https://tuia.cn/test');
// const link = document.createElement('link');
// link.href = 'https://yun.tuia.cn/image/kkk.css';
// link.rel = 'stylesheet';
// document.head.appendChild(link);
