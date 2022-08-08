import Router from 'koa-router';
import errorRouter from './error.router';
import performanceRouter from './performance.router';
import testRouter from './test.router';
import uservitalsRouter from './uservitals.router';
import type { DefaultState, Context } from 'koa';

const router = new Router<DefaultState, Context>({ prefix: '/api/v1' });

router.use(errorRouter.routes());
router.use(performanceRouter.routes());
router.use(uservitalsRouter.routes());
router.use(testRouter.routes());

export default router;
