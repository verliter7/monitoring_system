import errorCatch from './catchError';

export default class MonitorCore {
  static instance: MonitorCore;
  static getInstance = (): MonitorCore => {
    if (!this.instance) {
      this.instance = new MonitorCore();
    }
    return this.instance;
  };

  init(APP_MONITOR_ID: string, serverUrl: string) {
    errorCatch(APP_MONITOR_ID, serverUrl);
  }
}
