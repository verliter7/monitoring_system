import { JsError, PromiseError, ResourceError } from './errorClass';
import otherErrorType from '@/utils/constant/otherErrorType';
import { pocessStackInfo } from '../utils';

export default function errorCatch(APP_MONITOR_ID: string, serverUrl: string) {
  const { RESOURCELOADED, PROMISEREJECTED } = otherErrorType;

  window.addEventListener(
    'error',
    (errorEvent) => {
      const { localName, attributes } = errorEvent.target as HTMLElement;
      // e.target.localName有值就是资源错误，否者就是js代码执行出错
      if (localName) {
        const errorType = RESOURCELOADED;
        const resourceUrl = attributes.getNamedItem('src')?.nodeValue ?? attributes.getNamedItem('href')?.nodeValue;
        const errorMsg = `resource loading error: ${resourceUrl}`;
        const resourceError = new ResourceError(errorType, errorMsg, serverUrl as string, APP_MONITOR_ID);

        resourceError.errorId && resourceError.submitError(serverUrl);
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

        jsError.errorId && jsError.submitError(serverUrl);
      }
    },
    true,
  );

  window.addEventListener('unhandledrejection', (errorEvent) => {
    const { stack: errorStack, message: errorMsg } = errorEvent.reason;
    const errorType = PROMISEREJECTED;
    const jsError = new PromiseError(errorType, pocessStackInfo(errorStack), errorMsg, APP_MONITOR_ID);

    jsError.errorId && jsError.submitError(serverUrl);
  });

  // throw new TypeError('123');
  // fetch('https://tuia.cn/test');
  const link = document.createElement('link');
  link.href = 'https://yun.tuia.cn/image/kkk.css';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}
