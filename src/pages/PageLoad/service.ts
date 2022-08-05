import { api, HttpReq } from '@/utils';
import { HttpReqType } from '@/utils/HttpReq/type';

export const getPerformanceData: HttpReqType<string> = (type?: string) => {
  return HttpReq.send({
    url: api.getPerformanceData,
    method: 'get',
    body: {
      type,
    },
  });
};
