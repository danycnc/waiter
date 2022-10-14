import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { OrdersSlicer } from './slicers/orderSlicer';
import { preOrdersSlicer } from './slicers/preOrdersSlicer';
import { scannedQRSlicer } from './slicers/scannedQRSlicer';
import { tableIDSlicer } from './slicers/tableIDSlicer';

const rootReducer = combineReducers({
  orders: OrdersSlicer.reducer,
  preOrders: preOrdersSlicer.reducer,
  scannedQR: scannedQRSlicer.reducer,
  tableIDSlicer: tableIDSlicer.reducer,
});

export const store = configureStore({ reducer: rootReducer });

// store.subscribe(() => {
//   const state = store.getState();
//   console.log(state.preOrders);
//   console.log(`Confirmed orders:`, state.orders);
// });
