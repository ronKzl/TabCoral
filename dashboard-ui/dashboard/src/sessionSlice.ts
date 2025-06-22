import { createSlice } from '@reduxjs/toolkit';

const sessionSlice = createSlice({
  name: 'sessions',
  initialState: [],
  reducers: {
    setSessions: (_, action) => {
      return action.payload; // replace old state with new state
    },
  },
});

export const { setSessions } = sessionSlice.actions;
export default sessionSlice.reducer;