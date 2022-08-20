import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JSErrorState, JSErrorChartData, JSErrorTableData, JSErrorCardData } from './type';
import type { RootState } from '../store';

const initialState: JSErrorState = {
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

export const JSErrorSlice = createSlice({
    name: 'jsError',
    initialState,
    reducers: {
        pastDaysStorage: (state, action: PayloadAction<string>) => {
            state.pastDays = action.payload;
        },
        cardStorage: (state, action: PayloadAction<JSErrorCardData>) => {
            state.card = action.payload;
        },
        chartStorage: (state, action: PayloadAction<JSErrorChartData>) => {
            state.chart = action.payload;
        },
        tableStorage: (state, action: PayloadAction<JSErrorTableData>) => {
            state.table = action.payload;
        },
    },
});

export const { pastDaysStorage, cardStorage, chartStorage, tableStorage } = JSErrorSlice.actions;
export const selectCount = (state: RootState) => state.jsError;
export default JSErrorSlice.reducer;
