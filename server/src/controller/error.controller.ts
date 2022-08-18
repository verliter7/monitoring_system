import { createError_s, getErrorCount_s, getHttpErrorData_s, getResourceErrorData_s } from '@/service/error.service';
import type { Context } from 'koa';
import type { ErrorType } from '@/service/error.service';

export async function createError_c(ctx: Context) {
  const errorInfos = ctx.request.body;

  try {
    for (const e of errorInfos) {
      e.ip = ctx.ip;
      await createError_s(e);
    }
    ctx.defaultResponse();
  } catch (err) {
    console.log(err);

    ctx.defaultError();
  }
}

export async function getErrorCount_c(ctx: Context) {
  try {
    const { pastDays = 1, errorType } = ctx.query;

    if (!errorType) return ctx.defaultError({ code: 400, message: '缺少errorType参数' });

    const errorCount = await getErrorCount_s(Number(pastDays), errorType as ErrorType);

    ctx.defaultResponse({
      code: 200,
      data: errorCount,
      message: '请求成功',
      success: true,
    });
  } catch (err) {
    console.log(err);

    ctx.defaultError({ code: 500, message: '服务器出错' });
  }
}

export async function getResourceErrorData_c(ctx: Context) {
  try {
    const { pastDays = 1, current, size } = ctx.query;

    if (!current || !size) return ctx.defaultError({ code: 400, message: '缺少current或者size参数' });

    const resourcesErrors = await getResourceErrorData_s(...[pastDays, current, size].map(Number));
    ctx.defaultResponse({
      code: 200,
      data: resourcesErrors,
      message: '请求成功',
      success: true,
    });
  } catch (err) {
    console.log(err);
    ctx.defaultError({ code: 500, message: '服务器出错' });
  }
}

export async function getHttpErrorData_c(ctx: Context) {
  try {
    const { pastDays = 1, current, size } = ctx.query;

    if (!current || !size) return ctx.defaultError({ code: 400, message: '缺少current或者size参数' });

    const httpsErrors = await getHttpErrorData_s(...[pastDays, current, size].map(Number));
    ctx.defaultResponse({
      code: 200,
      data: httpsErrors,
      message: '请求成功',
      success: true,
    });
  } catch (err) {
    console.log(err);
    ctx.defaultError({ code: 500, message: '服务器出错' });
  }
}
