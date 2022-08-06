import { configureStore } from '@reduxjs/toolkit';
import chartReducer from './chartSlice';
import tableReducer from './tableSlice';

const store = configureStore({
  reducer: {
    chart: chartReducer,
    table: tableReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
