import type { ReactNode } from 'react';
import type { HttpReqType } from '@/utils/HttpReq/type';
import { requestOptions } from '@/hooks/useRequest';

// 排序类型
export enum sortEnum {
  DF = 'default', // 默认排序
  AC = 'ascending', // 升序
  DC = 'descending', // 降序
}

// API请求tab 类型
export enum tabKeyEnum {
  SR = 'successRate', // 成功率
  MC = 'msgCluster', // Msg聚类
  ST = 'successTimeConsume', // 成功耗时
  FT = 'failTimeConsume', // 失败耗时
}

export type Content = (...args: any[]) => ReactNode;

export type Tab = '成功率' | '成功耗时' | '失败耗时' | ReactNode;
export type TabMap = '成功率' | '成功耗时' | '失败耗时' | Content;
export type CardTitle = 'API成功率' | 'Msg调用情况' | 'API成功耗时' | 'API失败耗时';

export interface ITab {
  tab: Tab;
  key: tabKeyEnum;
  content: ReactNode;
}

// 排行类型
export type RankType = 'callRate' | 'successRate' | 'callCount' | 'averageDuration';

export interface IRadioOption {
  label: string;
  value: Exclude<RankType, 'callCount' | 'failTimeConsume'>;
}

export type ITabMap = {
  [key in tabKeyEnum]: {
    tab: TabMap;
    content: Content;
    cartTitle: CardTitle;
    getRequestConfig: (
      ...args: any[]
    ) => [HttpReqType<Record<string, any>>, Partial<requestOptions<Record<string, any>>>];
    rankType: RankType;
    dataType: 'chartData' | 'tableData';
    runType: 'getSuccessRateRun' | 'getMsgClusterRun' | 'getHttpSuccessTimeConsumeRun' | 'getHttpFailTimeConsumeRun';
    getChartOrTable: (...args: any[]) => ReactNode;
    radioOptions?: IRadioOption[];
  };
};

export interface IPagination {
  position: ['bottomCenter'];
  total: number;
  current: number;
  pageSize: number;
  showQuickJumper: boolean;
  showSizeChanger: boolean;
  onChange: (page: number, pageSize: number) => void;
  showTotal: () => string;
}

export interface IHttpSuccessRateData {
  successRateInfos: {
    [key: string]: Record<string, [number, number]>;
  };
  total: number;
}

export interface IHttpMsgClusterData {
  [key: string]: {
    [key: string]: IMsgClusterTableData;
  };
}

export interface IHttpTimeConsumeData {
  [key: string]: {
    [key: string]: {
      callCount: number;
      duration: number;
    };
  };
}

export interface ISuccessRateChartData {
  time: string;
  successRate: number;
  callCount: number;
}

export interface ITabSuccessRateItemInfo {
  itemName: string;
  chartData: ISuccessRateChartData[];
  successRate: number;
  callRate: number;
  callCount: number;
}

export interface IMsgClusterTableData {
  apiName: string;
  callCount: number;
  status: number;
  key: string;
}

export interface ITabMsgClusterItemInfo {
  itemName: string;
  tableData: {
    records: IMsgClusterTableData[];
    size: number;
    current: number;
    total: number;
  };
  callCount: number;
}

export interface ITimeConsumeChartData {
  time: string;
  averageDuration: number;
  callCount: number;
}

export interface ITabTimeConsumeItemInfo {
  itemName: string;
  chartData: ITimeConsumeChartData[];
  averageDuration: number;
  callRate: number;
  callCount: number;
}

export interface ITabActiveListItemInfo {
  successRate: Record<string, ITabSuccessRateItemInfo>;
  msgCluster: Record<string, ITabMsgClusterItemInfo>;
  successTimeConsume: Record<string, ITabTimeConsumeItemInfo>;
  failTimeConsume: Record<string, ITabTimeConsumeItemInfo>;
}

export interface IHttpInfo {
  date: string;
  originUrl: string;
  requestUrl: string;
  status: number;
  httpMessage: string;
  duration: string;
}

export interface IAllHttpInfos {
  records: IHttpInfo[];
  size: number;
  current: number;
  total: number;
}
