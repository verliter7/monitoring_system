import { Sequelize } from 'sequelize';

const seq = new Sequelize('test', 'root', '123456', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 30000,
  },
  define: {
    charset: 'utf8',
    timestamps: true
  }
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
