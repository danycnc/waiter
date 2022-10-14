import { createSlice } from '@reduxjs/toolkit';

export const tableIDSlicer = createSlice({
  name: 'tableID',
  initialState: {},
  reducers: {
    populate: (state, action) => (state = action.payload),
    reset: (state) => (state = {}),
  },
});
