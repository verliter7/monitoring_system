import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { tableTypeEnum, ITableState, ResourceErrorData } from './type';
import type { RootState } from '../store';

const tableDefaultState = {
  records: [],
  current: 1,
  size: 0,
  total: 0,
};
const initialState: ITableState = {
  httpError: { ...tableDefaultState, type: tableTypeEnum.HP },
  jsError: { ...tableDefaultState, type: tableTypeEnum.JS },
  resourcesError: {
    ...tableDefaultState,
    type: tableTypeEnum.RS,
  },
  pageLoad: { ...tableDefaultState, type: tableTypeEnum.PL },
};

export const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    storage: (state, action: PayloadAction<ResourceErrorData>) => {
      const payload = action.payload;

      switch (payload.type) {
        case tableTypeEnum.RS:
          state.resourcesError = payload;
          break;
        default:
          break;
      }
    },
  },
});

export const { storage } = tableSlice.actions;
export const selectCount = (state: RootState) => state.table;
export default tableSlice.reducer;
