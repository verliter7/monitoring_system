import Koa from 'koa';
import koaBody from 'koa-body';
import router from './router';

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
      success: false,
    };

    ctx.body = params ? Object.assign(defaultParams, params) : params;
  };

  ctx.defaultError = (error) => {
    const defaultError = { code: 400, message: '发生未知错误！' };

    ctx.body = error ? Object.assign(defaultError, error) : error;
  };

  if (ctx.method == 'OPTIONS') {
    ctx.body = '';
    ctx.status = 204;
  }

  await next();
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(8081, () => {
  console.log(`server is running on http://localhost:8081`);
});
