import Router from 'koa-router';
import { createResource_c, getResourceCount_c, getResourceData_c } from '@/controller/resource.controller';
import type { DefaultState, Context } from 'koa';

const router = new Router<DefaultState, Context>({ prefix: '/resource' });

router.post('/create', createResource_c);
router.get('/getResourceCount', getResourceCount_c);
router.get('/getResourceData', getResourceData_c);

export default router;
