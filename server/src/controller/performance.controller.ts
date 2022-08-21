import { createPerformance_s, getPerformanceData_s } from '@/service/performance.service';
import type { Context } from 'koa';
import { Optional } from 'sequelize/types';

export async function createPerformance_c(ctx: Context) {
  const performanceInfo = ctx.request.body as Optional<any, string>;
  const { aid } = performanceInfo;
  performanceInfo.ip = ctx.ip;

  try {
    await createPerformance_s(aid, performanceInfo);

    ctx.defaultResponse();
  } catch (err) {
    console.log(err);

    ctx.defaultError();
  }
}

export async function getPerformanceData_c(ctx: Context) {
  const { type } = ctx.query;
  const { aid } = ctx.request.body;
  console.log(aid);

  try {
    const data = await getPerformanceData_s(aid, type as string);
    ctx.defaultResponse({
      data,
      message: '请求成功',
    });
  } catch (err) {
    console.log(err);

    ctx.defaultError({ code: 500, message: '服务器出错' });
  }
}
