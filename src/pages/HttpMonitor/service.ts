import { api, HttpReq } from '@/utils';
import type { HttpReqType } from '@/utils/HttpReq/type';
import type { IAllHttpInfos, IHttpMsgClusterData, IHttpSuccessRateData, IHttpTimeConsumeData } from './type';

export const getHttpSuccessRate: HttpReqType<IHttpSuccessRateData> = (pastDays: string) => {
  return HttpReq.send({
    url: api.getHttpSuccessRate,
    method: 'GET',
    body: {
      pastDays,
    },
  });
};

export const getHttpMsgCluster: HttpReqType<IHttpMsgClusterData> = (pastDays: string) => {
  return HttpReq.send({
    url: api.getHttpMsgCluster,
    method: 'GET',
    body: {
      pastDays,
    },
  });
};

export const getHttpSuccessTimeConsume: HttpReqType<IHttpTimeConsumeData> = (pastDays: string) => {
  return HttpReq.send({
    url: api.getHttpTimeConsume,
    method: 'GET',
    body: {
      pastDays,
      type: 'success',
    },
  });
};

export const getHttpFailTimeConsume: HttpReqType<IHttpTimeConsumeData> = (pastDays: string) => {
  return HttpReq.send({
    url: api.getHttpTimeConsume,
    method: 'GET',
    body: {
      pastDays,
      type: 'fail',
    },
  });
};

export const getAllHttpInfos: HttpReqType<IAllHttpInfos> = (
  pastDays: string,
  { current, size }: { current: number; size: number },
) => {
  return HttpReq.send({
    url: api.getAllHttpInfos,
    method: 'GET',
    body: {
      pastDays,
      current,
      size,
    },
  });
};
