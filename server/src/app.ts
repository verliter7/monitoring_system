import Koa from 'koa';
import cors from '@koa/cors';
import koaBody from 'koa-body';
import router from './router';
import { APP_PORT } from '@/config/config.default';
import { auth } from './middleware/auth.middleware';

declare module 'koa' {
  interface DefaultState {
    stateProperty: boolean;
  }

  interface DefaultContext {
    defaultResponse(params?: Partial<IResponseParam>): void;
    defaultError(params?: Partial<IErrorParam>): void;
  }
}

interface IResponseParam<T = any> {
  code: number;
  data: Record<string, T> | null;
  message: string;
  success: boolean;
}

interface IErrorParam {
  code: number;
  message: string;
}

const app = new Koa();
app.proxy = true;

app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);
app.use(
  koaBody({
    multipart: true,
  }),
);

app.use(async (ctx, next) => {
  ctx.defaultResponse = (params) => {
    const defaultParams = {
      code: 200,
      data: {},
      message: '',
      success: true,
    };

    ctx.body = params ? Object.assign(defaultParams, params) : params;
  };

  ctx.defaultError = (error) => {
    const defaultError = { code: 400, data: {}, message: '发生未知错误！', success: false };

    ctx.body = error ? Object.assign(defaultError, error) : error;
  };

  if (ctx.method == 'OPTIONS') {
    ctx.body = '';
    ctx.status = 204;
  }

  await next();
});

app.use(auth);

app.use(router.routes()).use(router.allowedMethods());

app.listen(APP_PORT, () => {
  console.log(`server is running on http://localhost:${APP_PORT}`);
});
