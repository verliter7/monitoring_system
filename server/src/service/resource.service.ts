import { Op } from 'sequelize';
import ResourceModel from '@/model/resource.model';
import UserModel from '@/model/user.model';
import type { Optional } from 'sequelize/types';

/**
 * @description: 向数据库插入一条静态资源请求信息
 * @param resourceInfo 静态资源请求信息
 */
export async function createResource_s(aid: string, resourceInfo: Optional<any, string>) {
  const isExisted = (await findResourceInfo(resourceInfo.resourceId)) && (await findAid(aid));
  resourceInfo.timeStamp = parseInt(resourceInfo.timeStamp);

  return isExisted ? null : await ResourceModel.create(resourceInfo);
}

/**
 * @description: 在数据库中查找某个静态资源请求
 * @param resourceId 每一个静态资源的id
 */
export async function findResourceInfo(resourceId: string) {
  const count = await ResourceModel.count({
    where: {
      resourceId,
    },
  });

  return !!count;
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

  return !!count;
}

const oneDayHours = 24;
const oneHourMilliseconds = 60 * 60 * 1000;
const oneDayTime = oneDayHours * oneHourMilliseconds;

/**
 * @description: 获取静态资源请求数量
 */
export async function getResourceCount_s(aid: string) {
  const now = Date.now();
  const queryConfigWhere = {
    timeStamp: {
      [Op.lt]: now,
      [Op.gt]: now - oneDayTime,
    },
  };

  const total = await ResourceModel.count({
    where: {
      aid,
      ...queryConfigWhere,
    },
  });

  return total;
}

/**
 * 获取所有资源数据
 * @returns
 */
export async function getResourceData_s() {
  const data = await ResourceModel.findAll()
  return data
}