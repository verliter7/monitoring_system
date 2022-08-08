import { api, HttpReq } from '@/utils';
import type { HttpReqType } from '@/utils/HttpReq/type';
import type { IHttpSuccessRateData } from './type';

export const getHttpSuccessRate: HttpReqType<IHttpSuccessRateData> = () => HttpReq.send(api.getHttpSuccessRate);
