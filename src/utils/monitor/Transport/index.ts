import { EngineInstance } from '..';

export enum transportKind {
  stability = 'stability', // 稳定性
  performance = 'performance', // 性能
  business = 'business', // 用户
}

export enum transportType {
  jsError = 'jsError',
  promiseError = 'promiseError',
  httpError = 'httpError',
  resourceError = 'resourceError',
  blank = 'blank',
  timing = 'timing',
  paint = 'paint', // FP FCP FMP LCP FID
  FID = 'FID',
  LT = 'longTask',
  CLS = 'CLS',
  RF = 'resource-flow',
  PV = 'PV',
  RD = 'route-duration',
}

export enum transportHandlerType {
  initTransport = 'initTransportHandler',
  beaconTransport = 'beaconTransportHandler',
  xmlTransport = 'xmlTransportHandler',
  imageTransport = 'imageTransportHandler',
}

export interface TransportStructure {
  // 上报类别
  kind: transportKind; // 大类
  type: transportType; // 小类
  // 个性数据
  [key: string]: any;
}

export interface TransportParams {
  transportUrl: Map<transportKind, string | URL>;
  [key: string | number]: any;
}

export default class TransportInstance {
  constructor(public engineInstance: EngineInstance, public options: TransportParams) { }

  /**
   * 对外暴露的上报函数
   * @param kind 上报数据的大类
   * @param type 上报数据的小类
   * @param data 要上报的数据
   * @param transportHandler 选择上传方式
   */
  kernelTransportHandler = (
    kind: transportKind,
    type: transportType,
    data: Record<string, any>,
    transportHandler = transportHandlerType.initTransport,
  ): void => {
    const handler = this[transportHandler]();
    // 数据聚合
    const transportStructure: TransportStructure = {
      kind,
      type,
      ...data, // 上报数据
    };
    // 上报url
    const transportUrl = this.options.transportUrl.get(kind);
    const delay = Reflect.has(window, 'requestIdleCallback') ? requestIdleCallback : setTimeout;

    // 让浏览器空闲时调用上报函数
    delay(() => {
      handler(transportStructure, transportUrl);
    });
  };

  // 初始化上报方法
  initTransportHandler = () => {
    return typeof navigator.sendBeacon === 'function' ? this.beaconTransportHandler() : this.xmlTransportHandler();
  };

  // beacon 形式上报
  beaconTransportHandler = (): Function => {
    const handler = (data: TransportStructure, transportUrl: string) => {
      const formData = new FormData()
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          formData.append(key, data[key]);
        }
      }
      const status = window.navigator.sendBeacon(transportUrl, formData);
      // 如果数据量过大，则本次大数据量用 XMLHttpRequest 上报
      if (!status) this.xmlTransportHandler().apply(this, data);
    };
    return handler;
  };

  // XMLHttpRequest 形式上报
  xmlTransportHandler = (): Function => {
    const handler = (data: TransportStructure, transportUrl: string) => {
      const formData = new FormData()
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          formData.append(key, data[key]);
        }
      }
      const xhr = new XMLHttpRequest();
      xhr.open('POST', transportUrl, true);
      // xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(formData);
    };
    return handler;
  };

  //image 形式上报
  imageTransportHandler = (): Function => {
    const handler = (data: TransportStructure, transportUrl: string) => {
      const result: string[] = [];

      for (const [k, v] of Object.entries(data)) {
        result.push(`${k}=${v}`);
      }
      const img = new Image();

      img.src = `${transportUrl}?${result.join('&')}`;
    };
    return handler;
  };
}
