import {
  PerformanceEntryHandler,
  MPerformanceNavigationTiming,
  ResourceFlowTiming,
} from './type'
//这里type是可以传数组的
const observe = (type: string, callback: PerformanceEntryHandler): PerformanceObserver | undefined => {
  //PerformanceObserver.supportedEntryTypes返回用户代理支持 PerformanceObserver的值数组entryType
  //PerformanceEntry.entryType 返回表示性能指标类型的字符串
  //类型合规，返回observe
  if (PerformanceObserver.supportedEntryTypes.includes(type)) {
    //创建 PerformanceObserver 实例
    const ob: PerformanceObserver = new PerformanceObserver((entryList) => {
      return entryList.getEntries().map(callback)
    })
    //实例调用observe函数 指定监测的 entry types 的集合。 当 performance entry 被记录并且是指定的 entryTypes 之一的时候，PerformanceObserver对象的回调函数会被调用。
    ob.observe({ entryTypes: [type] })
    return ob;
  }
  return undefined
}

//获取FP
export const getFP = (entryHandler: PerformanceEntryHandler) => {
  const [entry] = performance.getEntriesByName('first-paint');
  entryHandler(entry)
}

//获取FCP
export const getFCP = (entryHandler: PerformanceEntryHandler) => {
  const [entry] = performance.getEntriesByName('first-contentful-paint');
  entryHandler(entry)
}

//获取LCP
export const getLCP = (entryHandler: PerformanceEntryHandler): PerformanceObserver | undefined => {
  return observe('largest-contentful-paint', entryHandler)
}

// 获取 FID
export const getFID = (entryHandler: PerformanceEntryHandler): PerformanceObserver | undefined => {
  return observe('first-input', entryHandler);
};

// 获取 CLS
export const getCLS = (entryHandler: PerformanceEntryHandler): PerformanceObserver | undefined => {
  return observe('layout-shift', entryHandler);
};

// 获取 NT
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
      FP: responseEnd - fetchStart,
      TTI: domInteractive - fetchStart,
      DomReady: domContentLoadedEventEnd - fetchStart,
      Load: loadEventStart - fetchStart,
      FirseByte: responseStart - domainLookupStart,
      // 关键时间段
      DNS: domainLookupEnd - domainLookupStart,
      TCP: connectEnd - connectStart,
      SSL: secureConnectionStart ? connectEnd - secureConnectionStart : 0,
      TTFB: responseStart - requestStart,
      Trans: responseEnd - responseStart,
      DomParse: domInteractive - responseEnd,
      Res: loadEventStart - domContentLoadedEventEnd,
    };
  };

  // W3C Level2  PerformanceNavigationTiming
  // 使用了High-Resolution Time，时间精度可以达毫秒的小数点好几位。
  const navigation = performance.getEntriesByType('navigation')[0];
  return resolveNavigationTiming(navigation as PerformanceNavigationTiming);
};

// 获取 RF
export const getResourceFlow = (resourceFlow: Array<ResourceFlowTiming>): PerformanceObserver | undefined => {
  const entryHandler = (entry: PerformanceResourceTiming) => {
    const {
      name,
      transferSize,
      initiatorType,
      startTime,
      responseEnd,
      domainLookupEnd,
      domainLookupStart,
      connectStart,
      connectEnd,
      secureConnectionStart,
      responseStart,
      requestStart,
    } = entry;
    resourceFlow.push({
      // name 资源地址
      name,
      // transferSize 传输大小
      transferSize,
      // initiatorType 资源类型
      initiatorType,
      // startTime 开始时间
      startTime,
      // responseEnd 结束时间
      responseEnd,
      // 贴近 Chrome 的近似分析方案，受到跨域资源影响
      dnsLookup: domainLookupEnd - domainLookupStart,
      initialConnect: connectEnd - connectStart,
      ssl: connectEnd - secureConnectionStart,
      request: responseStart - requestStart,
      ttfb: responseStart - requestStart,
      contentDownload: responseStart - requestStart,
    });
  };

  return observe('resource', entryHandler);
};

