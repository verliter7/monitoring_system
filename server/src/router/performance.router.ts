import Router from 'koa-router';
import { createPerformance_c, getPerformanceData_c } from '@/controller/performance.controller';
import type { DefaultState, Context } from 'koa';

const router = new Router<DefaultState, Context>({ prefix: '/performance' });

router.post('/create', createPerformance_c);
router.get('/getPerformanceData', getPerformanceData_c);

export default router;
