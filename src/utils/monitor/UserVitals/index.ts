import { EngineInstance } from '..';
import { MetricsStore as UserMetricsStore, IMetrics, metricsName, BehaviorStore } from './store';
import { PageInformation, customAnalyticsData, httpMetrics, behaviorStack, OriginInformation } from './type';
import { wrHistory, proxyHistory, proxyHash, proxyXmlHttp, proxyFetch, getOriginInfo } from './event';
import { transportHandlerType, transportKind, transportType } from '../Transport';

export const afterLoad = (callback: any) => {
  if (document.readyState === 'complete') {
    setTimeout(callback);
  } else {
    window.addEventListener('pageshow', callback, { once: true, capture: true });
  }
};

export default class UserVitals {
  private engineInstance: EngineInstance;

  // 本地暂存数据在 Map 里 （也可以自己用对象来存储）
  public metrics: UserMetricsStore;

  public breadcrumbs: BehaviorStore;

  public customHandler: Function;

  // 最大行为追踪记录数
  public maxBehaviorRecords: number;

  // 允许捕获click事件的DOM标签 eg:button div img canvas
  clickMountList: Array<string>;

  constructor(engineInstance: EngineInstance) {
    this.engineInstance = engineInstance;
    this.metrics = new UserMetricsStore();
    // 限制最大行为追踪记录数为 100，真实场景下需要外部传入自定义;
    this.maxBehaviorRecords = 100;
    // 初始化行为追踪记录
    this.breadcrumbs = new BehaviorStore({ maxBehaviorRecords: this.maxBehaviorRecords });
    // 初始化 用户自定义 事件捕获
    this.customHandler = this.initCustomerHandler();
    // 作为 真实sdk 的时候，需要在初始化时传入与默认值合并;
    this.clickMountList = ['button'].map((x) => x.toLowerCase());
    // 重写事件
    wrHistory();
    // 初始化页面基本信息
    this.initPageInfo();
    // 初始化路由跳转获取
    this.initRouteChange();
    // 初始化用户来路信息获取
    this.initOriginInfo();
    // 初始化 PV 的获取;
    this.initPV();
    // 初始化 click 事件捕获
    this.initClickHandler(this.clickMountList);
    // 初始化 Http 请求事件捕获
    // this.initHttpHandler();
  }

  // 封装用户行为的上报入口
  userSendHandler = (data: IMetrics) => {
    // 进行通知内核实例进行上报;
    // this.engineInstance.transportInstance.kernelTransportHandler(
    //   transportKind.business,
    //   transportType.PV,
    //   data,
    //   transportHandlerType.xmlTransport,
    // );
  };

  // 补齐 pathname 和 timestamp 参数
  getExtends = (): { page: string; timestamp: number | string } => {
    return {
      page: this.getPageInfo().pathname,
      timestamp: new Date().getTime(),
    };
  };

  // 初始化用户自定义埋点数据的获取上报
  initCustomerHandler = (): Function => {
    const handler = (options: customAnalyticsData) => {
      // 记录到 UserMetricsStore
      this.metrics.add(metricsName.CDR, options);
      // 自定义埋点的信息一般立即上报
      this.userSendHandler(options);
      // 记录到用户行为记录栈
      const behavior = {
        category: metricsName.CDR,
        data: options,
        ...this.getExtends(),
      } as behaviorStack;
      this.breadcrumbs.push(behavior);
    };

    return handler;
  };

  // 获取 PI 页面基本信息
  getPageInfo = (): PageInformation => {
    const { host, hostname, href, protocol, origin, port, pathname, search, hash } = window.location;
    const { width, height } = window.screen;
    const { language, userAgent } = navigator;

    return {
      host,
      hostname,
      href,
      protocol,
      origin,
      port,
      pathname,
      search,
      hash,
      title: document.title,
      language: language.substr(0, 2),
      userAgent,
      winScreen: `${width}x${height}`,
      docScreen: `${document.documentElement.clientWidth || document.body.clientWidth}x${
        document.documentElement.clientHeight || document.body.clientHeight
      }`,
    };
  };

  // 初始化 PI 页面基本信息的获取以及返回
  initPageInfo = (): void => {
    const info: PageInformation = this.getPageInfo();
    const metrics = info as IMetrics;
    this.metrics.set(metricsName.PI, metrics);
  };

