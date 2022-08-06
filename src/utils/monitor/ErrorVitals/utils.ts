import { ErrorType } from './type';

export function pocessStackInfo(stackInfo: string) {
  const reg = /(\sat\s|\s)/g;

  return stackInfo
    .split('\n')
    .slice(1)
    .map((info) => info.replace(reg, ''))
    .join('-');
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
