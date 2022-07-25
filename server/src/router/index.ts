import Router from 'koa-router';
import errorRouter from './error.router';
import type { DefaultState, Context } from 'koa';

const router = new Router<DefaultState, Context>({ prefix: '/api/v1' });

router.use(errorRouter.routes());

export default router;
