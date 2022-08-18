import { api, HttpReq } from "@/utils";
import type { HttpReqType } from "@/utils/HttpReq/type";
import type { JSErrorData, JSErrorCountByTimeData } from './type';
import type { IGetTableDataConfig } from '@/public/PubTable/type';

// 获取错误数
export const getJSErrorCount: HttpReqType<JSErrorCountByTimeData> = (pastDays: string) => {
    return HttpReq.send({
        url: api.getErrorCount,
        method: 'get',
        body: {
            pastDays,
            errorType: 'jsError'
        }
    })
};

// 获取错误详细信息
export const getJSErrorData: HttpReqType<JSErrorData> = (
    pastDays: string,
    { current, size }: IGetTableDataConfig
) => {
    return HttpReq.send({
        url: api.getJsErrorData,
        method: 'get',
        body: {
            current, size, pastDays
        }
    })
}