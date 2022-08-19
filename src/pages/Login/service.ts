import { api, HttpReq } from '@/utils';
import type { HttpReqType } from '@/utils/HttpReq/type';

export const register: HttpReqType<{}> = (username: string, password: string) => {
  return HttpReq.send({
    url: api.register,
    method: 'post',
    body: {
      username,
      password,
    },
  });
};

export const login: HttpReqType<{}> = (username: string, password: string) => {
  return HttpReq.send({
    url: api.login,
    method: 'post',
    body: {
      username,
      password,
    },
  });
};
