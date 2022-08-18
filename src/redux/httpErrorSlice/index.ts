import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IHttpErrorState, IHttpErrorChartData, IHttpErrorTableData, IHttpErrorCardData } from './type';
import type { RootState } from '../store';

const initialState: IHttpErrorState = {
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

export const httpErrorSlice = createSlice({
  name: 'httpError',
  initialState,
  reducers: {
    pastDaysStorage: (state, action: PayloadAction<string>) => {
      state.pastDays = action.payload;
    },
    cardStorage: (state, action: PayloadAction<IHttpErrorCardData>) => {
      state.card = action.payload;
    },
    chartStorage: (state, action: PayloadAction<IHttpErrorChartData>) => {
      state.chart = action.payload;
    },
    tableStorage: (state, action: PayloadAction<IHttpErrorTableData>) => {
      state.table = action.payload;
    },
  },
});

export const { pastDaysStorage, cardStorage, chartStorage, tableStorage } = httpErrorSlice.actions;
export const selectCount = (state: RootState) => state.httpError;
export default httpErrorSlice.reducer;
