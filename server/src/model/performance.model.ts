import { DataTypes } from 'sequelize';
import seq from '@/db/seq';
import defalutConfig from './defalutConfig';

const PerformanceModel = seq.define('performance', {
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
  FP: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '首次渲染耗时',
  },
  TTI: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '首次可交互时间',
  },
  DomReady: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'DOM阶段渲染耗时',
  },
  Load: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '首次可交互时间',
  },
  FirstByte: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '首包时间耗时',
  },
  DNS: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: ' DNS解析耗时',
  },
  TCP: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: ' TCP建立连接耗时',
  },
  SSL: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: ' 数据安全连接耗时',
  },
  TTFB: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: ' 网络请求耗时',
  },
  Trans: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: ' 响应数据传输耗时',
  },
  DomParse: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: ' DOM解析耗时',
  },
  Res: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: ' 资源加载耗时',
  },
});

// PerformanceModel.sync({ force: true });

export default PerformanceModel;
