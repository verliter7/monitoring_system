import Router from 'koa-router';
import type { DefaultState, Context } from 'koa';

const router = new Router<DefaultState, Context>({ prefix: '/error' });

router.post('/jsExecute', (ctx) => {
  console.log(ctx.request.body);

  ctx.defaultResponse({ code: 200, message: '上报成功!', success: true });
});

router.post('/resources', (ctx) => {
  ctx.body = 'test!';
});

export default router;
