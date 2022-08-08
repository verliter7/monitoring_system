import UservitalsModel from '@/model/uservitals.model';
import type { Optional } from 'sequelize/types';

export async function createUservitals_s(uservitalsInfo: Optional<any, string>) {
  const result = await UservitalsModel.create(uservitalsInfo);
  return result;
}

export async function getUservitalsData_s() {
  const data = UservitalsModel.findAll()

  console.log(data);

  return data
}