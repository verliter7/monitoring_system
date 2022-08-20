import { DataTypes } from 'sequelize';
import seq from '@/db/seq';
import defalutConfig from './defalutConfig';

const ErrorModel = seq.define('error', {
  ...defalutConfig,
  errorId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
    comment: '每条错误数据的Id',
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
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'http状态码',
  },
  httpMessage: {
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
