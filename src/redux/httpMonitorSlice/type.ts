import { IAllHttpInfos, ITabActiveListItemInfo } from '@/pages/HttpMonitor/type';

export type IHttpMonitorState = { allListItemInfo: ITabActiveListItemInfo } & { table: IAllHttpInfos };
