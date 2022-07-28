import Router from 'koa-router';
import type { DefaultState, Context } from 'koa';

const router = new Router<DefaultState, Context>({ prefix: '/test' });

router.get('/', (ctx: Context) => {
  ctx.status = parseInt(ctx.query.status as string);
  ctx.body = 'error test';
});

export default router;
