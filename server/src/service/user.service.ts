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

  return !!count;
}

function getToken(body: Record<string, any>) {
  return jwt.sign(body, JWT_SECRET);
}
// 验证用户名密码
export async function userPasswordJudge(username: string, password: string) {
  const res = await UserModel.findOne({
    where: {
      username,
      password,
    },
    attributes: ['username', 'aid'],
  });
  if (res) {
    const useInfo = res.get();
    const token = getToken(useInfo);

    return {
      username: useInfo.username,
      aid: useInfo.aid,
      token,
      permissions: ['/jsError', '/httpError', '/resourcesError', '/pageLoad', '/httpMonitor', '/test'],
    };
  } else {
    return false;
  }
}
