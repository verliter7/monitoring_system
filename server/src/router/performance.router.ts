import Router from 'koa-router';
import { createPerformance_c } from '@/controller/performance.controller';
import type { DefaultState, Context } from 'koa';

const router = new Router<DefaultState, Context>({ prefix: '/performance' });

router.get('/create', createPerformance_c);

export default router;
