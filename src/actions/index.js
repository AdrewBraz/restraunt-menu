// @ts-check
import { fetchData, selectDepartment } from '../reducers/storeSlice';
import {
  modalOpen, modalClose, addMessage, addError, removeError, removeMessage,
} from '../reducers/appSlice';

export default {
  fetchData,
  modalOpen,
  modalClose,
  addMessage,
  addError,
  removeError,
  removeMessage,
  selectDepartment,
};
