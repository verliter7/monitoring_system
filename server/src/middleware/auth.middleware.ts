import jwt from 'jsonwebtoken';
import env from '@/config/config.default';
import type { Context, Next } from 'koa';
import type { JwtPayload } from 'jsonwebtoken';

const { JWT_SECRET } = env as Record<string, string>;

export async function auth(ctx: Context, next: Next) {
  const {
    header: { authorization = '' },
    path,
  } = ctx.request;

  if (path !== '/api/v1/user/register' && path !== '/api/v1/user/login') {
    try {
      const userInfo = jwt.verify(authorization, JWT_SECRET) as JwtPayload;

      ctx.state.aid = userInfo.aid;
    } catch (err: any) {
      switch (err.name) {
        case 'TokenExpiredError':
          ctx.defaultError({
            code: 400,
            message: 'token已过期',
          });
          return;
        case 'JsonWebTokenError':
          ctx.defaultError({
            code: 400,
            message: '无效的token',
          });
          return;
        default:
          return;
      }
    }
  }

  await next();
}
