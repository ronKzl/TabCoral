import { configureStore } from '@reduxjs/toolkit';
import workflowReducer from './workflowSlice';

export const store = configureStore({
  reducer: {
    workflows: workflowReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
