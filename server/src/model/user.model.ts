import { DataTypes } from 'sequelize';
import seq from '@/db/seq';

const UserModel = seq.define('user', {
  aid: {
    type: DataTypes.CHAR(16),
    primaryKey: true,
    allowNull: false,
    unique: true,
    comment: '每一个应用的key，通过注册获得',
  },
  username: {
    type: DataTypes.CHAR(64),
    allowNull: false,
    unique: true,
    comment: '用户名, 唯一',
  },
  password: {
    type: DataTypes.CHAR(64),
    allowNull: false,
    comment: '密码',
  },
});

// UserModel.sync({ force: true });

export default UserModel;
