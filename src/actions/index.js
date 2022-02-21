// @ts-check
import { fetchData, selectDepartment } from '../reducers/storeSlice';
import {
  modalReportOpen, modalReportClose, addMessage, addError, removeError, removeMessage,
} from '../reducers/appSlice';

export default {
  fetchData,
  modalReportOpen,
  modalReportClose,
  addMessage,
  addError,
  removeError,
  removeMessage,
  selectDepartment,
};
