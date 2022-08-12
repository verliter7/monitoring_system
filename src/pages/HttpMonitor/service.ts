import { api, HttpReq } from '@/utils';
import type { HttpReqType } from '@/utils/HttpReq/type';
import type { IAllHttpInfos, IHttpMsgClusterData, IHttpSuccessRateData, IHttpTimeConsumeData } from './type';

export const getHttpSuccessRate: HttpReqType<IHttpSuccessRateData> = () => HttpReq.send(api.getHttpSuccessRate);
export const getHttpMsgCluster: HttpReqType<IHttpMsgClusterData> = () => HttpReq.send(api.getHttpMsgCluster);
export const getHttpSuccessTimeConsume: HttpReqType<IHttpTimeConsumeData> = () => {
  return HttpReq.send({
    url: api.getHttpTimeConsume,
    method: 'GET',
    body: {
      type: 'success',
    },
  });
};

export const getHttpFailTimeConsume: HttpReqType<IHttpTimeConsumeData> = () => {
  return HttpReq.send({
    url: api.getHttpTimeConsume,
    method: 'GET',
    body: {
      type: 'fail',
    },
  });
};

export const getAllHttpInfos: HttpReqType<IAllHttpInfos> = ({ current, size }: { current: number; size: number }) => {
  return HttpReq.send({
    url: api.getAllHttpInfos,
    method: 'GET',
    body: {
      current,
      size,
    },
  });
};
