import { Sequelize } from 'sequelize';
import env from '@/config/defalut.config';

const { MYSQL_HOST, MYSQL_USER, MYSQL_PWD, MYSQL_DB } = env;
const seq = new Sequelize(MYSQL_DB!, MYSQL_USER!, MYSQL_PWD, {
  host: MYSQL_HOST,
  port: 3306,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 30000,
  },
});

seq
  .authenticate()
  .then(() => {
    console.log('数据库连接成功');
  })
  .catch((err) => {
    console.log('数据库连接失败', err);
  });

export default seq;
