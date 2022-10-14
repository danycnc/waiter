import { createSlice } from '@reduxjs/toolkit';

export const OrdersSlicer = createSlice({
  name: 'orders',
  initialState: [],
  reducers: {
    // populate: (state, action) => {
    //   state.push(action.payload);
    // },
    populate: (state, action) => (state = action.payload),
    reset: (state) => (state = []),
  },
});
