import { PerformanceTimingModel, PerformancePaintModel } from '@/model/performance.model';
import type { Optional } from 'sequelize/types';

export async function createPerformance_s(performanceInfo: Optional<any, string>) {
  let result;
  switch (performanceInfo.type) {
    case 'timing':
      result = await PerformanceTimingModel.create(performanceInfo);
      break;
    case 'paint':
      result = await PerformancePaintModel.create(performanceInfo);
      break;
    default:
      result = await PerformanceTimingModel.create(performanceInfo);
  }
  return result;
}

export async function getPerformanceData_s(type: string) {
  let data;
  switch (type) {
    case 'timing':
      data = PerformanceTimingModel.findAll();
      break;
    case 'paint':
      data = PerformancePaintModel.findAll();
      break;
    default:
      data = PerformanceTimingModel.findAll();
  }

  return data;
}

export async function getTimingData_s(type: string) {
  const data = PerformanceTimingModel.findAll();

  return data;
}
