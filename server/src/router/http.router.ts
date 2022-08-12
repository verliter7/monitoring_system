import Router from 'koa-router';
import { createHttp_c, getHttpSuccessRate_c, getHttpMsgCluster_c } from '@/controller/http.controller';
import type { DefaultState, Context } from 'koa';

const router = new Router<DefaultState, Context>({ prefix: '/http' });

router.post('/create', createHttp_c);
router.get('/getHttpSuccessRate', getHttpSuccessRate_c);
router.get('/getHttpMsgCluster', getHttpMsgCluster_c);

export default router;
