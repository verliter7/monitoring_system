import { IMetrics, metricsName } from "../store";
import { transportKind, transportType } from "../Transport/Transport";
import { EngineInstance } from "../WebSdk";

export default class BuilderInstance {
  private engineInstance: EngineInstance;
  public builderStrategy: Map<transportKind, Function>

  constructor(engineInstance: EngineInstance) {
    this.engineInstance = engineInstance
    // 策略模式 对外暴露数据格式化函数
    this.builderStrategy = new Map([
      [transportKind.performance, this.performanceDataBuilder.bind(this)],
      [transportKind.stability, this.stabilityDataBuilder.bind(this)],
      [transportKind.business, this.businessDataBuilder.bind(this)],
    ])
  }

  /**
   * 页面性能数据 格式化
   * @param type 小类
   * @returns 格式化好的数据
   */
  performanceDataBuilder(type: transportType) {
    const metrics = this.engineInstance.performanceInstance.metrics
    function paintBuilder() {
      return {
        FP: metrics.get(metricsName.FP)?.startTime,
        FCP: metrics.get(metricsName.FCP)?.startTime,
        FMP: metrics.get(metricsName.FMP)?.startTime,
        LCP: metrics.get(metricsName.LCP)?.startTime,
      }
    }

    function timingBuilder() {
      return metrics.get(metricsName.NT)
    }

    function longTaskBuilder() {
      return {
        startTime: metrics.get(metricsName.LT)?.startTime,
        duration: metrics.get(metricsName.LT)?.entry.duration,
      }
    }

    function CLSBuilder() {
      console.log(metrics.get(metricsName.CLS)?.clsValue);

      return {
        clsValue: metrics.get(metricsName.CLS)?.clsValue
      }
    }

    function RFBuilder() {

    }

    const buiderStore: Map<transportType, Function> = new Map([
      [transportType.paint, paintBuilder],
      [transportType.timing, timingBuilder],
      [transportType.LT, longTaskBuilder],
      [transportType.CLS, CLSBuilder],
      [transportType.RF, RFBuilder],
    ])
    return buiderStore.get(type)?.()
  }

  /**
   * 稳定性数据 格式化
   * param type 小类
   * @returns 格式化好的数据
   */
  stabilityDataBuilder(type: transportType) {

  }

  /**
  * 用户行为数据 格式化
  * param type 小类
  * @returns 格式化好的数据
  */
  businessDataBuilder(type: transportType) {

  }
}