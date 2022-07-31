import { metricsName } from './store';
import { transportType } from '../Transport';
import PerformanceVitals from '.';

export default class BuilderInstance {
  constructor(public performanceInstance: PerformanceVitals) { }

  /**
   * 页面性能数据 格式化
   * @param type 小类
   * @returns 格式化好的数据
   */
  performanceDataBuilder(type: transportType) {
    const metrics = this.performanceInstance.metrics;
    function paintBuilder() {
      return {
        FP: metrics.get(metricsName.FP)?.startTime,
        FCP: metrics.get(metricsName.FCP)?.startTime,
        FMP: metrics.get(metricsName.FMP)?.startTime,
        LCP: metrics.get(metricsName.LCP)?.startTime,
      };
    }

    function timingBuilder() {
      return metrics.get(metricsName.NT);
    }

    function longTaskBuilder() {
      return {
        startTime: metrics.get(metricsName.LT)?.startTime,
        duration: metrics.get(metricsName.LT)?.entry.duration,
      };
    }

    function CLSBuilder() {
      return {
        clsValue: metrics.get(metricsName.CLS)?.clsValue,
      };
    }

    function RFBuilder() {
      return metrics.get(metricsName.RF)
    }

    const buiderStore: Map<transportType, Function> = new Map([
      [transportType.paint, paintBuilder],
      [transportType.timing, timingBuilder],
      [transportType.LT, longTaskBuilder],
      [transportType.CLS, CLSBuilder],
      [transportType.RF, RFBuilder],
    ]);
    return buiderStore.get(type)?.();
  }
}
