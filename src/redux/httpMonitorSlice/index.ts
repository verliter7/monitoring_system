import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type {
  IAllHttpInfos,
  ITabMsgClusterItemInfo,
  ITabSuccessRateItemInfo,
  ITabTimeConsumeItemInfo,
} from '@/pages/HttpMonitor/type';
import type { IHttpMonitorState } from './type';

const initialState: IHttpMonitorState = {
  pastDays: '1',
  allListItemInfo: {},
  table: { records: [], current: 1, size: 0, total: 0 },
} as any;

export const httpMonitorSlice = createSlice({
  name: 'httpMonitor',
  initialState,
  reducers: {
    pastDaysStorage: (state, action: PayloadAction<string>) => {
      state.pastDays = action.payload;
    },
    successRateStorage: (state, action: PayloadAction<Record<string, ITabSuccessRateItemInfo>>) => {
      state.allListItemInfo.successRate = action.payload;
    },
    msgClusterStorage: (state, action: PayloadAction<Record<string, ITabMsgClusterItemInfo>>) => {
      state.allListItemInfo.msgCluster = action.payload;
    },
    successTimeConsumeStorage: (state, action: PayloadAction<Record<string, ITabTimeConsumeItemInfo>>) => {
      state.allListItemInfo.successTimeConsume = action.payload;
    },
    failTimeConsumeStorage: (state, action: PayloadAction<Record<string, ITabTimeConsumeItemInfo>>) => {
      state.allListItemInfo.failTimeConsume = action.payload;
    },
    tableStorage: (state, action: PayloadAction<IAllHttpInfos>) => {
      state.table = action.payload;
    },
  },
});

export const {
  pastDaysStorage,
  successRateStorage,
  msgClusterStorage,
  successTimeConsumeStorage,
  failTimeConsumeStorage,
  tableStorage,
} = httpMonitorSlice.actions;
export const selectCount = (state: RootState) => state.httpMonitor;
export default httpMonitorSlice.reducer;
