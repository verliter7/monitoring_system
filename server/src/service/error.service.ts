import { Op } from 'sequelize';
import dayjs from 'dayjs';
import ErrorModel from '@/model/error.model';
import type { Model, Optional } from 'sequelize/types';

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

export async function queryErrorCount_s(type: string) {
  const oneDayHours = 24;
  const oneHourMilliseconds = 60 * 60 * 1000;
  const oneDayTime = oneDayHours * oneHourMilliseconds;
  const now = Date.now();
  const process = (infos: Model<any, any>[]) => infos.map((errorInfo) => errorInfo.getDataValue('timeStamp'));
  const getQueryConfig = (ago: number) => ({
    where: {
      type,
      timeStamp: {
        [Op.lt]: now - (ago - 1) * oneDayTime,
        [Op.gt]: now - ago * oneDayTime,
      },
    },
    attributes: ['timeStamp'],
  });
  const frontErrorCreatTimes = process(await ErrorModel.findAll(getQueryConfig(2)));
  const backErrorCreatTimes = process(await ErrorModel.findAll(getQueryConfig(1)));
  const frontErrorConutByTime: Record<string, number> = {};
  const backErrorConutByTime: Record<string, number> = {};
  const timeFormat = 'YYYY-MM-DD HH:00';

  for (let i = oneDayHours; i >= 0; i--) {
    const frontTime = dayjs(now - oneDayTime - i * oneHourMilliseconds).format(timeFormat);
    const backTime = dayjs(now - i * oneHourMilliseconds).format(timeFormat);

    frontErrorConutByTime[frontTime] = 0;
    backErrorConutByTime[backTime] = 0;
  }

  frontErrorCreatTimes.forEach((time: number) => {
    const frontTime = dayjs(time).format(timeFormat);
    frontErrorConutByTime[frontTime] !== void 0 && frontErrorConutByTime[frontTime]++;
  });
  backErrorCreatTimes.forEach((time: number) => {
    const backTime = dayjs(time).format(timeFormat);
    backErrorConutByTime[backTime] !== void 0 && backErrorConutByTime[backTime]++;
  });

  return { frontErrorConutByTime, backErrorConutByTime };
}

enum typeEnum {
  HP = 'httpError',
  JS = 'jsError',
  RS = 'resourcesError',
  PL = 'pageLoad',
}

export async function getResourceErrorData_s(current: number, size: number) {
  const TYPE = 'resourceError';
  const timeFormat = 'YYYY-MM-DD HH:mm:ss';
  const process = (infos: Model<any, any>[]) => infos.map((errorInfo) => errorInfo.get());
  const records = process(
    await ErrorModel.findAll({
      attributes: ['errorId', 'timeStamp', 'originUrl', 'requestUrl'],
      where: {
        type: TYPE,
      },
      limit: size,
      offset: (current - 1) * size,
      order: [['timeStamp', 'DESC']],
    }),
  );

  const total = await ErrorModel.count({
    where: {
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
    type: typeEnum.RS,
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
