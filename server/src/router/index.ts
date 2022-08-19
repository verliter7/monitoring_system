import Router from 'koa-router';
import userRouter from './user.router';
import errorRouter from './error.router';
import httpRouter from './http.router';
import performanceRouter from './performance.router';
import testRouter from './test.router';
import uservitalsRouter from './uservitals.router';
import resourceRouter from './resource.router';
import type { DefaultState, Context } from 'koa';

const router = new Router<DefaultState, Context>({ prefix: '/api/v1' });

router.use(userRouter.routes());
router.use(errorRouter.routes());
router.use(httpRouter.routes());
router.use(performanceRouter.routes());
router.use(uservitalsRouter.routes());
router.use(resourceRouter.routes());
router.use(testRouter.routes());

export default router;
