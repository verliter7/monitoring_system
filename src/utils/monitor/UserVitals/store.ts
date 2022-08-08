import { behaviorStack, behaviorRecordsOptions } from './type';
export interface IMetrics {
  [prop: string]: any
}

export enum metricsName {
  //用户行为
  PI = 'page-information',
  OI = 'origin-information',
  RCR = 'router-change-record',
  CBR = 'click-behavior-record',
  CDR = 'custom-define-record',
  HT = 'http-record',
  RD = 'route-duration'
}

//Map 暂存数据
export class MetricsStore {
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

// 暂存用户的行为记录追踪
export class BehaviorStore {
  // 数组形式的 stack
  private state: Array<behaviorStack>;

  // 记录的最大数量
  private maxBehaviorRecords: number;

  // 外部传入 options 初始化，
  constructor(options: behaviorRecordsOptions) {
    const { maxBehaviorRecords } = options;
    this.maxBehaviorRecords = maxBehaviorRecords;
    this.state = [];
  }

  // 从底部插入一个元素，且不超过 maxBehaviorRecords 限制数量
  push(value: behaviorStack) {
    if (this.length() === this.maxBehaviorRecords) {
      this.shift();
    }
    this.state.push(value);
  }

  // 从顶部删除一个元素，返回删除的元素
  shift() {
    return this.state.shift();
  }

  length() {
    return this.state.length;
  }

  get() {
    return this.state;
  }

  clear() {
    this.state = [];
  }
}
