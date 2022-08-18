import Router from 'koa-router';
import { createUservitals_c, getUservitalsData_c } from '@/controller/uservitals.controller';
import type { DefaultState, Context } from 'koa';

const router = new Router<DefaultState, Context>({ prefix: '/business' });

router.post('/create', createUservitals_c);
router.get('/getUservitalsData', getUservitalsData_c);

export default router;
