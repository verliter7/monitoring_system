import DimensionInstance from '../DimensionInstance';
import { hashCode } from '../utils';
import type { EngineInstance, initOptions } from '..';
import type { PerformanceEntryHandler, MPerformanceNavigationTiming, ResourceFlowTiming } from './type';

const MAX_LIMIT = 10;
const resourceIdSet = new Set<string>();

/**
 * 性能条目观察者
 * @param type 性能条目的类型
 * @param callback 触发事件后回调
 * @param keepObserver 是否持续观察
 * @returns
 */
const observe = (
  type: string,
  callback: PerformanceEntryHandler,
  keepObserver: boolean,
): PerformanceObserver | undefined => {
  //PerformanceObserver.supportedEntryTypes返回用户代理支持 PerformanceObserver的值数组entryType
  //PerformanceEntry.entryType 返回表示性能指标类型的字符串
  //类型合规，返回observe
  if (PerformanceObserver.supportedEntryTypes?.includes(type)) {
    //创建 PerformanceObserver 实例
    const ob: PerformanceObserver = new PerformanceObserver((entryList, observer) => {
      entryList.getEntries().forEach(callback);
      //不再观察了
      keepObserver || observer.disconnect();
    });
    //实例调用observe函数 指定监测的 entry types 的集合。 当 performance entry 被记录并且是指定的 entryTypes 之一的时候，PerformanceObserver对象的回调函数会被调用。
    ob.observe({ entryTypes: [type] });
    return ob;
  }
  return undefined;
};

//获取FP 首次绘制
export const getFP = (entryHandler: PerformanceEntryHandler) => {
  const [entry] = performance.getEntriesByName('first-paint');
  entryHandler(entry);
};

//获取FCP 首次内容绘制
export const getFCP = (entryHandler: PerformanceEntryHandler) => {
  const [entry] = performance.getEntriesByName('first-contentful-paint');
  entryHandler(entry);
};

//获取LCP 最大内容绘制
export const getLCP = (entryHandler: PerformanceEntryHandler): PerformanceObserver | undefined => {
  return observe('largest-contentful-paint', entryHandler, false);
};

//获取FMP 首次有意义绘制
export const getFMP = (entryHandler: PerformanceEntryHandler): PerformanceObserver | undefined => {
  return observe('element', entryHandler, false);
};

// 获取 FID 首次输入延迟
export const getFID = (entryHandler: PerformanceEntryHandler): PerformanceObserver | undefined => {
  return observe('first-input', entryHandler, false);
};

// 获取 CLS 累积布局移动
export const getCLS = (entryHandler: PerformanceEntryHandler): PerformanceObserver | undefined => {
  return observe('layout-shift', entryHandler, true);
};

// 获取 NT 各种加载时间
export const getNavigationTiming = (): MPerformanceNavigationTiming | undefined => {
  const resolveNavigationTiming = (entry: PerformanceNavigationTiming): MPerformanceNavigationTiming => {
    const {
      domainLookupStart,
      domainLookupEnd,
      connectStart,
      connectEnd,
      secureConnectionStart,
      requestStart,
      responseStart,
      responseEnd,
      domInteractive,
      domContentLoadedEventEnd,
      loadEventStart,
      fetchStart,
    } = entry;

    return {
      // 关键时间点
      FP: responseEnd + '-' + fetchStart, // 首次渲染耗时 白屏时间 加载文档到第一帧非空图像的时间
      TTI: domInteractive + '-' + fetchStart, // 首次可交互时间
      DomReady: domContentLoadedEventEnd + '-' + fetchStart, // DOM阶段渲染耗时
      Load: loadEventStart + '-' + fetchStart, // 页面完全加载时间
      FirstByte: responseStart + '-' + domainLookupStart, // 首包时间耗时 DNS解析到响应返回给浏览器第一个字节的时间
      // 关键时间段
      DNS: domainLookupEnd + '-' + domainLookupStart, // DNS解析耗时
      TCP: connectEnd + '-' + connectStart, // TCP建立连接耗时
      SSL: secureConnectionStart ? connectEnd + '-' + secureConnectionStart : '0-0', //数据安全连接耗时
      TTFB: responseStart + '-' + requestStart, //网络请求耗时
      Trans: responseEnd + '-' + responseStart, // 响应数据传输耗时
      DomParse: domInteractive + '-' + responseEnd, // DOM解析耗时
      Res: loadEventStart + '-' + domContentLoadedEventEnd, // 资源加载耗时
    };
  };

  // W3C Level2  PerformanceNavigationTiming
  // 使用了High-Resolution Time，时间精度可以达毫秒的小数点好几位。
  const navigation =
    performance.getEntriesByType('navigation').length > 0
      ? performance.getEntriesByType('navigation')[0]
      : performance.timing; // W3C Level1  (目前兼容性高，仍然可使用，未来可能被废弃)。
  return resolveNavigationTiming(navigation as PerformanceNavigationTiming);
};

// 获取 RF 并上报
export const getResourceFlow = (
  engineInstance: EngineInstance,
  resourceFlowSet: Set<ResourceFlowTiming>,
  resourceUrl: string,
  options: initOptions,
) => {
  const entryHandler = (entry: PerformanceResourceTiming) => {
    const {
      name,
      transferSize,
      initiatorType,
      domainLookupEnd,
      domainLookupStart,
      connectStart,
      connectEnd,
      secureConnectionStart,
      responseStart,
      requestStart,
      duration,
    } = entry;
    const dimensionInstance = new DimensionInstance(options);
    const resourceId = hashCode(
      `${dimensionInstance.aid}${dimensionInstance.userMonitorId}${dimensionInstance.originUrl}${name}`,
    );

    // 这三种不算静态资源请求 排除
    if (
      initiatorType === 'xmlhttprequest' ||
      initiatorType === 'fetch' ||
      initiatorType === 'beacon' ||
      resourceIdSet.has(resourceId)
    )
      return;

    resourceIdSet.add(resourceId);
    resourceFlowSet.add(
      Object.assign(dimensionInstance, {
        resourceId,
        // name 资源地址
        requestUrl: name,
        // responseEnd - startTime 即开始发起请求到完整收到资源、传输连接关闭的时间
        duration,
        // transferSize 资源传输大小
        transferSize,
        // initiatorType 资源类型
        initiatorType,
        // dns解析时间
        dnsLookup: domainLookupEnd - domainLookupStart,
        // 初始连接时间
        initialConnect: connectEnd - connectStart,
        // ssl握手时间
        ssl: connectEnd - secureConnectionStart,
        // 资源响应时间 浏览器开始从服务器请求资源之前 - 浏览器收到服务器响应的第一个字节后的时间
        contentDownload: responseStart - requestStart,
      }),
    );

    if (resourceFlowSet.size === MAX_LIMIT) {
      const handler = engineInstance.transportInstance.initTransportHandler();

      handler(Array.from(resourceFlowSet), resourceUrl);
      resourceFlowSet.clear();
    }
  };

  observe('resource', entryHandler, true);
};

// 获取长任务
export const getLongTask = (entryHandler: PerformanceEntryHandler): PerformanceObserver | undefined => {
  return observe('longtask', entryHandler, true);
};
