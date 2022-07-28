import { Op } from 'sequelize';
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
  const oneDay = 24 * 60 * 60 * 1000;
  const process = (infos: Model<any, any>[]) => infos.map((errorInfo) => errorInfo.getDataValue('timeStamp'));
  const getQueryConfig = (ago: number) => ({
    where: {
      type,
      timeStamp: {
        [Op.lt]: Date.now() - (ago - 1) * oneDay,
        [Op.gt]: Date.now() - ago * oneDay,
      },
    },
    attributes: ['timeStamp'],
  });
  const frontErrors = process(await ErrorModel.findAll(getQueryConfig(2)));
  const backErrors = process(await ErrorModel.findAll(getQueryConfig(1)));

  return { frontErrors, backErrors };
}

queryErrorCount_s('httpError').then((result) => {
  console.log(result);
});
