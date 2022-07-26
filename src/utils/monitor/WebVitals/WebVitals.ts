import MetricsStore, { IMetrics, metricsName } from "../store";
import {
  getFP,
  getFCP,
  getLCP,
  getFMP,
  getFID,
  getCLS,
  getNavigationTiming,
  getResourceFlow,
  getLongTask,
} from './GetEntry'
import {
  LayoutShift,
  ResourceFlowTiming,
} from "./type";
import { EngineInstance } from "../WebSdk";
import { transportCategory, transportKind, transportType } from "../Transport/Transport";


export const afterLoad = (callback: any) => {
  //Document.readyState 属性描述了document 的加载状态 complete加载完成
  if (document.readyState === 'complete') {
    setTimeout(callback)
  } else {
    /**
     * pageshow触发时机
     * 1.最初加载页面
     * 2.从同一窗口或选项卡中的另一页导航到页面
     * 3.恢复移动OS上的冷冻页面
     * 4.使用浏览器的前或后按钮返回页面
     */
    /**
     * capture: Boolean，表示 listener 会在该类型的事件捕获阶段传播到该 EventTarget 时触发。
     * once: Boolean，表示 listener 在添加之后最多只调用一次。如果是 true， listener 会在其被调用之后自动移除。
     */
    window.addEventListener('pageshow', callback, { once: true, capture: true })
  }
}

// 初始化入口，外部调用只需要 new WebVitals();
export default class WebVitals {
  private engineInstance: EngineInstance;

  //本地暂存数据在Map里面
  public metrics: MetricsStore;

  constructor(engineInstance: EngineInstance) {
    this.engineInstance = engineInstance;
    this.metrics = new MetricsStore();
    this.initLCP();
    this.initCLS();
    this.initResourceFlow();
    this.initLongTask()

    // 这里的 FP/FCP/FID resource需要在页面成功加载了再进行获取
    afterLoad(() => {
      this.initNavigationTiming();
      this.initFP();
      this.initFCP();
      this.initFID();
      this.perfSendHandler();
    });
  }

  //性能数据的上报策略
  perfSendHandler = (): void => {
    // 如果你要监听 FID 数据。你就需要等待 FID 参数捕获完成后进行上报;
    // 如果不需要监听 FID，那么这里你就可以发起上报请求了;
    console.log(this.metrics.getValues());

    // 数据上报
    this.engineInstance.transportInstance.kernelTransportHandler(
      transportKind.performance,
      transportType.paint,
      this.engineInstance.builderInstance.builderStrategy.get(transportKind.performance)?.(transportType.paint)
    );
  }

  //W3C标准化在 w3c/paint-timing 定义了 首次非网页背景像素渲染（fp）(白屏时间) 和  首次内容渲染（fcp)(灰屏时间)，我们可以直接去取;

  // 初始化 FP 的获取以及返回
  initFP = (): void => {
    const entryHandler = (entry: PerformanceEntry) => {
      const metrics = {
        startTime: entry?.startTime.toFixed(2),
        entry,
      } as IMetrics
      this.metrics.set(metricsName.FP, metrics)
    }
    getFP(entryHandler)
  };

  // 初始化 FCP 的获取以及返回
  initFCP = (): void => {
    const entryHandler = (entry: PerformanceEntry) => {
      const metrics = {
        startTime: entry?.startTime.toFixed(2),
        entry,
      } as IMetrics
      this.metrics.set(metricsName.FCP, metrics)
    }
    getFCP(entryHandler)
  };

  // 初始化 LCP 的获取以及返回
  initLCP = (): void => {
    const entryHandler = (entry: PerformanceEntry) => {
      const metrics = {
        startTime: entry?.startTime.toFixed(2),
        entry,
      } as IMetrics
      this.metrics.set(metricsName.LCP, metrics)
    }
    getLCP(entryHandler);
  };

  // 初始化 FMP 的获取以及返回
  initFMP = (): void => {
    const entryHandler = (entry: PerformanceEntry) => {
      const metrics = {
        startTime: entry?.startTime.toFixed(2),
        entry,
      } as IMetrics
      this.metrics.set(metricsName.FMP, metrics)
    }
    getFMP(entryHandler);
  }

  // 初始化 FID 的获取以及返回
  initFID = (): void => {
    const entryHandler = (entry: PerformanceEventTiming) => {
      const metrics = {
        delay: entry.processingStart - entry.startTime,
        entry,
      } as IMetrics;
      this.metrics.set(metricsName.FID, metrics);
    };
    getFID(entryHandler);
  };

  // 初始化 CLS 的获取以及返回 累积布局移动 计算积分
  initCLS = (): void => {
    let clsValue = 0;
    let clsEntries = [];

    let sessionValue = 0;
    let sessionEntries: Array<LayoutShift> = [];

    const entryHandler = (entry: LayoutShift) => {
      if (!entry.hadRecentInput) {
        const firstSessionEntry = sessionEntries[0];
        const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

        // 如果条目与上一条目的相隔时间小于 1 秒且
        // 与会话中第一个条目的相隔时间小于 5 秒，那么将条目
        // 包含在当前会话中。否则，开始一个新会话。
        if (
          sessionValue &&
          entry.startTime - lastSessionEntry.startTime < 1000 &&
          entry.startTime - firstSessionEntry.startTime < 5000
        ) {
          sessionValue += entry.value;
          sessionEntries.push(entry);
        } else {
          sessionValue = entry.value;
          sessionEntries = [entry];
        }

        // 如果当前会话值大于当前 CLS 值，
        // 那么更新 CLS 及其相关条目。
        if (sessionValue > clsValue) {
          clsValue = sessionValue;
          clsEntries = sessionEntries;

          // 记录 CLS 到 Map 里
          const metrics = {
            entry,
            clsValue,
            clsEntries,
          } as IMetrics;
          this.metrics.set(metricsName.CLS, metrics);
        }
      }
    };
    getCLS(entryHandler);
  };

  // 初始化 NT 的获取以及返回 以技术为中心的性能指标
  initNavigationTiming = (): void => {
    const navigationTiming = getNavigationTiming();
    const metrics = navigationTiming as IMetrics;
    this.metrics.set(metricsName.NT, metrics);
  };

  // 初始化 RF 的获取以及返回 静态资源瀑布图
  initResourceFlow = (): void => {
    const resourceFlow: Array<ResourceFlowTiming> = [];
    const observer = getResourceFlow(resourceFlow);

    const stopListening = () => {
      const metrics = resourceFlow as IMetrics;
      this.metrics.set(metricsName.RF, metrics);
    };
    // 当页面 pageshow 触发时，中止
    window.addEventListener('pageshow', stopListening, { once: true, capture: true });
  };

  // 初始化 longtask 的获取以及返回
  initLongTask = (): void => {
    const entryHandler = (entry: PerformanceEntry) => {
      // 超过100ms就认为是长任务
      if (entry.duration > 100) {
        const metrics = {
          startTime: entry?.startTime.toFixed(2),
          entry,
        } as IMetrics
        this.metrics.set(metricsName.LT, metrics)
      }
    }
    getLongTask(entryHandler)
  }
}


