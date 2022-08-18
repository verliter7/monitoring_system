export interface JSErrorCountByTimeData {
    frontErrorConutByTime: Record<string, [number, number]>;  // string类型定义为[number,number]类型
    backErrorConutByTime: Record<string, [number, number]>;
}

export interface JSBackErrorCountData {
    time: string;
    errorCount: number;
}

export interface JSBackErrorRateData {
    time: string;
    errorRate: number;
}

// 表格当前页数据接口
export interface JSErrorRecord {
    key: string;
    date: string;
    originUrl: string;
    requestUrl: string;
    method: string;
    status: number;
    httpMessage: string;
    duration: number;
    count: number;
}

// 表格所有数据信息接口
export type JSErrorData = {
    records: JSErrorRecord[];
    current: number;
    size: number;
    total: number;
};
