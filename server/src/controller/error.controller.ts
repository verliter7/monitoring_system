import { createErrorInfo, findErrorInfo as getErrorInfo } from '@/service/error.service';
import type { Context } from 'koa';
import type { Optional } from 'sequelize/types';

export async function createError(ctx: Context) {
  const errorInfo = ctx.query as Optional<any, string>;

  try {
    await createErrorInfo(errorInfo);

    ctx.defaultResponse();
  } catch (err) {
    console.log(err);

    ctx.defaultError();
  }
}

export async function getError(ctx: Context) {
  try {
    const { errorId } = ctx.query;
    const res = await getErrorInfo(errorId as string);

    ctx.defaultResponse({
      code: 200,
      data: res,
      message: '查找成功',
      success: true,
    });
  } catch (err) {
    console.log(err);

    ctx.defaultError({ code: 500, message: err as string });
  }
}
