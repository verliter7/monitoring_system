import { JsError, PromiseError, ResourceError, HttpRequestError } from './errorClass';
import otherErrorType from '../utils/constant/otherErrorType';
import { pocessStackInfo, getUrlHref } from '../utils';
import { EngineInstance, initOptions } from '..';
import TransportInstance, { transportKind, transportType, transportHandlerType } from '../Transport';

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
    this.jsErrorListener();
    this.promiseRejectedListener();
    this.rewriteXHR();
    this.rewriteFetch();
  }

  /**
   * @description: 捕获js和资源加载错误
   */
  jsErrorListener() {
    window.addEventListener(
      'error',
      (errorEvent) => {
        const { localName, attributes } = errorEvent.target as HTMLElement;
        // e.target.localName有值就是资源错误，否者就是js代码执行出错
        if (localName) {
          const errorType = otherErrorType.RESOURCELOADED;
          const resourceUrl = attributes.getNamedItem('src')?.nodeValue ?? attributes.getNamedItem('href')?.nodeValue;
          const errorMsg = 'resource loading error';
          const resourceError = new ResourceError(
            {
              errorType,
              errorMsg,
              resourceUrl: resourceUrl as string,
            },
            this.options,
          );

          resourceError.errorId &&
            this.transportInstance.kernelTransportHandler(
              transportKind.stability,
              transportType.resourceError,
              resourceError,
              transportHandlerType.imageTransport,
            );
        } else {
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

          jsError.errorId &&
            this.transportInstance.kernelTransportHandler(
              transportKind.stability,
              transportType.jsError,
              jsError,
              transportHandlerType.imageTransport,
            );
        }
      },
      true,
    );
  }

  /**
   * @description: 捕获没有被catch的rejected状态的Promise
   */
  promiseRejectedListener() {
    window.addEventListener('unhandledrejection', (errorEvent) => {
      const defaultErrorParams = {
        errorType: otherErrorType.PROMISEREJECTED,
      };

      if (typeof errorEvent.reason === 'object') {
        const { stack: errorStack, message: errorMsg } = errorEvent.reason;

        const promiseError = new PromiseError(
          Object.assign(defaultErrorParams, {
            errorStack: pocessStackInfo(errorStack),
            errorMsg,
          }),
          this.options,
        );

        errorStack === void 0 && Reflect.deleteProperty(errorStack, 'errorStack');

        console.log(promiseError);
      } else {
        const promiseError = new PromiseError(
          Object.assign(defaultErrorParams, {
            errorMsg: errorEvent.reason,
          }),
          this.options,
        );

        promiseError.errorId &&
          this.transportInstance.kernelTransportHandler(
            transportKind.stability,
            transportType.promiseError,
            promiseError,
            transportHandlerType.imageTransport,
          );
      }
    });
  }

  /**
   * @description: 重写XMLHttpRequest
   */
  rewriteXHR() {
    const serverUrl = getUrlHref(this.serverUrl);
    const oldOpen = XMLHttpRequest.prototype.open;
    const transportInstance = this.transportInstance;
    const options = this.options;

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
                errorType: `XMLHttpRequest${
                  eventType === 'error'
                    ? `CrossDomainError`
                    : eventType === 'loadend'
                    ? 'Error'
                    : eventType[0].toUpperCase() + eventType.slice(1)
                }`,
              },
              options,
            );

            httpRequestError.errorId &&
              transportInstance.kernelTransportHandler(
                transportKind.stability,
                transportType.httpError,
                httpRequestError,
                transportHandlerType.imageTransport,
              );
          } else {
            // 如果是断网导致的请求失败，则缓存请求，等到网络连接后重新上报数据
            window.addEventListener(
              'online',
              () => {
                const httpRequestError = new HttpRequestError(
                  {
                    ...defaultParams,
                    errorType: 'XMLHttpRequestNetworkError',
                  },
                  options,
                );

                httpRequestError.errorId &&
                  transportInstance.kernelTransportHandler(
                    transportKind.stability,
                    transportType.httpError,
                    httpRequestError,
                    transportHandlerType.imageTransport,
                  );
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
   * @description: 重写fetch
   */
  rewriteFetch() {
    const oldFetch = window.fetch;

    const newFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const result = oldFetch(input, init);
      const start = Date.now();

      result.then((response) => {
        const { ok, status, statusText } = response;

        if (!ok) {
          let httpRequestError: HttpRequestError;
          const defaultParams = {
            errorType: otherErrorType.HTTPREQUEST,
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

          httpRequestError.errorId &&
            this.transportInstance.kernelTransportHandler(
              transportKind.stability,
              transportType.httpError,
              httpRequestError,
              transportHandlerType.imageTransport,
            );
        }
      });

      return result;
    };

    window.fetch = newFetch;
  }
}
