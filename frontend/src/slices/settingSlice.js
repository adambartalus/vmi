import { createSlice } from '@reduxjs/toolkit';

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    mode: localStorage.getItem('mode') || 'system',
    returnTo: null,
    installEvent: null,
  },
  reducers: {
    setColorMode(state, action) {
      state.mode = action.payload;
      localStorage.setItem('mode', action.payload);
    },
    setReturnTo(state, action) {
      state.returnTo = action.payload;
    },
    setInstallEvent(state, action) {
      state.installEvent = action.payload;
    },
  },
});

export const { setColorMode, setReturnTo, setInstallEvent } = settingsSlice.actions;
export default settingsSlice.reducer;
