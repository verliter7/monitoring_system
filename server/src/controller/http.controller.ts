import { createHttp_s, getHttpMsgCluster_s, getHttpSuccessRate_s } from '@/service/http.service';
import type { Context } from 'koa';

export async function createHttp_c(ctx: Context) {
  const errorInfo = ctx.request.body;

  errorInfo.ip = ctx.ip;

  try {
    await createHttp_s(errorInfo);

    ctx.defaultResponse();
  } catch (err) {
    console.log(err);

    ctx.defaultError();
  }
}

export async function getHttpSuccessRate_c(ctx: Context) {
  try {
    const httpSuccessRateData = await getHttpSuccessRate_s();
    ctx.defaultResponse({
      code: 200,
      data: httpSuccessRateData,
      message: '请求成功',
      success: true,
    });
  } catch (err) {
    console.log(err);
    ctx.defaultError({ code: 500, message: err as string });
  }
}

export async function getHttpMsgCluster_c(ctx: Context) {
  try {
    const httpMsgClustereData = await getHttpMsgCluster_s();
    ctx.defaultResponse({
      code: 200,
      data: httpMsgClustereData,
      message: '请求成功',
      success: true,
    });
  } catch (err) {
    console.log(err);
    ctx.defaultError({ code: 500, message: err as string });
  }
}
