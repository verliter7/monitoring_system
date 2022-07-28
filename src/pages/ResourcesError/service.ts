import { api, HttpReq } from '@/utils';
import { HttpReqType } from '@/utils/HttpReq/type';

export const getResourceErrorCounts: HttpReqType = () => {
  return HttpReq.send({
    url: api.getErrorCounts,
    method: 'get',
    body: {
      errorType: 'httpError',
    },
  });
};
