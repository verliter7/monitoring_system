import { configureStore } from '@reduxjs/toolkit';
import resourceErrorReducer from './resourceErrorSlice';

const store = configureStore({
  reducer: {
    resourceError: resourceErrorReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export enum reducerEnum {
  RS = 'resourceError',
}
