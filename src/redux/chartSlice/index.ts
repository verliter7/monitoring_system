import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IChartState, IResourcesErrorData, chartTypeEnum } from './type';
import type { RootState } from '../store';

const initialState: IChartState = {
  resources: {
    backErrorCountData: [],
    errorSum: {
      front: 0,
      back: 0,
    },
    type: chartTypeEnum.RS,
  },
};

export const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    storage: (state, action: PayloadAction<IResourcesErrorData>) => {
      const payload = action.payload;

      switch (payload.type) {
        case chartTypeEnum.RS:
          state.resources = payload;
          break;
        default:
          break;
      }
    },
  },
});

export const { storage } = chartSlice.actions;
export const selectCount = (state: RootState) => state.chart;
export default chartSlice.reducer;
