import {
  createHttp_s,
  getAllHttpInfos_s,
  getHttpMsgCluster_s,
  getHttpSuccessRate_s,
  getHttpTimeConsume_s,
} from '@/service/http.service';
import type { Context } from 'koa';

export async function createHttp_c(ctx: Context) {
  const httpInfos = ctx.request.body;
  const { aid } = ctx.state;

  try {
    for (const e of httpInfos) {
      e.ip = ctx.ip;
      await createHttp_s(aid, e);
    }

    ctx.defaultResponse();
  } catch (err) {
    console.log(err);

    ctx.defaultError();
  }
}

export async function getHttpSuccessRate_c(ctx: Context) {
  const { pastDays = 1 } = ctx.query;
  const { aid } = ctx.state;

  try {
    const httpSuccessRateData = await getHttpSuccessRate_s(aid, Number(pastDays));
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
  const { pastDays = 1 } = ctx.query;
  const { aid } = ctx.state;

  try {
    const httpMsgClustereData = await getHttpMsgCluster_s(aid, Number(pastDays));
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
  const { pastDays = 1, type } = ctx.query;
  const { aid } = ctx.state;

  if (!type) return ctx.defaultError({ code: 400, message: '缺少type参数' });

  try {
    const httpSuccessTimeConsumeeData = await getHttpTimeConsume_s(aid, Number(pastDays), type as 'success' | 'fail');
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
  const { pastDays, current, size } = ctx.query;
  const { aid } = ctx.state;

  if (!current || !size) return ctx.defaultError({ code: 400, message: '缺少current或者size参数' });

  try {
    const allHttpInfos = await getAllHttpInfos_s(aid, ...[pastDays, current, size].map(Number));
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
