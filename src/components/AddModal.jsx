// @ts-check
import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { Formik, useFormik } from 'formik';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { useLocation } from 'react-router-dom';
import actions from '../actions';
import { listOfMonths, listOfYears, formatter } from '../../helpers';

const AddModal = () => {
  const modal = useSelector(({ app }) => app.modal);
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch(actions.modalClose());
  };

  const generateOnSubmit = () => async (values) => {
    const {
      excel, month, year, report,
    } = values;
    const formdata = new FormData();
    formdata.append('excel', excel);
    formdata.append('date', `${year}-${month}`);
    formdata.append('report', report);
    try {
      await axios.post('/parse', formdata).then(({ data }) => {
        console.log(data);
        dispatch(actions.addMessage(data));
        console.log('success');
      });
    } catch (e) {
      const { data } = e.response;
      const status = true;
      dispatch(actions.addError({ data, status }));
    }
    dispatch(actions.modalClose());
  };

  const form = useFormik({
    onSubmit: generateOnSubmit(),
    initialValues: {},
    validateOnBlur: false,
  });

  return (
    <Modal size="lg" show={modal === 'open add'} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Добавление отчета в базу данных</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form action="/parse" encType="multipart/form-data" method="post" className="form-inline mb-3" onSubmit={form.handleSubmit}>
          <div className="input-group d-flex justify-content-between custom-file flex-row w-100">
            <input type="file" id="customFile" name="excel" placeholder="file" onChange={({ currentTarget }) => { form.setFieldValue('excel', currentTarget.files[0]); }} className="custom-file-input col-10" />
            <label className="custom-file-label col-10" htmlFor="customFile">Choose file</label>
            <button type="submit" disabled={form.isValidating || form.isSubmitting} className=" btn btn-primary btn-sm">
              {form.isSubmitting ? <Spinner animation="border" /> : 'Добавить файл'}
            </button>
          </div>
          <div className="input-group mt-3 flex-row w-100">
            <div className="form-group d-flex flex-column col-md-4">
              <label htmlFor="year">Год</label>
              <select className="form-control" name="year" id="year" onChange={form.handleChange}>
                <option value="">Выберите год</option>
                {listOfYears.map((year) => <option key={`${year}`} value={`${format(year, 'yyyy')}`}>{format(year, 'yyyy')}</option>)}
              </select>
            </div>
            <div className="form-group d-flex flex-column col-md-4">
              <label htmlFor="month">Месяц</label>
              <select className="form-control" name="month" id="month" onChange={form.handleChange}>
                <option value="">Выберите месяц</option>
                {listOfMonths.map((month) => <option key={`${month}`} value={`${format(month, 'MM-dd')}`}>{formatter(month)}</option>)}
              </select>
            </div>
            <div className="form-group d-flex flex-column col-md-4">
              <label htmlFor="report">Название Отчета</label>
              <select className="form-control" name="report" id="report" onChange={form.handleChange}>
                <option value="">Выберите отчет</option>
                <option value="/oms1">ОМС 1</option>
                <option value="/oms2">ОМС 2</option>
                <option value="/oms3">ОМС 3</option>
              </select>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddModal;
