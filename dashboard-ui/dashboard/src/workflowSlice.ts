import { createSlice } from '@reduxjs/toolkit';

const workflowSlice = createSlice({
  name: 'workflows',
  initialState: [],
  reducers: {
    setWorkflows: (_, action) => {
      return action.payload; // replace old state with new workflows
    },
  },
});

export const { setWorkflows } = workflowSlice.actions;
export default workflowSlice.reducer;