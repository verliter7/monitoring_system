import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IResourcesErrorState, IResourcesErrorChartData, IResourcesErrorTableData } from './type';
import type { RootState } from '../store';

const initialState: IResourcesErrorState = {
  chart: {
    backErrorCountData: [],
    errorSum: {
      front: 0,
      back: 0,
    },
  },
  table: {
    records: [],
    current: 1,
    size: 0,
    total: 0,
  },
};

export const resourceErrorSlice = createSlice({
  name: 'resource',
  initialState,
  reducers: {
    chartStorage: (state, action: PayloadAction<IResourcesErrorChartData>) => {
      state.chart = action.payload;
    },
    tableStorage: (state, action: PayloadAction<IResourcesErrorTableData>) => {
      state.table = action.payload;
    },
  },
});

export const { chartStorage, tableStorage } = resourceErrorSlice.actions;
export const selectCount = (state: RootState) => state.resourceError;
export default resourceErrorSlice.reducer;
