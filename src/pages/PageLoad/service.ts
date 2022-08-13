import { api, HttpReq } from '@/utils';
import { HttpReqType } from '@/utils/HttpReq/type';

export const getPerformanceData: HttpReqType<any> = (type: string) => {
  return HttpReq.send({
    url: api.getPerformanceData,
    method: 'get',
    body: {
      type,
    },
  });
};