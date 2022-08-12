const api = {
  getErrorCount: '/error/count', // 获取错误数量
  getResourceErrorData: '/error/getResourceErrorData', // 获取资源加载错误数据
  getPerformanceData: '/performance/getPerformanceData',
  getHttpSuccessRate: '/http/getHttpSuccessRate', // 获取http请求成功率数据
  getHttpMsgCluster: '/http/getHttpMsgCluster', // 获取http请求Msg聚类信息数据
  getUservitalsData: '/business/getUservitalsData',
};

export default api;
