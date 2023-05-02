import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import settingReducer from './slices/settingSlice';
import snackbarReducer from './slices/snackbarMessagesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingReducer,
    snackbars: snackbarReducer,
  },
});

export default store;
