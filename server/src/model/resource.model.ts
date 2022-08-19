import { DataTypes } from 'sequelize';
import seq from '@/db/seq';
import defalutConfig from './defalutConfig';

const ResourceModel = seq.define('resource', {
  ...defalutConfig,
  resourceId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
    comment: '每个静态资源id',
  },
  requestUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '静态资源请求地址',
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '开始发起请求到完整收到资源、传输连接关闭的时间',
  },
  transferSize: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: '资源传输大小',
  },
  initiatorType: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '资源类型',
  },
  dnsLookup: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'dns解析时间',
  },
  initialConnect: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: ' 初始连接时间',
  },
  ssl: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'ssl握手时间',
  },
  contentDownload: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '资源响应时间',
  },
});

// ResourceModel.sync({ force: true });

export default ResourceModel;
