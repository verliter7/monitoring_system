import Router from 'koa-router';
import { createResource_c, getResourceCount_c } from '@/controller/resource.controller';
import type { DefaultState, Context } from 'koa';

const router = new Router<DefaultState, Context>({ prefix: '/resource' });

router.post('/create', createResource_c);
router.get('/count', getResourceCount_c);

export default router;
