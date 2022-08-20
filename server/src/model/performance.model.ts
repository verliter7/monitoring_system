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
    allowNull: false,
    comment: '监控类型',
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '类型',
  },
  timingType: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '时间性能类型',
  },
  describe: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '时间性能类型描述',
  },
  during: {
    type: DataTypes.FLOAT(30, 16),
    allowNull: false,
    comment: '耗时',
  },
  start: {
    type: DataTypes.FLOAT(30, 16),
    allowNull: false,
    comment: '开始时间',
  },
  end: {
    type: DataTypes.FLOAT(30, 16),
    allowNull: false,
    comment: '结束时间',
  },
});

export const PerformanceCLSModel = seq.define('cls', {
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
  CLS: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '累积布局偏移',
    defaultValue: '',
  },
});

// PerformancePaintModel.sync({ force: true });
// PerformanceTimingModel.sync({ force: true });
// PerformanceCLSModel.sync({ force: true });
