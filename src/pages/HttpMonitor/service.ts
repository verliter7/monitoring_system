import { api, HttpReq } from '@/utils';
import type { HttpReqType } from '@/utils/HttpReq/type';
import type { IHttpMsgClusterData, IHttpSuccessRateData } from './type';

export const getHttpSuccessRate: HttpReqType<IHttpSuccessRateData> = () => HttpReq.send(api.getHttpSuccessRate);
export const getHttpMsgCluster: HttpReqType<IHttpMsgClusterData> = () => HttpReq.send(api.getHttpMsgCluster);
