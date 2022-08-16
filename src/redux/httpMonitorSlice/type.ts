import { IAllHttpInfos, ITabActiveListItemInfo } from '@/pages/HttpMonitor/type';

export type IHttpMonitorState = { pastDays: string; allListItemInfo: ITabActiveListItemInfo } & {
  table: IAllHttpInfos;
};
