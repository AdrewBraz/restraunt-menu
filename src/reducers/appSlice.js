// @ts-check
import { createSlice } from '@reduxjs/toolkit';

const app = createSlice({
  name: 'app',
  initialState: {
    modal: 'close', errorText: '', errorStatus: false, messageText: '', messageStatus: false,
  },
  reducers: {
    modalOpen(state, { payload }) {
      state.modal = payload;
      return state;
    },
    modalClose(state) {
      state.modal = 'close';
      return state;
    },
    addMessage(state, { payload }) {
      const { message, status } = payload;
      state.messageText = message;
      state.messageStatus = status;
      return state;
    },
    removeMessage(state) {
      state.messageText = '';
      state.messageStatus = false;
      return state;
    },
    addError(state, { payload }) {
      const { data, status } = payload;
      state.errorText = data;
      state.errorStatus = status;
      return state;
    },
    removeError(state) {
      state.errorText = '';
      state.errorStatus = false;
      return state;
    },
  },
});

export const {
  modalOpen, modalClose, addMessage, addError, removeError, removeMessage,
} = app.actions;

export default app.reducer;
