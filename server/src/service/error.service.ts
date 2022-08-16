import { Op } from 'sequelize';
import dayjs from 'dayjs';
import ErrorModel from '@/model/error.model';
import ResourceModel from '@/model/resource.model';
import type { Model, Optional } from 'sequelize/types';

/**
 * @description: 向数据库插入一条错误信息
 * @param errorInfo 错误信息
 */
export async function createError_s(errorInfo: Optional<any, string>) {
  const isExisted = !!(await findErrorInfo(errorInfo.errorId));
  errorInfo.timeStamp = parseInt(errorInfo.timeStamp);

  return isExisted ? null : await ErrorModel.create(errorInfo);
}

export async function findErrorInfo(errorId: string) {
  const res = await ErrorModel.findOne({
    where: {
      errorId,
    },
  });

  return res;
}

export enum errorEnum {
  JE = 'jsError',
  PE = 'promiseError',
  HE = 'httpError',
  RE = 'resourceError',
}

export type ErrorType = 'jsError' | 'promiseError' | 'httpError' | 'resourceError';

/**
 * @description: 获取错误数量
 * @param type 错误类型
 */
export async function getErrorCount_s(pastDays: number, type: ErrorType) {
  const oneDayHours = 24;
  const oneHourMilliseconds = 60 * 60 * 1000;
  const oneDayTime = oneDayHours * oneHourMilliseconds;
  const now = Date.now();
  const process = (infos: Model<any, any>[]) => infos.map((errorInfo) => errorInfo.getDataValue('timeStamp'));
  const getQueryConfig = (type?: string) => {
    const config: Record<string, any> = {
      where: {
        type,
        timeStamp: {
          [Op.lt]: now,
          [Op.gt]: now - 2 * pastDays * oneDayTime,
        },
      },
      attributes: ['timeStamp'],
      order: [['timeStamp', 'DESC']],
    };

    type === void 0 && delete config.where.type;

    return config;
  };

  const allErrorCreatTimes = process(await ErrorModel.findAll(getQueryConfig(type)));
  let allCreatTimes: any[];

  switch (type) {
    case errorEnum.RE:
      allCreatTimes = process(await ResourceModel.findAll(getQueryConfig()));
      break;

    default:
      allCreatTimes = process(await ResourceModel.findAll(getQueryConfig()));
      break;
  }

  const frontErrorConutByTime: Record<string, [number, number]> = {};
  const backErrorConutByTime: Record<string, [number, number]> = {};
  const timeFormat = 'YYYY-MM-DD HH:00';
  const oneCycleTime = oneDayHours * pastDays * 2 - 1;

  for (let i = oneCycleTime; i >= 0; i--) {
    const formatTime = dayjs(now - i * oneHourMilliseconds).format(timeFormat);

    i > oneCycleTime / 2 ? (frontErrorConutByTime[formatTime] = [0, 0]) : (backErrorConutByTime[formatTime] = [0, 0]);
  }

  allErrorCreatTimes.forEach((time: number) => {
    const formatTime = dayjs(time).format(timeFormat);

    Reflect.has(frontErrorConutByTime, formatTime) && frontErrorConutByTime[formatTime][0]++;
    Reflect.has(backErrorConutByTime, formatTime) && backErrorConutByTime[formatTime][0]++;
  });

  allCreatTimes.forEach((time: number) => {
    const formatTime = dayjs(time).format(timeFormat);

    Reflect.has(frontErrorConutByTime, formatTime) && frontErrorConutByTime[formatTime][1]++;
    Reflect.has(backErrorConutByTime, formatTime) && backErrorConutByTime[formatTime][1]++;
  });

  return { frontErrorConutByTime, backErrorConutByTime };
}

/**
 * @description: 获取静态资源加载错误信息（做成表格）
 * @param current 当前页数
 * @param size 当前页大小
 */
export async function getResourceErrorData_s(...args: number[]) {
  const [pastDays, current, size] = args;
  const oneDayHours = 24;
  const oneHourMilliseconds = 60 * 60 * 1000;
  const oneDayTime = oneDayHours * oneHourMilliseconds;
  const now = Date.now();
  const queryConfigWhere = {
    timeStamp: {
      [Op.lt]: now,
      [Op.gt]: now - oneDayTime * pastDays,
    },
  };
  const TYPE = 'resourceError';
  const timeFormat = 'YYYY-MM-DD HH:mm:ss';
  const process = (infos: Model<any, any>[]) => infos.map((errorInfo) => errorInfo.get());
  const records = process(
    await ErrorModel.findAll({
      attributes: ['errorId', 'timeStamp', 'originUrl', 'requestUrl'],
      where: {
        ...queryConfigWhere,
        type: TYPE,
      },
      limit: size,
      offset: (current - 1) * size,
      order: [['timeStamp', 'DESC']],
    }),
  );

  const total = await ErrorModel.count({
    where: {
      ...queryConfigWhere,
      type: TYPE,
    },
  });

  const getResourceErrorCount = (requestUrl: string) => {
    let count = 0;

    for (const record of records) {
      if (record.requestUrl === requestUrl) {
        count++;
      }
    }

    return count;
  };

  return {
    current,
    size,
    total,
    records: records.map((record) => {
      const { errorId, timeStamp, originUrl, requestUrl } = record;

      const finalRecord = {
        key: errorId,
        date: dayjs(timeStamp).format(timeFormat),
        originUrl,
        requestUrl,
        count: getResourceErrorCount(requestUrl),
      };

      return finalRecord;
    }),
  };
}
