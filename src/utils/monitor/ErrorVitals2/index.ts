import { EngineInstance } from "..";
import { transportHandlerType, transportKind, transportType } from "../Transport";
import { proxyFetch, proxyXmlHttp } from "../UserVitals/event";
import { httpMetrics } from "../UserVitals/type";
import { ErrorVitalsInitOptions, ExceptionMetrics, mechanismType, ResourceErrorTarget } from "./type";
import { getErrorUid, parseStackFrames } from "./utils";

// 判断是 JS异常、静态资源异常、还是跨域异常
export const getErrorKey = (event: ErrorEvent | Event) => {
  const isJsError = event instanceof ErrorEvent;
  if (!isJsError) return mechanismType.RS;
  return event.message === 'Script error.' ? mechanismType.CS : mechanismType.JS;
};

// 初始化的类
export default class ErrorVitals {
  private engineInstance: EngineInstance;

  // 已上报的错误 uid
  private submitErrorUids: Array<string>;

  constructor(engineInstance: EngineInstance, options?: ErrorVitalsInitOptions) {
    // const { Vue } = options;
    this.engineInstance = engineInstance;
    this.submitErrorUids = [];
    // 初始化 js错误
    this.initJsError();
    // 初始化 静态资源加载错误
    this.initResourceError();
    // 初始化 Promise异常
    this.initPromiseError();
    // 初始化 HTTP请求异常
    this.initHttpError();
    // 初始化 跨域异常
    this.initCorsError();
    // 初始化 Vue异常
    // this.initVueError(Vue);
  }

  // 封装错误的上报入口，上报前，判断错误是否已经发生过
  errorSendHandler = (data: ExceptionMetrics) => {
    // 统一加上 用户行为追踪 和 页面基本信息
    const submitParams = {
      ...data,
      breadcrumbs: this.engineInstance.userInstance.breadcrumbs.get(),
      pageInformation: this.engineInstance.userInstance.metrics.get('page-information'),
    } as ExceptionMetrics;
    // 判断同一个错误在本次页面访问中是否已经发生过;
    const hasSubmitStatus = this.submitErrorUids.includes(submitParams.errorUid);
    // 检查一下错误在本次页面访问中，是否已经产生过
    if (hasSubmitStatus) return;
    this.submitErrorUids.push(submitParams.errorUid);
    // 记录后清除 breadcrumbs
    this.engineInstance.userInstance.breadcrumbs.clear();
    // 一般来说，有报错就立刻上报;
    this.engineInstance.transportInstance.kernelTransportHandler(
      transportKind.stability,
      transportType.jsError,
      submitParams,
      transportHandlerType.imageTransport,
    );
  };

  // 初始化 JS异常 的数据获取和上报
  initJsError = (): void => {
    const handler = (event: ErrorEvent) => {
      // 阻止向上抛出控制台报错
      event.preventDefault();
      // 如果不是 JS异常 就结束
      if (getErrorKey(event) !== mechanismType.JS) return;
      const exception = {
        // 上报错误归类
        mechanism: {
          type: mechanismType.JS,
        },
        // 错误信息
        value: event.message,
        // 错误类型
        type: (event.error && event.error.name) || 'UnKnowun',
        // 解析后的错误堆栈
        stackTrace: {
          frames: parseStackFrames(event.error),
        },
        // 用户行为追踪 breadcrumbs 在 errorSendHandler 中统一封装
        // 页面基本信息 pageInformation 也在 errorSendHandler 中统一封装
        // 错误的标识码
        errorUid: getErrorUid(`${mechanismType.JS}-${event.message}-${event.filename}`),
        // 附带信息
        meta: {
          // file 错误所处的文件地址
          file: event.filename,
          // col 错误列号
          col: event.colno,
          // row 错误行号
          row: event.lineno,
        },
      } as ExceptionMetrics;
      // 一般错误异常立刻上报，不用缓存在本地
      this.errorSendHandler(exception);
    };
    window.addEventListener('error', (event) => handler(event), true);
  };

