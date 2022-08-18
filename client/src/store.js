import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { scannedQRSlicer } from './slicers/scannedQRSlicer';

const rootReducer = combineReducers({
  scannedQR: scannedQRSlicer.reducer,
});

export const store = configureStore({ reducer: rootReducer });
