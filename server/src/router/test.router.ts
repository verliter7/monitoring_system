import Router from 'koa-router';
import type { DefaultState, Context } from 'koa';

const router = new Router<DefaultState, Context>({ prefix: '/test' });

router.get('/', (ctx: Context) => {
  ctx.status = parseInt(ctx.query.status as string);
  ctx.body = { test1: 'test1', test2: [2131], test3: { a: 1 } };
});

export default router;
