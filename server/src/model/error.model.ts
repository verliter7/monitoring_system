import { DataTypes } from 'sequelize';
import seq from '@/db/seq';

const ErrorModel = seq.define('js_resource_error', {
  errorId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    comment: '每条错误数据的Id',
  },
  timeStamp: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '数据上报的时间戳',
  },
  appMonitorId: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '每个监控应用的id',
  },
  originUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '每个监控应用的url',
  },
  osName: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '操作系统名称',
  },
  osVersion: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '操作系统名称',
  },
  ua: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '浏览器信息',
  },
  errorType: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '错误类型',
  },
  errorStack: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    comment: '错误堆栈信息',
  },
  errorMsg: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    comment: '错误信息',
  },
  requestUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'http请求地址',
  },
  method: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'http请求方式',
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'http状态码',
  },
  statusText: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'http状态信息',
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'http请求时间',
  },
});

// ErrorModel.sync({ force: true });

export default ErrorModel;
