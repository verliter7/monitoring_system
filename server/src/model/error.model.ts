import { DataTypes } from 'sequelize';
import seq from '@/db/seq';

const ErrorModel = seq.define('error', {
  errorId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    comment: '每条错误数据的Id',
  },
  timeStamp: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: '数据上报的时间戳',
  },
  aid: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '每个监控应用的id',
  },
  userMonitorId: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '每个用户的id',
  },
  originUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '每个监控应用的url',
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '每个上报网站的ip地址',
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
  kind: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '监控类型',
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '错误大类型',
  },
  errorType: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '错误小类型',
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
