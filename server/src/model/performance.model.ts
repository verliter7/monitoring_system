import { DataTypes } from 'sequelize';
import seq from '@/db/seq';
import defalutConfig from './defalutConfig';

export const PerformancePaintModel = seq.define('paint', {
  ...defalutConfig,
  kind: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '监控类型',
    defaultValue: '',
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '类型',
    defaultValue: '',
  },
  FP: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '首次渲染耗时',
    defaultValue: '',
  },
  FCP: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: ' 首次内容绘制',
    defaultValue: '',
  },
  FMP: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: ' 首次有意义绘制',
    defaultValue: '',
  },
  LCP: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: ' 最大内容绘制',
    defaultValue: '',
  },
  FID: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: ' 首次交互延时',
    defaultValue: '',
  },
});

export const PerformanceTimingModel = seq.define('timing', {
  ...defalutConfig,
  kind: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '监控类型',
    defaultValue: '',
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '类型',
    defaultValue: '',
  },
  FP: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '首次渲染耗时',
    defaultValue: '',
  },
  TTI: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '首次可交互时间',
    defaultValue: '',
  },
  DomReady: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'DOM阶段渲染耗时',
    defaultValue: '',
  },
  Load: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '首次可交互时间',
    defaultValue: '',
  },
  FirstByte: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '首包时间耗时',
    defaultValue: '',
  },
  DNS: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: ' DNS解析耗时',
    defaultValue: '',
  },
  TCP: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: ' TCP建立连接耗时',
    defaultValue: '',
  },
  SSL: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: ' 数据安全连接耗时',
    defaultValue: '',
  },
  TTFB: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: ' 网络请求耗时',
    defaultValue: '',
  },
  Trans: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: ' 响应数据传输耗时',
    defaultValue: '',
  },
  DomParse: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: ' DOM解析耗时',
    defaultValue: '',
  },
  Res: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: ' 资源加载耗时',
    defaultValue: '',
  },
});
// PerformancePaintModel.sync({ force: true });
// PerformanceTimingModel.sync({ force: true });

