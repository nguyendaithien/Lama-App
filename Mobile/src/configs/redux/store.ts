import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appReducer from '@src/features/app/appSlice';
import authReducer from '@src/features/auth/authenSlice';
import userReducer from '@src/features/user/userSlice';

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  user: userReducer
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      },
      immutableCheck: false
    })
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
