import { createPerformance_s } from '@/service/performance.service';
import type { Context } from 'koa';
import type { Optional } from 'sequelize/types';

export async function createPerformance_c(ctx: Context) {
  const performanceInfo = ctx.query as Optional<any, string>;
  performanceInfo.ip = ctx.ip;

  try {
    await createPerformance_s(performanceInfo);

    ctx.defaultResponse();
  } catch (err) {
    console.log(err);

    ctx.defaultError();
  }
}
