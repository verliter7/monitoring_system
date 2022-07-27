import ErrorModel from '@/model/error.model';
import type { Optional } from 'sequelize/types';

export async function createErrorInfo(errorInfo: Optional<any, string>) {
  const isExisted = !!(await findErrorInfo(errorInfo.errorId));

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
