import { DataTypes } from 'sequelize';
import seq from '@/db/seq';
import defalutConfig from './defalutConfig';

const UservitalsModel = seq.define('duration', {
  ...defalutConfig,
  url: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'url地址',
    defaultValue: '',
  },
  startTime: {
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: '开始时间',
    defaultValue: 0,
  },
  endTime: {
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: '结束时间',
    defaultValue: 0,
  },
  duration: {
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: '持续时间',
    defaultValue: 0,
  },
});
// UservitalsModel.sync({ force: true });

export default UservitalsModel;
