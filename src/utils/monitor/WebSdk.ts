import BuilderInstance from "./BuilderInstance/BuilderInstance";
import DimensionInstance from "./DimensionInstance/DimensionInstance";
import TransportInstance from "./Transport/Transport";
import UserVitals from "./UserVitals/UserVitals";
import WebVitals from "./WebVitals/WebVitals";

export interface EngineInstance {
  performanceInstance: WebVitals,
  userInstance: UserVitals,
  dimensionInstance: DimensionInstance,
  builderInstance: BuilderInstance,
  transportInstance: TransportInstance,
}

export interface initOptions {
  aid: string, // 应用ID，唯一必填参数
  [key: string | number]: any
}

// 服务于 Web 的SDK，继承了 Core 上的与平台无关方法;
class WebSdk {
  // 性能监控实例，实例里每个插件实现一个性能监控功能；
  public performanceInstance: WebVitals;

  // 行为监控实例，实例里每个插件实现一个行为监控功能；
  public userInstance: UserVitals;

  // 错误监控实例，实例里每个插件实现一个错误监控功能；
  // public errorInstance: ErrorVitals;

  // 上报实例，这里面封装上报方法
  public transportInstance: TransportInstance;

  // 数据格式化实例
  public builderInstance: BuilderInstance;

  // 维度实例，用以初始化 uid、sid等信息
  public dimensionInstance: DimensionInstance;

  // 参数初始化实例
  // public configInstance: ConfigInstance;

  // private options: initOptions;

  constructor(options: initOptions) {
    // this.configInstance = new ConfigInstance(this, options);
    this.performanceInstance = new WebVitals(this)
    this.userInstance = new UserVitals(this)
    this.dimensionInstance = new DimensionInstance(this, options)
    this.builderInstance = new BuilderInstance(this)
    this.transportInstance = new TransportInstance(this)
  }
}

export default WebSdk;