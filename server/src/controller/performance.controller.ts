import { createPerformance_s, getPerformanceData_s } from '@/service/performance.service';
import type { Context } from 'koa';
import { JSON, Optional } from 'sequelize/types';

export async function createPerformance_c(ctx: Context) {
  const performanceInfo = ctx.request.body as Optional<any, string>;
  performanceInfo.ip = ctx.ip;

  ctx.body = {
    code: 200,
    success: true,
  };
  try {
    await createPerformance_s(performanceInfo);

    ctx.defaultResponse();
  } catch (err) {
    console.log(err);

    ctx.defaultError();
  }
}

export async function getPerformanceData_c(ctx: Context) {
  const { type } = ctx.query;

  try {
    let data = await getPerformanceData_s(type as string);
    ctx.defaultResponse({
      code: 200,
      data: data,
      message: '请求成功',
      success: true,
    });
  } catch (error) {}
}
