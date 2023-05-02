import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const snackbarMessagesSlice = createSlice({
  name: 'snackbarMessages',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.push(action.payload);
    },
    popMessage: (state) => {
      state.shift();
    },
    clearMessages: () => {
      return [];
    },
  },
});

export const { addMessage, popMessage, clearMessages } = snackbarMessagesSlice.actions;

export default snackbarMessagesSlice.reducer;
