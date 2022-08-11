import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { ITabActiveListItemInfo, ITabMsgClusterItemInfo, ITabSuccessRateItemInfo } from '@/pages/HttpMonitor/type';

const initialState: ITabActiveListItemInfo = {} as ITabActiveListItemInfo;

export const httpMonitorSlice = createSlice({
  name: 'httpMonitor',
  initialState,
  reducers: {
    successRateStorage: (state, action: PayloadAction<Record<string, ITabSuccessRateItemInfo>>) => {
      state.successRate = action.payload;
    },
    msgClusterStorage: (state, action: PayloadAction<Record<string, ITabMsgClusterItemInfo>>) => {
      state.msgCluster = action.payload;
    },
  },
});

export const { successRateStorage, msgClusterStorage } = httpMonitorSlice.actions;
export const selectCount = (state: RootState) => state.resourceError;
export default httpMonitorSlice.reducer;
