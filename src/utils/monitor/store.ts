export interface IMetrics {
  [prop: string]: any
}

export enum metricsName {
  //性能监控
  FP = 'first-paint',
  FCP = 'first-contentful-paint',
  FMP = 'first-meaningful-paint',
  LCP = 'largest-contentful-paint',
  FID = 'first-input-delay',
  CLS = 'cumulative-layout-shift',
  NT = 'navigation-timing',
  RF = 'resource-flow',
  LT = 'longtask',
  //用户行为
  PI = 'page-information',
  OI = 'origin-information',
  RCR = 'router-change-record',
  CBR = 'click-behavior-record',
  CDR = 'custom-define-record',
  HT = 'http-record',
}

//Map 暂存数据
export default class MetricsStore {
  state: Map<metricsName | string, IMetrics>;

  constructor() {
    this.state = new Map<metricsName | string, IMetrics>()
  }

  set(key: metricsName | string, value: IMetrics): void {
    this.state.set(key, value)
  }

  add(key: metricsName | string, value: IMetrics): void {
    const keyValue = this.state.get(key);
    this.state.set(key, keyValue ? keyValue.concat([value]) : [value]);
  }

  get(key: metricsName | string): IMetrics | undefined {
    return this.state.get(key);
  }

  has(key: metricsName | string): boolean {
    return this.state.has(key);
  }

  clear() {
    this.state.clear();
  }

  getValues(): IMetrics {
    // Map 转为 对象 返回
    return Object.fromEntries(this.state);
  }

}

