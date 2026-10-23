import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import productsReducer from '../features/products/productsSlice';
import cartReducer from '../features/cart/cartSlice';

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
});

const persistedReducer = persistReducer(
  {
    key: 'shopkart',
    storage,
    whitelist: ['cart'],
  },
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
});

export const persistor = persistStore(store);