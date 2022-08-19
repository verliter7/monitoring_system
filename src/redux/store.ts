import { configureStore } from '@reduxjs/toolkit';
import httpErrorSlice from './httpErrorSlice';
import resourceErrorReducer from './resourceErrorSlice';
import httpMonitorSlice from './httpMonitorSlice';
import jsErrorSlice from './jsErrorSlice';

const store = configureStore({
  reducer: {
    httpError: httpErrorSlice,
    resourceError: resourceErrorReducer,
    httpMonitor: httpMonitorSlice,
    jsError: jsErrorSlice,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export enum reducerEnum {
  HE = 'httpError',
  RE = 'resourceError',
  HM = 'httpMonitor',
  JE = 'jsError',
}
