import jwt from 'jsonwebtoken';
import env from '@/config/config.default';
import UserModel from '@/model/user.model';
import { getRandomStr } from '@/utils';

const { JWT_SECRET } = env as Record<string, string>;

// 创建用户
export async function createUser(username: string, password: string) {
  await UserModel.create({
    username,
    password,
    aid: getRandomStr(),
  });
}

// 判断用户是否存在
export async function userExistJudge(username: string) {
  const count = await UserModel.count({
    where: {
      username,
    },
  });

  return Boolean(count);
}

// 验证用户名密码登陆
export async function userPasswordJudge(username: string, password: string) {
  const res = await UserModel.findOne({
    where: {
      username,
      password,
    },
    attributes: ['username', 'aid'],
  });

  return res ? getRefreshUserInfo(res.get()) : false;
}

export async function getRefreshUserInfo(oldUserInfo: any) {
  const now = Date.now();
  const token = jwt.sign(oldUserInfo, JWT_SECRET, { expiresIn: '2h' });

  return {
    ...oldUserInfo,
    token,
    permissions: ['/jsError', '/httpError', '/resourcesError', '/pageLoad', '/httpMonitor', '/test'],
    expiresAt: now + 2 * 60 * 60 * 1000,
  };
}
