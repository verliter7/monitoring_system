export interface DimensionStructure {
  aid: string;// 应用id，使用方传入
  uid?: string;// 用户id，存储于cookie
  pid?: string, // 初始化页面标识别，
  url?: string,// 页面url
  userAgent?: string,//浏览器版本
  // sid: string;// 会话id，存储于cookiestorage
  // release: string;// 应用版本号
  // environment: string;// 应用环境
}