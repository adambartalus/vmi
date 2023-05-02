import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { login, logout, googleLogin } from '../fetch/fetchAuth';
import { getUserData, patchUser } from '../fetch/fetchUsers';

const initialState = {
  user: null,
  fetchingUserData: true,
  loggingIn: false,
  loggingOut: false,
};

export const initializeUser = createAsyncThunk('auth/initializeUser', async () => {
  const userData = await getUserData();
  return userData;
});

export const googleLoginThunk = createAsyncThunk('auth/googleLogin', async ({ credential }) => {
  const response = await googleLogin(credential);
  const data = await response.json();
  return data;
});

export const loginThunk = createAsyncThunk('auth/login', async ({ email, password }) => {
  const response = await login(email, password);
  if (!response.ok) throw response;
  const data = await response.json();
  return data;
});

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  const response = await logout();
  if (!response.ok) throw response;
});

export const patchUserThunk = createAsyncThunk('auth/patchUser', async (userData, thunkAPI) => {
  const userId = thunkAPI.getState().auth.user.id;
  const response = await patchUser(userId, userData);
  const data = await response.json();
  return data;
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsRefreshing(state, action) {
      state.refreshing = action.payload;
    },
    setUserData(state, action) {
      state.user = action.payload;
    },
    setFetchingUserData(state, action) {
      state.fetchingUserData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(googleLoginThunk.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loggingIn = false;
    });
    builder.addCase(googleLoginThunk.pending, (state, action) => {
      state.loggingIn = true;
    });
    builder.addCase(googleLoginThunk.rejected, (state, action) => {
      state.loggingIn = false;
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loggingIn = false;
    });
    builder.addCase(loginThunk.rejected, (state) => {
      state.loggingIn = false;
    });
    builder.addCase(loginThunk.pending, (state) => {
      state.loggingIn = true;
    });
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.loggingOut = false;
      state.user = null;
    });
    builder.addCase(initializeUser.pending, state => {
      state.fetchingUserData = true
    });
    builder.addCase(initializeUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.fetchingUserData = false;
    });
    builder.addCase(initializeUser.rejected, state => {
      state.fetchingUserData = false;
    });
    builder.addCase(patchUserThunk.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(logoutThunk.pending, (state) => {
      state.loggingOut = true;
    });
  },
});
export const { addToRefreshQueue, clearRefreshQueue, setIsRefreshing, setUserData, setFetchingUserData } =
  authSlice.actions;
export default authSlice.reducer;
