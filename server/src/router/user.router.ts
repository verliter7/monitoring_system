import Router from 'koa-router';
import { login, register } from '@/controller/user.controller';
import { userValidator } from '@/middleware/user.middleware';
import type { DefaultState, Context } from 'koa';

const router = new Router<DefaultState, Context>({ prefix: '/user' });

router.post('/register', userValidator, register);
router.post('/login', userValidator, login);

export default router;
