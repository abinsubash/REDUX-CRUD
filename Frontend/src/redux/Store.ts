import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './Authslice';
import adminReducer from './Adminslice';

const rootReducer = combineReducers({
  auth: authReducer,
  admin: adminReducer,
});

// Persist Config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'admin'], // ✅ Persist both auth and admin states
};

// Apply persistReducer to the combined reducers
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer, // ✅ Use persistedReducer directly
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

export const persistor = persistStore(store);

// Export type definitions
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
