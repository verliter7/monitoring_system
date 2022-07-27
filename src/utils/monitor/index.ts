import ErrorCatch from './catchError';
import { errorUrl } from './utils/urls';

export default class MonitorCore {
  static instance: MonitorCore;
  static getInstance = (APP_MONITOR_ID: string): MonitorCore => {
    if (!this.instance) {
      this.instance = new MonitorCore(APP_MONITOR_ID);
    }
    return this.instance;
  };

  errorCatchInstance: ErrorCatch;

  constructor(APP_MONITOR_ID: string) {
    this.errorCatchInstance = new ErrorCatch(APP_MONITOR_ID, errorUrl);
  }

  init() {
    this.errorCatchInstance.init();

    // throw new TypeError('123');
    // fetch('http://localhost:8080/api/v1/err', {
    //   method: 'GET',
    // });
    // const link = document.createElement('link');
    // link.href = 'https://yun.tuia.cn/image/kkk.css';
    // link.rel = 'stylesheet';
    // document.head.appendChild(link);

    // setTimeout(() => {
    // const xhr = new XMLHttpRequest();

    // xhr.timeout = 1;
    // xhr.open('GET', 'api/v1/error/add');
    // xhr.open('GET', '/api/v1/error/get?errorId=-1481135701');
    // xhr.send(null);
    // }, 5000);
  }
}
