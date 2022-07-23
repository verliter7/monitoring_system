import { Sequelize } from 'sequelize';

const seq = new Sequelize('monitoring_system', 'root', 'Qz200297.', {
  host: '3306',
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
