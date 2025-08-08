/**
 * Redux store configuration with RTK Query and Redux Persist
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';
import { authApi } from './api/authApi';
import { assessmentApi } from './api/assessmentApi';
import { adminApi } from './api/adminApi';
import authSlice from './slices/authSlice';
import assessmentSlice from './slices/assessmentSlice';
import timerSlice from './slices/timerSlice';

// Redux Persist configuration for auth only
const authPersistConfig = {
  key: 'auth',
  storage,
};

// Root reducer
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice),
  assessment: assessmentSlice,
  timer: timerSlice,
  [authApi.reducerPath]: authApi.reducer,
  [assessmentApi.reducerPath]: assessmentApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
});

// Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    })
      .concat(authApi.middleware)
      .concat(assessmentApi.middleware)
      .concat(adminApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export typed hooks
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();