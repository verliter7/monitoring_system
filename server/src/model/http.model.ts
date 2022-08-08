import { DataTypes } from 'sequelize';
import seq from '@/db/seq';
import defalutConfig from './defalutConfig';

const HttpModel = seq.define('http', {
  ...defalutConfig,
  httpId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    comment: '每个http请求id',
  },
  requestUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'http请求地址',
  },
  method: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'http请求方法',
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'http状态码',
  },
  responseText: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    comment: 'http响应信息',
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'http请求持续时间',
  },
});

// HttpModel.sync({ force: true });

export default HttpModel;
