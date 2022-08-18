import type { JSErrorRecord } from "@/pages/JsError/type";

export interface JSBackErrorCountData {
    time: string;
    errorCount: number;
}

export interface JSBackErrorRateData {
    time: string;
    errorRate: number;
}

export interface JSErrorSum {
    front: number;
    back: number;
}

export interface JSErrorRate {
    front: number;
    back: number;
}

export interface JSErrorCardData {
    errorSum: JSErrorSum;
    errorRate: JSErrorRate;
}

export interface JSErrorChartData {
    backErrorCountData: JSBackErrorCountData[];
    backErrorRateData: JSBackErrorRateData[];
}

export interface JSErrorTableData {
    records: JSErrorRecord[];
    current: number;
    size: number;
    total: number;
}

export interface JSErrorState {
    pastDays: string;
    card: JSErrorCardData;
    chart: JSErrorChartData;
    table: JSErrorTableData;
}