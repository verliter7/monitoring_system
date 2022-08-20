import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/config/config.default';
import type { Context, Next } from 'koa';

const urls = [
  '/api/v1/user/register',
  '/api/v1/user/login',
  '/api/v1/error/create',
  '/api/v1/http/create',
  '/api/v1/performance/create',
  '/api/v1/resource/create',
  '/api/v1/business/create',
  '/api/v1/test',
];

export async function auth(ctx: Context, next: Next) {
  const {
    header: { authorization = '' },
    path,
  } = ctx.request;
  if (!urls.includes(path)) {
    jwt.verify(authorization, JWT_SECRET, (err, userInfo) => {
      if (err) {
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

      ctx.state.aid = (userInfo as jwt.JwtPayload).aid;
    });
  }

  await next();
}
