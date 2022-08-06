import Router from 'koa-router';
import { createPerformance_c, getPerformanceData_c } from '@/controller/performance.controller';
import type { DefaultState, Context } from 'koa';
const multer = require('@koa/multer');
const upload = multer();

const router = new Router<DefaultState, Context>({ prefix: '/performance' });

// router.get('/create', createPerformance_c);
router.post('/create', upload.single('avatar'), createPerformance_c)

router.get('/getPerformanceData', getPerformanceData_c)
export default router;
