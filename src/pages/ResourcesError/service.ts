import { api, HttpReq } from '@/utils';
import type { HttpReqType } from '@/utils/HttpReq/type';
import type { IErrorConutByTimeData, ResourceErrorData } from './type';
import type { IGetTableDataConfig } from '@/public/PubTable/type';

export const getResourceCount: HttpReqType<{ total: number }> = () => {
  return HttpReq.send({
    url: api.getResourceCount,
    method: 'get',
  });
};

export const getResourceErrorCount: HttpReqType<IErrorConutByTimeData> = (pastDays: string) => {
  return HttpReq.send({
    url: api.getErrorCount,
    method: 'get',
    body: {
      pastDays,
      errorType: 'resourceError',
    },
  });
};

export const getResourceErrorData: HttpReqType<ResourceErrorData> = (
  pastDays: string,
  { current, size }: IGetTableDataConfig,
) => {
  return HttpReq.send({
    url: api.getResourceErrorData,
    method: 'get',
    body: {
      current,
      size,
      pastDays,
    },
  });
};
