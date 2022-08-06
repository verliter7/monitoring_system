import { createHttp_s } from '@/service/http.service';
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
