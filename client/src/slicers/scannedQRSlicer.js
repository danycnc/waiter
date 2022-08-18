import { createSlice } from '@reduxjs/toolkit';

export const scannedQRSlicer = createSlice({
  name: 'scannedQR',
  initialState: '',
  reducers: {
    populate: (state, action) => (state = action.payload),
  },
});
