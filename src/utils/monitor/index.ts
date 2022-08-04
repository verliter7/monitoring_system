import TransportInstance, { transportKind } from './Transport';
import PerformanceVitals from './PerformanceVitals';
import ErrorVitals from './ErrorVitals';
import UserVitals from './UserVitals';

import { errorUrl, businessUrl } from './utils/urls';
// import ErrorVitals from './ErrorVitals2';

export interface EngineInstance {
  performanceInstance: PerformanceVitals;
  transportInstance: TransportInstance;
  userInstance: UserVitals;
  errorCatchInstance: ErrorVitals;
}

export interface initOptions {
  aid: string; // 应用ID，唯一必填参数
  [key: string | number]: any;
}

// 服务于 Web 的SDK，继承了 Core 上的与平台无关方法;
class WebSdk {
  // 性能监控实例，实例里每个插件实现一个性能监控功能；
  public performanceInstance: PerformanceVitals;

  // 行为监控实例，实例里每个插件实现一个行为监控功能；
  public userInstance: UserVitals;

  // 错误监控实例，实例里每个插件实现一个错误监控功能；
  public errorCatchInstance: ErrorVitals;

  // 上报实例，这里面封装上报方法
  public transportInstance: TransportInstance;

  constructor(options: initOptions) {
    // this.configInstance = new ConfigInstance(this, options);
    this.transportInstance = new TransportInstance(this, {
      transportUrl: new Map([
        [transportKind.stability, errorUrl],
        [transportKind.performance, ' '],
        [transportKind.business, businessUrl],
      ]),
    });

    this.userInstance = new UserVitals(this);
    this.performanceInstance = new PerformanceVitals(this, options);
    this.errorCatchInstance = new ErrorVitals(this, options);
    // this.errorCatchInstance = new ErrorVitals(this);
  }
}

export default WebSdk;
