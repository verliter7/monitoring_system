import { createError_s, getErrorCount_s, getResourceErrorData_s } from '@/service/error.service';
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

export async function getErrorCount_c(ctx: Context) {
  try {
    const { errorType } = ctx.query;

    if (!errorType) return ctx.defaultError({ code: 400, message: '缺少errorType参数' });

    const errorCount = await getErrorCount_s(errorType as string);

    ctx.defaultResponse({
      code: 200,
      data: errorCount,
      message: '请求成功',
      success: true,
    });
  } catch (err) {
    console.log(err);

    ctx.defaultError({ code: 500, message: err as string });
  }
}

export async function getResourceErrorData_c(ctx: Context) {
  try {
    const { current, size } = ctx.query;

    if (!current || !size) return ctx.defaultError({ code: 400, message: '缺少current或者size参数' });

    const resourcesErrors = await getResourceErrorData_s(parseInt(current as string), parseInt(size as string));
    ctx.defaultResponse({
      code: 200,
      data: resourcesErrors,
      message: '请求成功',
      success: true,
    });
  } catch (err) {
    console.log(err);
    ctx.defaultError({ code: 500, message: err as string });
  }
}
