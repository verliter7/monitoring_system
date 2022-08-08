import type { ReactNode } from 'react';

export interface IHttpSuccessRateData {
  successRateInfos: {
    [key: string]: Record<string, [number, number]>;
  };
  total: number;
}

export enum sortEnum {
  DF = 'default',
  AC = 'ascending',
  DC = 'descending',
}

export type TabKeyType = 'successRate' | 'msgCluster' | 'successTimeConsume' | 'failTimeConsume';

export interface ITab {
  tab: '成功率' | 'Msg聚类' | '成功耗时' | '失败耗时';
  key: TabKeyType;
  content?: ReactNode;
}

export interface ISuccessRateChartData {
  time: string;
  successRate: number;
  callCount: number;
}

export interface IActiveListItemInfo {
  itemName: string;
  chartData: ISuccessRateChartData[];
  successRate?: number;
  callRate?: number;
  callCount?: number;
}

export type RankType = 'callRate' | 'successRate';

export interface IRadioOptions {
  label: string;
  value: RankType;
}

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
