import Router from 'koa-router';
import { createError_c, queryErrorCount_c } from '@/controller/error.controller';
import type { DefaultState, Context } from 'koa';

const router = new Router<DefaultState, Context>({ prefix: '/error' });

router.get('/create', createError_c);

router.get('/count', queryErrorCount_c);

export default router;
