import { Op } from 'sequelize';
import dayjs from 'dayjs';
import { uniq } from '@/utils';
import ErrorModel from '@/model/error.model';
import ResourceModel from '@/model/resource.model';
import HttpModel from '@/model/http.model';
import UservitalsModel from '@/model/uservitals.model';
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

const oneDayHours = 24;
const oneHourMilliseconds = 60 * 60 * 1000;
const oneDayTime = oneDayHours * oneHourMilliseconds;
const process = (infos: Model<any, any>[]) => infos.map((errorInfo) => errorInfo.get());
const getQueryConfigWhere = (pastDays: number) => {
  const now = Date.now();

  return {
    now,
    queryConfigWhere: {
      timeStamp: {
        [Op.lt]: now,
        [Op.gt]: now - oneDayTime * pastDays,
      },
    },
  };
};

/**
 * @description: 获取错误数量
 * @param type 错误类型
 */
export async function getErrorCount_s(pastDays: number, type: ErrorType) {
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
  let allCreatTimes: any[] = [];

  switch (type) {
    case errorEnum.JE:
      allCreatTimes = process(await UservitalsModel.findAll(getQueryConfig()));
      break;
    case errorEnum.RE:
      allCreatTimes = process(await ResourceModel.findAll(getQueryConfig()));
      break;
    case errorEnum.HE:
      allCreatTimes = [...allErrorCreatTimes, ...process(await HttpModel.findAll(getQueryConfig()))];
      break;
    default:
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
 * @description: 获取js请求错误信息（做成表格）
 */
export async function getJsErrorData_s(...args: number[]) {
  const [pastDays, current, size] = args;
  const { queryConfigWhere } = getQueryConfigWhere(pastDays);
  const timeFormat = 'YYYY-MM-DD HH:mm:ss';
  const records = process(
    await ErrorModel.findAll({
      attributes: ['errorId', 'timeStamp', 'errorType', 'errorStack', 'errorMsg'],
      where: {
        ...queryConfigWhere,
        type: errorEnum.JE,
      },
    }),
  );
  const uniqRecords = uniq(
    records,
    (a, b) => a.errorType === b.errorType && a.errorStack === b.errorStack && a.errorMsg === b.errorMsg,
  );
  const finalRecords: any[] = [];

  for (const { errorId, timeStamp, ...rest } of uniqRecords) {
    finalRecords.push({
      key: errorId,
      date: dayjs(timeStamp).format(timeFormat),
      count: await ErrorModel.count({
        where: Object.assign(queryConfigWhere, rest),
      }),
      ...rest,
    });
  }

  return {
    current,
    size,
    total: finalRecords.length,
    records: finalRecords.slice((current - 1) * size, current * size),
  };
}
/**
 * @description: 获取http请求错误信息（做成表格）
 */
export async function getHttpErrorData_s(...args: number[]) {
  const [pastDays, current, size] = args;
  const { queryConfigWhere } = getQueryConfigWhere(pastDays);
  const timeFormat = 'YYYY-MM-DD HH:mm:ss';
  const records = process(
    await ErrorModel.findAll({
      attributes: ['errorId', 'timeStamp', 'requestUrl'],
      where: {
        ...queryConfigWhere,
        type: errorEnum.HE,
      },
    }),
  );
  const uniqRecords = uniq(records, (a, b) => a.requestUrl === b.requestUrl);
  const finalRecords: any[] = [];

  for (const { errorId, timeStamp, requestUrl } of uniqRecords) {
    finalRecords.push({
      key: errorId,
      date: dayjs(timeStamp).format(timeFormat),
      count: await ErrorModel.count({
        where: {
          ...queryConfigWhere,
          requestUrl,
        },
      }),
      requestUrl,
    });
  }

  return {
    current,
    size,
    total: finalRecords.length,
    records: finalRecords.slice((current - 1) * size, current * size),
  };
}

/**
 * @description: 获取静态资源加载错误信息（做成表格）
 */
export async function getResourceErrorData_s(...args: number[]) {
  const [pastDays, current, size] = args;
  const { queryConfigWhere } = getQueryConfigWhere(pastDays);
  const timeFormat = 'YYYY-MM-DD HH:mm:ss';
  const records = process(
    await ErrorModel.findAll({
      attributes: ['errorId', 'timeStamp', 'requestUrl'],
      where: {
        ...queryConfigWhere,
        type: errorEnum.RE,
      },
    }),
  );
  const uniqRecords = uniq(records, (a, b) => a.requestUrl === b.requestUrl);
  const finalRecords: any[] = [];

  for (const { errorId, timeStamp, requestUrl } of uniqRecords) {
    finalRecords.push({
      key: errorId,
      date: dayjs(timeStamp).format(timeFormat),
      count: await ErrorModel.count({
        where: {
          ...queryConfigWhere,
          requestUrl,
        },
      }),
      requestUrl,
    });
  }
  return {
    current,
    size,
    total: finalRecords.length,
    records: finalRecords.slice((current - 1) * size, current * size),
  };
}
