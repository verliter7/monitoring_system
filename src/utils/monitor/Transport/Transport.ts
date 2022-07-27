import { DimensionStructure } from "../DimensionInstance/type";
import { EngineInstance, initOptions } from "..";

export enum transportCategory {
  // PV = 'pv',// PV访问数据
  // PERF = 'perf',// 性能数据
  // API = 'api',// api 请求数据
  // ERROR = 'error',// 报错数据
  // CUS = 'custom',// 自定义行为
}

export enum transportKind {
  stability = 'stability', // 稳定性
  performance = 'performance', // 性能
  business = 'business', // 用户
}

export enum transportType {
  error = 'error',
  xhr = 'xhr',
  blank = 'blank',
  timing = 'timing',
  paint = 'paint', // FP FCP FMP LCP
  FID = 'FID',
  LT = 'longTask',
  CLS = 'CLS',
  RF = 'resource-flow',
  PV = 'PV',
}
export interface TransportStructure extends DimensionStructure {
  // 上报类别
  kind: transportKind, // 大类
  type: transportType, // 小类
  // 个性数据
  [key: string]: any
}

export interface TransportParams {
  transportUrl: Map<transportKind, string>,
  [key: string | number]: any
}

export default class TransportInstance {
  private engineInstance: EngineInstance;
  private options: TransportParams;

  constructor(engineInstance: EngineInstance, options: TransportParams) {
    this.engineInstance = engineInstance;
    this.options = options
  }

  /**
   * 对外暴露的上报函数
   * @param kind 上报数据的大类
   * @param type 上报数据的小类
   * @param data 要上报的数据
   * @returns
   */
  kernelTransportHandler = (kind: transportKind, type: transportType, data: Object): void => {
    const transportHandler = this.initTransportHandler()
    // 数据聚合
    const transportStructure: TransportStructure = {
      ...this.engineInstance.dimensionInstance.getDimension(), // 维度数据
      kind,
      type,
      ...data // 上报数据
    };
    // 上报url
    let transportUrl = this.options.transportUrl.get(kind)
    // 让浏览器空闲时调用上报函数
    typeof window.requestIdleCallback === 'function'
      ? requestIdleCallback(() => { transportHandler(transportStructure, transportUrl) })
      : setTimeout(() => { transportHandler(transportStructure, transportUrl) }, 0)
  }

  // 初始化上报方法
  initTransportHandler = () => {
    return typeof navigator.sendBeacon === 'function' ? this.beaconTransport() : this.xmlTransport();
  };

  // beacon 形式上报
  beaconTransport = (): Function => {
    const handler = (data: TransportStructure, transportUrl: string) => {
      const status = window.navigator.sendBeacon(transportUrl, JSON.stringify(data));
      // 如果数据量过大，则本次大数据量用 XMLHttpRequest 上报
      if (!status) this.xmlTransport().apply(this, data);
    };
    return handler;
  };

  // XMLHttpRequest 形式上报
  xmlTransport = (): Function => {
    const handler = (data: TransportStructure, transportUrl: string) => {
      const xhr = new (window as any).oXMLHttpRequest();
      xhr.open('POST', transportUrl, true);
      xhr.send(JSON.stringify(data));
    };
    return handler;
  };

  //image 形式上报
  imageTransport = (): Function => {
    const handler = (query: TransportStructure, transportUrl: string) => {
      let queryStr = Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&')
      let img = new Image();
      img.src = `${transportUrl}?${queryStr}`
    }
    return handler
  }
}