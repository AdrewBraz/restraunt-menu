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

const DeleteModal = () => {
  const modal = useSelector(({ app }) => app.modal);
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch(actions.modalClose());
  };

  const generateOnSubmit = () => async (values) => {
    const {
      fromYear, fromMonth, toYear, toMonth, report,
    } = values;
    const formdata = new FormData();
    formdata.append('report', report);
    formdata.append('dateFrom', `${fromYear}-${fromMonth}`);
    formdata.append('dateTo', `${toYear}-${toMonth}`);
    try {
      await axios.post('/delete_data', formdata).then(({ data }) => {
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
    <Modal size="lg" show={modal === 'open delete'} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Удаление данных</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form action="/delete_data" encType="multipart/form-data" method="post" className="form-inline mb-3" onSubmit={form.handleSubmit}>
          <div className="input-group mt-3 flex-row w-100">
          <div className="form-group col-md-2">
            <label htmlFor="yearFrom">Начало периода</label>
            <select className="form-control" name="fromYear" id="yearFrom" onChange={form.handleChange}>
              <option value="">Выберите год</option>
              {listOfYears.map((year) => <option key={`${year}`} value={`${format(year, 'yyyy')}`}>{format(year, 'yyyy')}</option>)}
            </select>
          </div>
          <div className="form-group col-md-2">
            <label htmlFor="monthFrom">Начало периода</label>
            <select className="form-control" name="fromMonth" id="monthFrom" onChange={form.handleChange}>
              <option value="">Выберите месяц</option>
              {listOfMonths.map((month) => <option key={`${month}`} value={`${format(month, 'MM-dd')}`}>{formatter(month)}</option>)}
            </select>
          </div>
          <div className="form-group col-md-2">
            <label htmlFor="yearTo">Конец периода</label>
            <select className="form-control" name="toYear" id="yearTo" onChange={form.handleChange}>
              <option value="">Выберите год</option>
              {listOfYears.map((year) => <option key={`${year}`} value={`${format(year, 'yyyy')}`}>{format(year, 'yyyy')}</option>)}
            </select>
          </div>
          <div className="form-group col-md-2">
            <label htmlFor="monthTo">Конец периода</label>
            <select className="form-control" name="toMonth" id="monthTo" onChange={form.handleChange}>
              <option value="">Выберите месяц</option>
              {listOfMonths.map((month) => <option key={`${month}`} value={`${format(month, 'MM-dd')}`}>{formatter(month)}</option>)}
            </select>
          </div>
            <div className="form-group d-flex flex-column col-md-2">
              <label htmlFor="report">Название Отчета</label>
              <select className="form-control" name="report" id="report" onChange={form.handleChange}>
                <option value="">Выберите отчет</option>
                <option value="/oms1">ОМС 1</option>
                <option value="/oms2">ОМС 2</option>
                <option value="/oms3">ОМС 3</option>
              </select>
            </div>
            <div className="input-group-prepend mb-5 col-md-4">
              <button disabled={!form.isValid || form.isSubmitting} type="submit" className=" btn btn-primary btn-sm">
                {form.isSubmitting ? <Spinner animation="border" /> : 'Запрос'}
              </button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteModal;
