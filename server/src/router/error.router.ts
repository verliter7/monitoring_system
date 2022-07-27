import Router from 'koa-router';
import { createError, getError } from '@/controller/error.controller';
import type { DefaultState, Context } from 'koa';

const router = new Router<DefaultState, Context>({ prefix: '/error' });

router.get('/add', createError);

router.get('/get', getError);

export default router;
