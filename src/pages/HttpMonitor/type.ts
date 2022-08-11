import type { ReactNode } from 'react';
import type { HttpReqType } from '@/utils/HttpReq/type';
import { requestOptions } from '@/hooks/useRequest';

export enum sortEnum {
  DF = 'default',
  AC = 'ascending',
  DC = 'descending',
}

export enum tabKeyEnum {
  SR = 'successRate',
  MC = 'msgCluster',
  ST = 'successTimeConsume',
  FT = 'failTimeConsume',
}

export type Content = (...args: any[]) => ReactNode;

export type Tab = '成功率' | '成功耗时' | ReactNode;
export type TabMap = '成功率' | '成功耗时' | Content;
export type CardTitle = 'API成功率' | 'Msg调用情况' | 'API成功耗时' | 'API失败耗时';

export interface ITab {
  tab: Tab;
  key: tabKeyEnum;
  content: ReactNode;
}

export type RankType = 'callRate' | 'successRate' | 'callCount' | 'successTimeConsume' | 'failTimeConsume';

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
    dataType: 'chartData' | 'apiListInfo';
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

export interface IApiListInfo {
  apiName: string;
  callCount: number;
  status: number;
  key: string;
}

export interface ITabMsgClusterItemInfo {
  itemName: string;
  apiListInfo: {
    records: IApiListInfo[];
    size: number;
    current: number;
    total: number;
  };
  callCount: number;
}

export interface ITabActiveListItemInfo {
  successRate: Record<string, ITabSuccessRateItemInfo>;
  msgCluster: Record<string, ITabMsgClusterItemInfo>;
  successTimeConsume: Record<string, any>;
  failTimeConsume: Record<string, any>;
}

export interface IHttpSuccessRateData {
  successRateInfos: {
    [key: string]: Record<string, [number, number]>;
  };
  total: number;
}

export interface IHttpMsgClusterData {
  [key: string]: {
    [key: string]: IApiListInfo;
  };
}
