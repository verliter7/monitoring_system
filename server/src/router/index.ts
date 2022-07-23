import Router from 'koa-router';
import testRouter from './error.router';
import type { DefaultState, Context } from 'koa';

const router = new Router<DefaultState, Context>({ prefix: '/api/v1' });

router.use(testRouter.routes());

export default router;
