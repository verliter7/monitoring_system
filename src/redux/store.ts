import { configureStore } from '@reduxjs/toolkit';
import resourceErrorReducer from './resourceErrorSlice';
import httpMonitorSlice from './httpMonitorSlice';

const store = configureStore({
  reducer: {
    resourceError: resourceErrorReducer,
    httpMonitor: httpMonitorSlice,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export enum reducerEnum {
  RE = 'resourceError',
}
