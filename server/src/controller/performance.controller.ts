import { createPerformance_s } from '@/service/performance.service';
import type { Context } from 'koa';
import type { Optional } from 'sequelize/types';

export async function createPerformance_c(ctx: Context) {
  const errorInfo = ctx.query as Optional<any, string>;

  try {
    await createPerformance_s(errorInfo);

    ctx.defaultResponse();
  } catch (err) {
    console.log(err);

    ctx.defaultError();
  }
}
