import { DimensionStructure } from "./type";
import { EngineInstance, initOptions } from "../WebSdk";

// 维度实例，用以初始化 uid、sid等信息
export default class DimensionInstance {
  private engineInstance: EngineInstance;
  private options: initOptions

  constructor(engineInstance: EngineInstance, options: initOptions) {
    this.options = options
    this.engineInstance = engineInstance
  }

  getDimension = (): DimensionStructure => {
    const { aid } = this.options
    return {
      aid,
      url: window.location.href,
      userAgent: 'Chrome',
    }
  }
}