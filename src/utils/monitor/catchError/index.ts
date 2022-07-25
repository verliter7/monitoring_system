import { JsError, PromiseError, ResourceError, HttpRequestError } from './errorClass';
import otherErrorType from '../utils/constant/otherErrorType';
import { pocessStackInfo } from '../utils';

/**
 * @description: 重写XMLHttpRequest
 * @param APP_MONITOR_ID 应用id
 * @param serverUrl 错误数据上报服务器地址
 */
function rewriteXHR(APP_MONITOR_ID: string, serverUrl: string) {
  const oldOpen = XMLHttpRequest.prototype.open;
  // @ts-ignore
  XMLHttpRequest.prototype.open = function (method, url, async, username, password) {
    async = true;

    this.ajaxData = {
      method,
      url,
    };

    return oldOpen.call(this, method, url, async, username, password);
  };

  const oldSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (body) {
    const start = Date.now();
    const handleError = function (this: XMLHttpRequest, errorEvent: ProgressEvent<XMLHttpRequestEventTarget>) {
      const { type: eventType } = errorEvent;
      const {
        ajaxData: { url, method },
        status,
        statusText,
      } = this;

      // 根据状态码判断是否ajax请求是否出错
      if (eventType === 'loadend' && status < 400) return;

      if (window.navigator.onLine) {
        // eventType为'error'证明是网络断开或者请求跨域出错
        const httpRequestError = new HttpRequestError(
          `XMLHttpRequest${
            eventType === 'error'
              ? `CrossDomainError`
              : eventType === 'loadend'
              ? 'Error'
              : eventType[0].toUpperCase() + eventType.slice(1)
          }`,
          url instanceof URL ? url.href : url,
          method.toUpperCase(),
          status,
          statusText,
          `${Date.now() - start}`,
          APP_MONITOR_ID,
        );

        httpRequestError.errorId && httpRequestError.submitError(serverUrl, httpRequestError);
      } else {
        // 如果是断网导致的请求失败，则缓存请求，等到网络连接后重新上报数据
        window.addEventListener(
          'online',
          () => {
            const httpRequestError = new HttpRequestError(
              'XMLHttpRequestNetworkError',
              url instanceof URL ? url.href : url,
              method.toUpperCase(),
              status,
              statusText,
              `${Date.now() - start}`,
              APP_MONITOR_ID,
            );

            httpRequestError.errorId && httpRequestError.submitError(serverUrl, httpRequestError);
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

    oldSend.call(this, body);
  };
}

/**
 * @description: 重写fetch
 * @param APP_MONITOR_ID 应用id
 * @param serverUrl 错误数据上报服务器地址
 * @return
 */
function rewriteFetch(APP_MONITOR_ID: string, serverUrl: string) {
  const oldFetch = window.fetch;

  function newFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const result = oldFetch(input, init);
    const start = Date.now();

    result.then((response) => {
      const { ok, status, statusText } = response;

      if (!ok) {
        let httpRequestError: HttpRequestError;

        if (input instanceof Request) {
          const { url, method = 'GET' } = input;
          httpRequestError = new HttpRequestError(
            'FetchError',
            url,
            method.toUpperCase(),
            status,
            statusText,
            `${Date.now() - start}`,
            APP_MONITOR_ID,
          );
        } else {
          httpRequestError = new HttpRequestError(
            'FetchError',
            input,
            init?.method ? init.method.toUpperCase() : 'GET',
            status,
            statusText,
            `${Date.now() - start}`,
            APP_MONITOR_ID,
          );
        }
        console.log(httpRequestError);
        // httpRequestError.errorId && httpRequestError.submitError(serverUrl, httpRequestError)
      }
    });

    return result;
  }

  window.fetch = newFetch;
}

/**
 * @description: 错误捕获和上报
 * @param APP_MONITOR_ID 应用id
 * @param serverUrl 错误数据上报服务器地址
 * @return
 */
export default function errorCatch(APP_MONITOR_ID: string, serverUrl: string) {
  // 监听js执行错误
  window.addEventListener(
    'error',
    (errorEvent) => {
      const { localName, attributes } = errorEvent.target as HTMLElement;
      // e.target.localName有值就是资源错误，否者就是js代码执行出错
      if (localName) {
        const errorType = otherErrorType.RESOURCELOADED;
        const resourceUrl = attributes.getNamedItem('src')?.nodeValue ?? attributes.getNamedItem('href')?.nodeValue;
        const errorMsg = `resource loading error: ${resourceUrl}`;
        const resourceError = new ResourceError(errorType, errorMsg, resourceUrl as string, APP_MONITOR_ID);

        // resourceError.errorId && resourceError.submitError(serverUrl, resourceError);
      } else {
        const { error, message: errorMsg, lineno, colno } = errorEvent;
        const errorType = error.toString().split(':')[0];
        const errorStack = error.stack;
        const jsError = new JsError(
          errorType,
          pocessStackInfo(errorStack),
          errorMsg,
          APP_MONITOR_ID,
          `${lineno}:${colno}`,
        );

        // jsError.errorId && jsError.submitError(serverUrl, jsError);
      }
    },
    true,
  );

  // 监听没有被catch的rejected状态的Promise
  window.addEventListener('unhandledrejection', (errorEvent) => {
    const { type: errorType, stack: errorStack, message: errorMsg } = errorEvent.reason;
    const promiseError = new PromiseError(errorType, pocessStackInfo(errorStack), errorMsg, APP_MONITOR_ID);

    console.log(errorEvent);

    // promiseError.errorId && promiseError.submitError(serverUrl, promiseError);
  });

  rewriteXHR(APP_MONITOR_ID, serverUrl);
  rewriteFetch(APP_MONITOR_ID, serverUrl);

  // throw new TypeError('123');
  // fetch('http://localhost:8080/api/v1/err', {
  //   method: 'GET',
  // });
  // const link = document.createElement('link');
  // link.href = 'https://yun.tuia.cn/image/kkk.css';
  // link.rel = 'stylesheet';
  // document.head.appendChild(link);

  // setTimeout(() => {
  //   const xhr = new XMLHttpRequest();

  //   // xhr.timeout = 1;
  //   xhr.open('GET', 'http://localhost:8080/api/v1/error/ad');
  //   // xhr.open('GET', '/api/v1/error/get?errorId=-1481135701');
  //   xhr.send(null);
  // }, 5000);
}