  // 初始化 静态资源异常 的数据获取和上报
  initResourceError = (): void => {
    const handler = (event: Event) => {
      event.preventDefault(); // 阻止向上抛出控制台报错
      // 如果不是跨域脚本异常,就结束
      if (getErrorKey(event) !== mechanismType.RS) return;
      const target = event.target as ResourceErrorTarget;
      const exception = {
        // 上报错误归类
        mechanism: {
          type: mechanismType.RS,
        },
        // 错误信息
        value: '',
        // 错误类型
        type: 'ResourceError',
        // 用户行为追踪 breadcrumbs 在 errorSendHandler 中统一封装
        // 页面基本信息 pageInformation 也在 errorSendHandler 中统一封装
        // 错误的标识码
        errorUid: getErrorUid(`${mechanismType.RS}-${target.src}-${target.tagName}`),
        // 附带信息
        meta: {
          url: target.src,
          html: target.outerHTML,
          type: target.tagName,
        },
      } as ExceptionMetrics;
      // 一般错误异常立刻上报，不用缓存在本地
      this.errorSendHandler(exception);
    };
    window.addEventListener('error', (event) => handler(event), true);
  };

  // 初始化 Promise异常 的数据获取和上报
  initPromiseError = (): void => {
    const handler = (event: PromiseRejectionEvent) => {
      event.preventDefault(); // 阻止向上抛出控制台报错
      const value = event.reason.message || event.reason;
      const type = event.reason.name || 'UnKnowun';
      const exception = {
        // 上报错误归类
        mechanism: {
          type: mechanismType.UJ,
        },
        // 错误信息
        value,
        // 错误类型
        type,
        // 解析后的错误堆栈
        stackTrace: {
          frames: parseStackFrames(event.reason),
        },
        // 用户行为追踪 breadcrumbs 在 errorSendHandler 中统一封装
        // 页面基本信息 pageInformation 也在 errorSendHandler 中统一封装
        // 错误的标识码
        errorUid: getErrorUid(`${mechanismType.UJ}-${value}-${type}`),
        // 附带信息
        meta: {},
      } as ExceptionMetrics;
      // 一般错误异常立刻上报，不用缓存在本地
      this.errorSendHandler(exception);
    };

    window.addEventListener('unhandledrejection', (event) => handler(event), true);
  };

  // 初始化 HTTP请求异常 的数据获取和上报
  initHttpError = (): void => {
    const loadHandler = (metrics: httpMetrics) => {
      // 如果 status 状态码小于 400,说明没有 HTTP 请求错误
      if (metrics.status < 400) return;
      const value = metrics.response;
      const exception = {
        // 上报错误归类
        mechanism: {
          type: mechanismType.HP,
        },
        // 错误信息
        value,
        // 错误类型
        type: 'HttpError',
        // 错误的标识码
        errorUid: getErrorUid(`${mechanismType.HP}-${value}-${metrics.statusText}`),
        // 附带信息
        meta: {
          metrics,
        },
      } as ExceptionMetrics;
      // 一般错误异常立刻上报，不用缓存在本地
      this.errorSendHandler(exception);
    };
    proxyXmlHttp(null, loadHandler);
    proxyFetch(null, loadHandler);
  };

  // 初始化 跨域异常 的数据获取和上报
  initCorsError = (): void => {
    const handler = (event: ErrorEvent) => {
      // 阻止向上抛出控制台报错
      event.preventDefault();
      // 如果不是跨域脚本异常,就结束
      if (getErrorKey(event) !== mechanismType.CS) return;
      const exception = {
        // 上报错误归类
        mechanism: {
          type: mechanismType.CS,
        },
        // 错误信息
        value: event.message,
        // 错误类型
        type: 'CorsError',
        // 错误的标识码
        errorUid: getErrorUid(`${mechanismType.JS}-${event.message}`),
        // 附带信息
        meta: {},
      } as ExceptionMetrics;
      // 自行上报异常，也可以跨域脚本的异常都不上报;
      this.errorSendHandler(exception);
    };
    window.addEventListener('error', (event) => handler(event), true);
  };

  // 初始化 Vue异常 的数据获取和上报
  // initVueError = (app: Vue): void => {
  // // ... 详情代码在下
  // };
}

