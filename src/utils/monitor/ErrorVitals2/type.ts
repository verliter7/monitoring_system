import { behaviorStack } from "../UserVitals/type";

// 错误类型
export enum mechanismType {
  JS = 'js',
  RS = 'resource',
  UJ = 'unhandledrejection',
  HP = 'http',
  CS = 'cors',
  VUE = 'vue',
}

// 格式化后的 异常数据结构体
export interface ExceptionMetrics {
  mechanism: Object;
  value?: string;
  type: string;
  stackTrace?: Object;
  pageInformation?: Object;
  breadcrumbs?: Array<behaviorStack>;
  errorUid: string;
  meta?: any;
}

// 初始化用参
export interface ErrorVitalsInitOptions {
  Vue: any;
}
// 静态资源错误的 ErrorTarget
export interface ResourceErrorTarget {
  src?: string;
  tagName?: string;
  outerHTML?: string;
}