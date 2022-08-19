import type { Context, Next } from 'koa';

export const userValidator = async (ctx: Context, next: Next) => {
  const { username, password } = ctx.request.body;
  // 合法性
  if (!username || !password) {
    ctx.defaultError({
      code: 400,
      message: '用户名和密码不能为空',
    });

    return;
  }

  await next();
};
