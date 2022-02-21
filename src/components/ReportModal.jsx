import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { useLocation } from 'react-router-dom';
import actions from '../actions';
import { listOfMonths, listOfYears, formatter } from '../../helpers';
import validationSchema from '../validationSchema';

const ReportModal = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const modal = useSelector(({ app }) => app.modal);
  const generateOnSubmit = () => async (values) => {
    const dates = {
      from: `${values.fromYear}-${values.fromMonth}`,
      to: `${values.toYear}-${values.toMonth}`,
    };
    const { report } = values
    const result = await axios.get(`/report?from=${dates.from}&to=${dates.to}&report=${report}`)
      .then(({ data }) => data)
      .catch(() => new Error('new error'));
    dispatch(actions.fetchData(result));
  };
  const closeModal = () => {
    dispatch(actions.modalReportClose());
  };

  const form = useFormik({
    onSubmit: generateOnSubmit(),
    initialValues: {
      fromMonth: '',
      fromYear: '',
      toMonth: '',
      toYear: '',
    },
    initialErrors: { fromMonth: 'is empty' },
    validationSchema,
    validateOnChange: true,
  });

  return (
    <Modal size="lg" show={modal !== 'close'} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Получение отчета</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form action="/" id="dates" className="form-inline mb-3" method="post" onSubmit={form.handleSubmit}>
          <div className="form-group align-items-end justify-content-around flex-row w-100">
            <div className="form-group mb-5 col-md-3">
              <label htmlFor="yearFrom">Начало периода</label>
              <select className="form-control" name="fromYear" id="yearFrom" onChange={form.handleChange}>
                <option value="">Выберите год</option>
                {listOfYears.map((year) => <option key={`${year}`} value={`${format(year, 'yyyy')}`}>{format(year, 'yyyy')}</option>)}
              </select>
            </div>
            <div className="form-group mb-5 col-md-3">
              <label htmlFor="monthFrom">Начало периода</label>
              <select className="form-control" name="fromMonth" id="monthFrom" onChange={form.handleChange}>
                <option value="">Выберите месяц</option>
                {listOfMonths.map((month) => <option key={`${month}`} value={`${format(month, 'MM-dd')}`}>{formatter(month)}</option>)}
              </select>
            </div>
            <div className="form-group mb-5 col-md-3">
              <label htmlFor="yearTo">Конец периода</label>
              <select className="form-control" name="toYear" id="yearTo" onChange={form.handleChange}>
                <option value="">Выберите год</option>
                {listOfYears.map((year) => <option key={`${year}`} value={`${format(year, 'yyyy')}`}>{format(year, 'yyyy')}</option>)}
              </select>
            </div>
            <div className="form-group mb-5 col-md-3">
              <label htmlFor="monthTo">Конец периода</label>
              <select className="form-control" name="toMonth" id="monthTo" onChange={form.handleChange}>
                <option value="">Выберите месяц</option>
                {listOfMonths.map((month) => <option key={`${month}`} value={`${format(month, 'MM-dd')}`}>{formatter(month)}</option>)}
              </select>
            </div>
            <div className="form-group mb-5 d-flex flex-column col-md-4">
              <label htmlFor="report">Название Отчета</label>
              <select className="form-control" name="report" id="report" onChange={form.handleChange}>
                <option value="">Выберите отчет</option>
                <option value="oms1">ОМС 1</option>
                <option value="oms2">ОМС 2</option>
                <option value="oms3">ОМС 3</option>
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

export default ReportModal;
