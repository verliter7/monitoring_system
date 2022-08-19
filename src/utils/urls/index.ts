const api = {
  register: '/user/register', // 注册
  login: '/user/login', // 登录
  getErrorCount: '/error/count', // 获取错误数量
  getJsErrorData: '/error/getJsErrorData', // 获取js错误表格信息
  getHttpErrorData: '/error/getHttpErrorData', // 获取http错误信息
  getResourceErrorData: '/error/getResourceErrorData', // 获取资源加载错误数据
  getResourceCount: '/resource/getResourceCount', // 获取资源加载数据
  getHttpSuccessRate: '/http/getHttpSuccessRate', // 获取http请求成功率数据
  getHttpMsgCluster: '/http/getHttpMsgCluster', // 获取http请求Msg聚类信息数据
  getHttpTimeConsume: '/http/getHttpTimeConsume', // 获取http请求耗时信息数据
  getAllHttpInfos: '/http/getAllHttpInfos', // 获取所有http请求信息数据
  getUservitalsData: '/business/getUservitalsData',
  getPerformanceData: '/performance/getPerformanceData',
};

export default api;
