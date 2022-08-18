import { api, HttpReq } from '@/utils';
import type { HttpReqType } from '@/utils/HttpReq/type';
import type { HttpErrorData, IErrorConutByTimeData } from './type';
import type { IGetTableDataConfig } from '@/public/PubTable/type';

export const getHttpErrorCount: HttpReqType<IErrorConutByTimeData> = (pastDays: string) => {
  return HttpReq.send({
    url: api.getErrorCount,
    method: 'get',
    body: {
      pastDays,
      errorType: 'httpError',
    },
  });
};

export const getHttpErrorData: HttpReqType<HttpErrorData> = (
  pastDays: string,
  { current, size }: IGetTableDataConfig,
) => {
  return HttpReq.send({
    url: api.getHttpErrorData,
    method: 'get',
    body: {
      current,
      size,
      pastDays,
    },
  });
};
