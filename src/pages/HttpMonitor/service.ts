import { api, HttpReq } from '@/utils';
import type { HttpReqType } from '@/utils/HttpReq/type';
import type { IHttpConutByTimeData } from './type';

export const getHttpSuccessRate: HttpReqType<IHttpConutByTimeData> = () => HttpReq.send(api.getHttpSuccessRate);
