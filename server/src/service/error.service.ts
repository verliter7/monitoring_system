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
  const frontErrorConutsByTime: Record<string, number> = {};
  const backErrorConutsByTime: Record<string, number> = {};
  const timeFormat = 'YYYY-MM-DD HH:00';

  for (let i = oneDayHours; i >= 0; i--) {
    const frontTime = dayjs(now - oneDayTime - i * oneHourMilliseconds).format(timeFormat);
    const backTime = dayjs(now - i * oneHourMilliseconds).format(timeFormat);

    frontErrorConutsByTime[frontTime] = 0;
    backErrorConutsByTime[backTime] = 0;
  }

  frontErrorCreatTimes.forEach((time: number) => {
    const frontTime = dayjs(time).format(timeFormat);
    frontErrorConutsByTime[frontTime] !== void 0 && frontErrorConutsByTime[frontTime]++;
  });
  backErrorCreatTimes.forEach((time: number) => {
    const backTime = dayjs(time).format(timeFormat);
    backErrorConutsByTime[backTime] !== void 0 && backErrorConutsByTime[backTime]++;
  });

  return { frontErrorConutsByTime, backErrorConutsByTime };
}
