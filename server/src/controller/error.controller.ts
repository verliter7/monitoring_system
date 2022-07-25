import { createErrorInfo } from '@/service/error.service';
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
