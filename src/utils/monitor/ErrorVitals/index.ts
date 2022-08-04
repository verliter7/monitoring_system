import { JsError, PromiseError, ResourceError, HttpRequestError } from './errorClass';
import { pocessStackInfo, getUrlHref, getErrorKey, errorTypeMap } from './utils';
import { EngineInstance, initOptions } from '..';
import TransportInstance, { transportKind, transportType, transportHandlerType } from '../Transport';
import { ErrorType } from './type';

export default class ErrorVitals {
  serverUrl: string;
  transportInstance: TransportInstance;

  constructor(public engineInstance: EngineInstance, public options: initOptions) {
    this.transportInstance = this.engineInstance.transportInstance;

    const serverUrl = this.transportInstance.options.transportUrl.get(transportKind.stability)!;
    this.serverUrl = serverUrl instanceof URL ? serverUrl.href : serverUrl;
    this.init();
  }

  init() {
    this.initJsError();
    this.initResourceError();
    this.initPromiseError();
    this.initProxyXml();
    this.initProxyFetch();
  }

  /**
   * @description: 上报错误数据方法
   * @param errorType 错误类型
   * @param errorData 错误数据
   */
  sendError(errorType: transportType, errorData: JsError | PromiseError | ResourceError | HttpRequestError) {
    this.transportInstance.kernelTransportHandler(
      transportKind.stability,
      errorType,
      errorData,
      transportHandlerType.imageTransport,
    );
  }

  /**
   * @description: 监听js错误
   */
  initJsError() {
    const handler = (errorEvent: ErrorEvent) => {
      if (getErrorKey(errorEvent) !== ErrorType.JS) return;
      const { error, message: errorMsg, lineno, colno } = errorEvent;
      const errorType = error.toString().split(':')[0];
      const errorStack = error.stack;
      const jsError = new JsError(
        {
          errorType,
          errorStack: pocessStackInfo(errorStack),
          errorMsg,
          errPos: `${lineno}:${colno}`,
        },
        this.options,
      );

      jsError.errorId && this.sendError(transportType.jsError, jsError);
    };

    window.addEventListener('error', handler, true);
  }

  /**
   * @description: 监听静态资源加载错误
   */
  initResourceError() {
    const handler = (errorEvent: ErrorEvent) => {
      if (getErrorKey(errorEvent) !== ErrorType.RS) return;

      const { attributes } = errorEvent.target as HTMLElement;
      const errorType = ErrorType.RS;
      const requestUrl = attributes.getNamedItem('src')?.nodeValue ?? attributes.getNamedItem('href')?.nodeValue;

      const errorMsg = 'resource loading error';
      const resourceError = new ResourceError(
        {
          errorType,
          errorMsg,
          requestUrl: requestUrl as string,
        },
        this.options,
      );

      resourceError.errorId && this.sendError(transportType.resourceError, resourceError);
    };

    window.addEventListener('error', handler, true);
  }

  /**
   * @description: 监听没有catch的promise错误
   */
  initPromiseError() {
    const handler = (errorEvent: PromiseRejectionEvent) => {
      const defaultErrorParams = {
        errorType: ErrorType.UJ,
      };
      let promiseError: PromiseError;

      if (typeof errorEvent.reason === 'object') {
        const { stack: errorStack, message: errorMsg } = errorEvent.reason;

        promiseError = new PromiseError(
          Object.assign(defaultErrorParams, {
            errorStack: pocessStackInfo(errorStack),
            errorMsg,
          }),
          this.options,
        );
      } else {
        promiseError = new PromiseError(
          Object.assign(defaultErrorParams, {
            errorMsg: errorEvent.reason,
          }),
          this.options,
        );
      }

      promiseError.errorId && this.sendError(transportType.promiseError, promiseError);
    };

    window.addEventListener('unhandledrejection', handler, true);
  }

  /**
   * @description: 劫持ajax请求
   */
  initProxyXml() {
    const serverUrl = getUrlHref(this.serverUrl);
    const oldOpen = XMLHttpRequest.prototype.open;
    const options = this.options;
    const _this = this;

    // @ts-ignore
    XMLHttpRequest.prototype.open = function (method, url, async, username, password) {
      const newUrl = getUrlHref(url);
      async = true;

      this.ajaxData = {
        method,
        url,
        newUrl,
      };

      return oldOpen.call(this, method, url, async, username, password);
    };

    const oldSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.send = function (body) {
      // 去除上报数据接口的错误捕获
      if (serverUrl !== this.ajaxData.newUrl) {
        const start = Date.now();
        const handleError = function (this: XMLHttpRequest, errorEvent: ProgressEvent<XMLHttpRequestEventTarget>) {
          const { type: eventType } = errorEvent;
          let {
            ajaxData: { url: requestUrl, method },
            status,
            statusText,
          } = this;

          requestUrl = requestUrl instanceof URL ? requestUrl.href : requestUrl;
          method = method.toUpperCase();

          const defaultParams = {
            errorType: 'unknown',
            requestUrl,
            method,
            status,
            statusText,
            duration: `${Date.now() - start}`,
          };

          // 根据状态码判断是否ajax请求是否出错
          if (eventType === 'loadend' && status < 400) return;

          if (window.navigator.onLine) {
            // eventType为'error'证明是网络断开或者请求跨域出错
            const httpRequestError = new HttpRequestError(
              {
                ...defaultParams,
                errorType: errorTypeMap[eventType],
              },
              options,
            );

            httpRequestError.errorId && _this.sendError(transportType.httpError, httpRequestError);
          } else {
            // 如果是断网导致的请求失败，则缓存请求，等到网络连接后重新上报数据
            window.addEventListener(
              'online',
              () => {
                const httpRequestError = new HttpRequestError(
                  {
                    ...defaultParams,
                    errorType: ErrorType.XN,
                  },
                  options,
                );

                httpRequestError.errorId && _this.sendError(transportType.httpError, httpRequestError);
              },
              {
                once: true,
              },
            );
          }
        };

        // 监听网络错误和ajax跨域错误
        this.addEventListener('error', handleError, {
          once: true,
        });
        // 监听ajax超时错误
        this.addEventListener('timeout', handleError, {
          once: true,
        });
        // ajax取消错误
        this.addEventListener('abort', handleError, {
          once: true,
        });
        // 无论成功或者失败都会被监听到
        this.addEventListener('loadend', handleError, {
          once: true,
        });
      }

      oldSend.call(this, body);
    };
  }

  /**
   * @description: 劫持fetch请求
   */
  initProxyFetch() {
    const oldFetch = window.fetch;

    const newFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const result = oldFetch(input, init);
      const start = Date.now();

      result.then((response) => {
        const { ok, status, statusText } = response;

        if (!ok) {
          let httpRequestError: HttpRequestError;
          const defaultParams = {
            errorType: ErrorType.HP,
            requestUrl: '',
            method: '',
            status,
            statusText,
            duration: `${Date.now() - start}`,
          };

          if (input instanceof Request) {
            const { url: requestUrl, method = 'GET' } = input;

            httpRequestError = new HttpRequestError(
              { ...defaultParams, requestUrl, method: method.toUpperCase() },
              this.options,
            );
          } else {
            input = input instanceof URL ? input.href : input;
            httpRequestError = new HttpRequestError(
              {
                ...defaultParams,
                requestUrl: input,
                method: init?.method ? init.method.toUpperCase() : 'GET',
              },
              this.options,
            );
          }
        }
      });

      return result;
    };

    window.fetch = newFetch;
  }
}
