import Router from 'koa-router';
import {
  createError_c,
  getErrorCount_c,
  getJsErrorData_c,
  getResourceErrorData_c,
  getHttpErrorData_c,
} from '@/controller/error.controller';
import type { DefaultState, Context } from 'koa';

const router = new Router<DefaultState, Context>({ prefix: '/error' });

router.post('/create', createError_c);
router.get('/count', getErrorCount_c);
router.get('/getJsErrorData', getJsErrorData_c);
router.get('/getResourceErrorData', getResourceErrorData_c);
router.get('/getHttpErrorData', getHttpErrorData_c);

export default router;
