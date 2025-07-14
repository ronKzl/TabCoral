import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ProfileState {
  selectedIndex: number;
}

const initialState: ProfileState = {
  selectedIndex: -1, //or 0?
};

const profileSlice = createSlice({
  name: "profileIndex",
  initialState,
  reducers: {
    setProfileIndex: (state, action: PayloadAction<number>) => {
      state.selectedIndex = action.payload;
    },
  },
});

export const { setProfileIndex } = profileSlice.actions;
export default profileSlice.reducer;
