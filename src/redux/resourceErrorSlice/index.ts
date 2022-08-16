import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  IResourcesErrorState,
  IResourcesErrorChartData,
  IResourcesErrorTableData,
  IResourcesErrorCardData,
} from './type';
import type { RootState } from '../store';

const initialState: IResourcesErrorState = {
  pastDays: '1',
  card: {
    errorSum: {
      front: 0,
      back: 0,
    },
    errorRate: {
      front: 0,
      back: 0,
    },
  },
  chart: {
    backErrorCountData: [],
    backErrorRateData: [],
  },
  table: {
    records: [],
    current: 1,
    size: 0,
    total: 0,
  },
};

export const resourceErrorSlice = createSlice({
  name: 'resourceError',
  initialState,
  reducers: {
    pastDaysStorage: (state, action: PayloadAction<string>) => {
      state.pastDays = action.payload;
    },
    cardStorage: (state, action: PayloadAction<IResourcesErrorCardData>) => {
      state.card = action.payload;
    },
    chartStorage: (state, action: PayloadAction<IResourcesErrorChartData>) => {
      state.chart = action.payload;
    },
    tableStorage: (state, action: PayloadAction<IResourcesErrorTableData>) => {
      state.table = action.payload;
    },
  },
});

export const { pastDaysStorage, cardStorage, chartStorage, tableStorage } = resourceErrorSlice.actions;
export const selectCount = (state: RootState) => state.resourceError;
export default resourceErrorSlice.reducer;
