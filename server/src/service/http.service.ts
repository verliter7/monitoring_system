import { Op } from 'sequelize';
import dayjs from 'dayjs';
import HttpModel from '@/model/http.model';
import ErrorModel from '@/model/error.model';
import type { Model, Optional } from 'sequelize/types';

export async function createHttp_s(httpInfo: Optional<any, string>) {
  const isExisted = !!(await findInfo(httpInfo.httpId));
  httpInfo.timeStamp = parseInt(httpInfo.timeStamp);

  return isExisted ? null : await HttpModel.create(httpInfo);
}

export async function findInfo(httpId: string) {
  const res = await HttpModel.findOne({
    where: {
      httpId,
    },
  });

  return res;
}

const oneDayHours = 24;
const oneHourMilliseconds = 60 * 60 * 1000;
const oneDayTime = oneDayHours * oneHourMilliseconds;
const now = Date.now();
const queryConfigWhere = {
  timeStamp: {
    [Op.lt]: now,
    [Op.gt]: now - oneDayTime,
  },
};
const timeFormat = 'YYYY-MM-DD HH:00';
const process = (infos: Model<any, any>[]) => infos.map((errorInfo) => errorInfo.get());

export async function getHttpSuccessRate_s() {
  const successedHttpCreatTimes = process(
    await HttpModel.findAll({
      attributes: ['timeStamp', 'requestUrl'],
      where: queryConfigWhere,
    }),
  );
  const failedHttpCreatTimes = process(
    await ErrorModel.findAll({
      attributes: ['timeStamp', 'requestUrl'],
      where: {
        ...queryConfigWhere,
        type: 'httpError',
      },
    }),
  );

  const successRateInfos: Record<string, Record<string, [number, number]>> = {};
  let total = 0;

  for (const { requestUrl } of successedHttpCreatTimes.concat(failedHttpCreatTimes)) {
    if (!successRateInfos[requestUrl]) {
      const successedHttpConutByTime: Record<string, [number, number]> = {};

      for (let i = oneDayHours; i >= 0; i--) {
        const time = dayjs(now - i * oneHourMilliseconds).format(timeFormat);

        successedHttpConutByTime[time] = [0, 0];
      }

      successRateInfos[requestUrl] = successedHttpConutByTime;
    }
  }

  for (const { timeStamp, requestUrl } of successedHttpCreatTimes) {
    const formatTime = dayjs(timeStamp).format(timeFormat);
    const successRateInfo = successRateInfos[requestUrl][formatTime];

    successRateInfo[0]++;
    successRateInfo[1]++;
    total++;
  }

  for (const { timeStamp, requestUrl } of failedHttpCreatTimes) {
    const formatTime = dayjs(timeStamp).format(timeFormat);
    const successRateInfo = successRateInfos[requestUrl][formatTime];

    successRateInfo[1]++;
    total++;
  }

  return { successRateInfos, total };
}

export async function getHttpMsgCluster_s() {
  const successedHttpInfo = process(
    await HttpModel.findAll({
      attributes: ['requestUrl', 'status', 'httpMessage'],
      where: queryConfigWhere,
    }),
  );
  const failedHttpInfo = process(
    await ErrorModel.findAll({
      attributes: ['requestUrl', 'status', 'httpMessage'],
      where: {
        ...queryConfigWhere,
        type: 'httpError',
      },
    }),
  );

  const msgClusterInfo: Record<string, Record<string, Record<string, number>>> = {};
  const allHttpInfo = successedHttpInfo.concat(failedHttpInfo);

  for (const { httpMessage } of allHttpInfo) {
    if (msgClusterInfo[httpMessage]) continue;

    msgClusterInfo[httpMessage] = {};
  }

  for (const { requestUrl, status, httpMessage } of allHttpInfo) {
    const callCount = msgClusterInfo[httpMessage][requestUrl]?.callCount;
    msgClusterInfo[httpMessage][requestUrl] = {
      callCount: callCount === void 0 ? 1 : (callCount as number) + 1,
      status,
    };
  }

  return msgClusterInfo;
}
