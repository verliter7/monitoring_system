import Router from 'koa-router';
import { createHttp_c } from '@/controller/http.controller';
import type { DefaultState, Context } from 'koa';

const router = new Router<DefaultState, Context>({ prefix: '/http' });

router.post('/create', createHttp_c);

export default router;
