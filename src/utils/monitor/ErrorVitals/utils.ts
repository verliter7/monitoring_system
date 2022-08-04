import { ErrorType } from './type';

export function pocessStackInfo(stackInfo: string) {
  const reg = /(\sat\s|\s)/g;

  return stackInfo
    .split('\n')
    .slice(1)
    .map((info) => info.replace(reg, ''))
    .join('-');
}

export function getUrlHref(url: string | URL) {
  if (url instanceof URL) return url.origin + url.pathname;

  try {
    const newUrl = new URL(url);

    return newUrl.origin + newUrl.pathname;
  } catch (e) {
    if (url.indexOf('/') === -1) {
      url = '/' + url;
    }
    return (window.location.origin + url).split('?')[0];
  }
}

export const getErrorKey = (event: ErrorEvent | Event) => {
  const isJsError = event instanceof ErrorEvent;
  if (!isJsError) return ErrorType.RS;

  return event.message === 'Script error.' ? ErrorType.CS : ErrorType.JS;
};

export const errorTypeMap: Record<string, string> = {
  error: ErrorType.XC,
  loadend: ErrorType.XE,
  timeout: ErrorType.XT,
  abort: ErrorType.XA,
};
