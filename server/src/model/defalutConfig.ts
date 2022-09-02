import { DataTypes } from 'sequelize';

const defalutConfig = {
  timeStamp: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: '数据上报的时间戳',
  },
  aid: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '每一个应用的key，通过注册获得',
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
    comment: '操作系统版本',
  },
  ua: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '浏览器信息',
  },
};

export default defalutConfig;
