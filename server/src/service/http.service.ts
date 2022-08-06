import HttpModel from '@/model/http.model';
import type { Optional } from 'sequelize/types';

export async function createHttp_s(httpInfo: Optional<any, string>) {
  const isExisted = !!(await findErrorInfo(httpInfo.httpId));
  httpInfo.timeStamp = parseInt(httpInfo.timeStamp);

  return isExisted ? null : await HttpModel.create(httpInfo);
}

export async function findErrorInfo(httpId: string) {
  const res = await HttpModel.findOne({
    where: {
      httpId,
    },
  });

  return res;
}
