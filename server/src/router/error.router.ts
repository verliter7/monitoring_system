import Router from 'koa-router';
import { createError } from '@/controller/error.controller';
import type { DefaultState, Context } from 'koa';

const router = new Router<DefaultState, Context>();

router.get('/error', createError);

export default router;
