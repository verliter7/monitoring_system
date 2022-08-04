import { httpMetrics, OriginInformation } from './type';

// 派发出新的 Event
const wr = (type: keyof History) => {
  const orig = history[type];
  return function (this: unknown) {
    const rv = orig.apply(this, arguments);
    const e = new Event(type);
    window.dispatchEvent(e);
    return rv;
  };
};

// 添加 pushState replaceState 事件
export const wrHistory = (): void => {
  history.pushState = wr('pushState');
  history.replaceState = wr('replaceState');
};

// 为 pushState 以及 replaceState 方法添加 Event 事件
export const proxyHistory = (handler: Function): void => {
  // 添加对 replaceState 的监听
  window.addEventListener('replaceState', (e) => handler(e), true);
  // 添加对 pushState 的监听
  window.addEventListener('pushState', (e) => handler(e), true);
};

export const proxyHash = (handler: Function): void => {
  // 添加对 hashchange 的监听
  // hash 变化除了触发 hashchange ,也会触发 popstate 事件,而且会先触发 popstate 事件，我们可以统一监听 popstate
  // 这里可以考虑是否需要监听 hashchange,或者只监听 hashchange
  window.addEventListener('hashchange', (e) => handler(e), true);
  // 添加对 popstate 的监听
  // 浏览器回退、前进行为触发的 可以自己判断是否要添加监听
  window.addEventListener('popstate', (e) => handler(e), true);
};

// 调用 proxyXmlHttp 即可完成全局监听 XMLHttpRequest
export const proxyXmlHttp = (sendHandler: Function | null | undefined, loadHandler: Function) => {
  if ('XMLHttpRequest' in window && typeof window.XMLHttpRequest === 'function') {
    const oXMLHttpRequest = window.XMLHttpRequest;
    if (!(window as any).oXMLHttpRequest) {
      // oXMLHttpRequest 为原生的 XMLHttpRequest，可以用以 SDK 进行数据上报，区分业务
      (window as any).oXMLHttpRequest = oXMLHttpRequest;
    }
    (window as any).XMLHttpRequest = function () {
      // 覆写 window.XMLHttpRequest
      const xhr = new oXMLHttpRequest();
      const { open, send } = xhr;
      let metrics = {} as httpMetrics;
      xhr.open = (method, url) => {
        metrics.method = method;
        metrics.url = url;
        open.call(xhr, method, url, true);
      };
      xhr.send = (body) => {
        metrics.body = body || '';
        metrics.requestTime = new Date().getTime();
        // sendHandler 可以在发送 Ajax 请求之前，挂载一些信息，比如 header 请求头
        // setRequestHeader 设置请求header，用来传输关键参数等
        // xhr.setRequestHeader('xxx-id', 'VQVE-QEBQ');
        if (typeof sendHandler === 'function') sendHandler(xhr);
        send.call(xhr, body);
      };
      xhr.addEventListener('loadend', () => {
        const { status, statusText, response } = xhr;
        metrics = {
          ...metrics,
          status,
          statusText,
          response,
          responseTime: new Date().getTime(),
        };
        if (typeof loadHandler === 'function') loadHandler(metrics);
        // xhr.status 状态码
      });
      return xhr;
    };
  }
};

// 调用 proxyFetch 即可完成全局监听 fetch
export const proxyFetch = (sendHandler: Function | null | undefined, loadHandler: Function) => {
  if ('fetch' in window && typeof window.fetch === 'function') {
    const oFetch = window.fetch;
    if (!(window as any).oFetch) {
      (window as any).oFetch = oFetch;
    }
    (window as any).fetch = async (input: any, init: RequestInit) => {
      // init 是用户手动传入的 fetch 请求互数据，包括了 method、body、headers，要做统一拦截数据修改，直接改init即可
      if (typeof sendHandler === 'function') sendHandler(init);
      let metrics = {} as httpMetrics;

      metrics.method = init?.method || '';
      metrics.url = (input && typeof input !== 'string' ? input?.url : input) || ''; // 请求的url
      metrics.body = init?.body || '';
      metrics.requestTime = new Date().getTime();

      return oFetch.call(window, input, init).then(async (response) => {
        // clone 出一个新的 response,再用其做.text(),避免 body stream already read 问题
        const res = response.clone();
        metrics = {
          ...metrics,
          status: res.status,
          statusText: res.statusText,
          response: await res.text(),
          responseTime: new Date().getTime(),
        };
        if (typeof loadHandler === 'function') loadHandler(metrics);
        return response;
      });
    };
  }
};

// 返回 OI 用户来路信息
export const getOriginInfo = (): OriginInformation => {
  return {
    referrer: document.referrer,
    type: window.performance?.navigation.type || '',
  };
};