  // 初始化 RCR 路由跳转的获取以及返回
  initRouteChange = (): void => {
    const handler = (e: Event) => {
      // 正常记录
      const metrics = {
        // 跳转的方法 eg:replaceState
        jumpType: e.type,
        // 创建时间
        timestamp: new Date().getTime(),
        // 页面信息
        pageInfo: this.getPageInfo(),
      } as IMetrics;
      // 一般路由跳转的信息不会进行上报，根据业务形态决定；
      this.metrics.add(metricsName.RCR, metrics);
      // 行为记录 不需要携带 pageInfo
      delete metrics.pageInfo;
      // 记录到行为记录追踪
      const behavior = {
        category: metricsName.RCR,
        data: metrics,
        ...this.getExtends(),
      } as behaviorStack;
      this.breadcrumbs.push(behavior);
    };
    proxyHash(handler);
    // 为 pushState 以及 replaceState 方法添加 Evetn 事件
    proxyHistory(handler);
  };

  // 初始化 PV 的获取以及返回 数据上报：页面加载完上报一次，跳转一次路由上报一次
  initPV = (): void => {
    const handler = () => {
      const metrics = {
        // 还有一些标识用户身份的信息，由项目使用方传入，任意拓展 eg:userId
        // 创建时间
        timestamp: new Date().getTime(),
        // 页面信息
        pageInfo: this.getPageInfo(),
        // 用户来路
        originInformation: getOriginInfo(),
      } as IMetrics;
      this.userSendHandler(metrics);
      // 一般来说， PV 可以立即上报
    };
    afterLoad(() => {
      handler();
    });
    proxyHash(handler);
    // 为 pushState 以及 replaceState 方法添加 Evetn 事件
    proxyHistory(handler);
  };

  // 初始化 OI 用户来路的获取以及返回
  initOriginInfo = (): void => {
    const info: OriginInformation = getOriginInfo();
    const metrics = info as IMetrics;
    this.metrics.set(metricsName.OI, metrics);
  };

  // 初始化 CBR 点击事件的获取和返回
  initClickHandler = (mountList: Array<string>): void => {
    const handler = (e: MouseEvent | any) => {
      // 这里是根据 tagName 进行是否需要捕获事件的依据，可以根据自己的需要，额外判断id\class等
      // 先判断浏览器支持 e.path ，从 path 里先取
      let target = e.path?.find((x: Element) => mountList.includes(x.tagName?.toLowerCase()));
      // 不支持 path 就再判断 target
      target = target || (mountList.includes(e.target.tagName?.toLowerCase()) ? e.target : undefined);
      if (!target) return;
      const metrics = {
        tagInfo: {
          id: target.id,
          classList: Array.from(target.classList),
          tagName: target.tagName,
          text: target.textContent,
        },
        // 创建时间
        timestamp: new Date().getTime(),
        // 页面信息
        pageInfo: this.getPageInfo(),
      } as IMetrics;
      // 除开商城业务外，一般不会特意上报点击行为的数据，都是作为辅助检查错误的数据存在;
      this.metrics.add(metricsName.CBR, metrics);
      // 行为记录 不需要携带 完整的pageInfo
      delete metrics.pageInfo;
      // 记录到行为记录追踪
      const behavior = {
        category: metricsName.CBR,
        data: metrics,
        ...this.getExtends(),
      } as behaviorStack;
      this.breadcrumbs.push(behavior);
    };
    window.addEventListener(
      'click',
      (e) => {
        handler(e);
      },
      true,
    );
  };

  // 初始化 http 请求的数据获取和上报
  // initHttpHandler = (): void => {
  //   const loadHandler = (metrics: httpMetrics) => {
  //     if (metrics.status < 400) {
  //       // 对于正常请求的 HTTP 请求来说,不需要记录 请求体 和 响应体
  //       delete metrics.response;
  //       delete metrics.body;
  //     }
  //     // 记录到 UserMetricsStore
  //     this.metrics.add(metricsName.HT, metrics);
  //     // 记录到用户行为记录栈
  //     const behavior = {
  //       category: metricsName.HT,
  //       data: metrics,
  //       ...this.getExtends(),
  //     } as behaviorStack;
  //     this.breadcrumbs.push(behavior);
  //   };
  //   proxyXmlHttp(null, loadHandler);
  //   proxyFetch(null, loadHandler);
  // };
}
