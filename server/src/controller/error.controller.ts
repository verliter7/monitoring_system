import { createError_s, queryErrorCount_s } from '@/service/error.service';
import type { Context } from 'koa';
import type { Optional } from 'sequelize/types';

export async function createError_c(ctx: Context) {
  const errorInfo = ctx.query as Optional<any, string>;
  errorInfo.ip = ctx.ip;

  try {
    await createError_s(errorInfo);

    ctx.defaultResponse();
  } catch (err) {
    console.log(err);

    ctx.defaultError();
  }
}

export async function queryErrorCount_c(ctx: Context) {
  try {
    const { errorType } = ctx.query;
    const errorCounts = await queryErrorCount_s(errorType as string);

    ctx.defaultResponse({
      code: 200,
      data: errorCounts,
      message: '请求成功',
      success: true,
    });
  } catch (err) {
    console.log(err);

    ctx.defaultError({ code: 500, message: err as string });
  }
}
