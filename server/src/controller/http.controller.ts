import {
  createHttp_s,
  getAllHttpInfos_s,
  getHttpMsgCluster_s,
  getHttpSuccessRate_s,
  getHttpTimeConsume_s,
} from '@/service/http.service';
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
    ctx.defaultError({ code: 500, message: '服务器出错' });
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
    ctx.defaultError({ code: 500, message: '服务器出错' });
  }
}

export async function getHttpTimeConsume_c(ctx: Context) {
  const { type } = ctx.query;

  try {
    const httpSuccessTimeConsumeeData = await getHttpTimeConsume_s(type as 'success' | 'fail');
    ctx.defaultResponse({
      code: 200,
      data: httpSuccessTimeConsumeeData,
      message: '请求成功',
      success: true,
    });
  } catch (err) {
    console.log(err);
    ctx.defaultError({ code: 500, message: '服务器出错' });
  }
}

export async function getAllHttpInfos_c(ctx: Context) {
  const { current, size } = ctx.query;

  try {
    const allHttpInfos = await getAllHttpInfos_s(parseInt(current as string), parseInt(size as string));
    ctx.defaultResponse({
      code: 200,
      data: allHttpInfos,
      message: '请求成功',
      success: true,
    });
  } catch (err) {
    console.log(err);
    ctx.defaultError({ code: 500, message: '服务器出错' });
  }
}
