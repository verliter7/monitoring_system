import UserModel from '@/model/user.model';
import UservitalsModel from '@/model/uservitals.model';
import type { Optional } from 'sequelize/types';

export async function createUservitals_s(aid: string, uservitalsInfo: Optional<any, string>) {
  const isCreate = await findAid(aid);
  uservitalsInfo.timeStamp = parseInt(uservitalsInfo.timeStamp);

  return isCreate ? await UservitalsModel.create(uservitalsInfo) : null;
}

/**
 * @description: 查找用户表是否存在该aid
 * @param aid 应用id
 */
export async function findAid(aid: string) {
  const count = await UserModel.count({
    where: {
      aid,
    },
  });

  return Boolean(count);
}

export async function getUservitalsData_s(aid: string) {
  const data = UservitalsModel.findAll({
    where: {
      aid,
    },
  });

  return data;
}
