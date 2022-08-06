import Router from 'koa-router';
import errorRouter from './error.router';
import httpRouter from './http.router';
import performanceRouter from './performance.router';
import testRouter from './test.router';
import type { DefaultState, Context } from 'koa';

const router = new Router<DefaultState, Context>({ prefix: '/api/v1' });

router.use(errorRouter.routes());
router.use(httpRouter.routes());
router.use(performanceRouter.routes());
router.use(testRouter.routes());

export default router;
