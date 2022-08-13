import { createUservitals_s, getUservitalsData_s } from '@/service/uservitals.service';
import type { Context } from 'koa';
import type { Optional } from 'sequelize/types';

export async function createUservitals_c(ctx: Context) {
  const uservitalsInfo = ctx.request.body as Optional<any, string>;
  uservitalsInfo.ip = ctx.ip;

  ctx.body = {
    code: 200,
    success: true,
  };
  try {
    await createUservitals_s(uservitalsInfo);

    ctx.defaultResponse();
  } catch (err) {
    console.log(err);

    ctx.defaultError();
  }
}

export async function getUservitalsData_c(ctx: Context) {
  try {
    let data = await getUservitalsData_s();
    ctx.defaultResponse({
      code: 200,
      data: data,
      message: '请求成功',
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
}
