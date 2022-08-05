import { api, HttpReq } from '@/utils';
import type { HttpReqType } from '@/utils/HttpReq/type';
import type { IData } from './type';

export const getResourceErrorCounts: HttpReqType<IData> = () => {
  return HttpReq.send({
    url: api.getErrorCounts,
    method: 'get',
    body: {
      errorType: 'resourceError',
    },
  });
};
