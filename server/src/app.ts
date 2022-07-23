import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import router from './router';

declare module 'koa' {
  interface DefaultState {
    stateProperty: boolean;
  }

  interface DefaultContext {
    defaultResponse(params: Partial<IResponseParam>): void;
    defaultError(params: Partial<IErrorParam>): void;
  }
}

interface IResponseParam<T = any> {
  code: number;
  data: Record<string, T>;
  message: string;
  success: boolean;
}

interface IErrorParam {
  code: number;
  message: string;
}

const app = new Koa();

app.use(async (ctx, next) => {
  ctx.defaultResponse = ({ code = 404, data = {}, message = '', success = false }) => {
    ctx.body = {
      code,
      data,
      message,
      success,
    };
  };
  ctx.defaultError = ({ code = 404, message = '发生未知错误！' }) => {
    ctx.body = {
      code,
      message,
    };
  };
  await next();
});

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

app.listen(8080, () => {
  console.log(`server is running on http://localhost:8080`);
});
