import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from "./sessionSlice";

export const store = configureStore({
  reducer: {
    sessions: sessionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
