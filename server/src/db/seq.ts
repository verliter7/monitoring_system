import { Sequelize } from 'sequelize';
import env from '@/config/config.default';

const { MYSQL_DB, MYSQL_USER, MYSQL_PWD, MYSQL_HOST, MYSQL_PORT } = env as Record<string, any>;
const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 30000,
  },
  define: {
    charset: 'utf8',
    timestamps: true,
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
