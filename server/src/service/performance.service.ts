import PerformanceModel from '@/model/performance.model';
import type { Optional } from 'sequelize/types';

export async function createPerformance_s(performanceInfo: Optional<any, string>) {
  const result = await PerformanceModel.create(performanceInfo);

  return result;
}
