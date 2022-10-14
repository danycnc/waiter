import { createSlice } from '@reduxjs/toolkit';

export const preOrdersSlicer = createSlice({
  name: 'preOrders',
  initialState: [],
  reducers: {
    populate: (state, action) => {
      const filtered = state.findIndex(
        (order) => order.product.id === action.payload.product.id
      );
      if (filtered > -1) state.splice(filtered, 1);
      state.push(action.payload);
    },
    delete: (state, action) => {
      return state.filter(
        (order) => order.product.id !== action.payload.product.id
      );
    },
    refresh: (state, action) => {
      state = action.payload;
    },
    reset: (state) => (state = []),
  },
});
