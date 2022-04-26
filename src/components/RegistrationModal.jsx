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

const RegistrationModal = () => {
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
    dispatch(actions.modalClose());
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
    <Modal size="lg" show={modal === 'open registration'} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Получение отчета</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form action="/" id="dates" className="form-inline mb-3" method="post" onSubmit={form.handleSubmit}>
          <div className="form-group align-items-end justify-content-around flex-row w-100">
          <div class="form-group mb-5 col-md-3">
            <input type="text" class="form-control" placeholder="Username" aria-label="Username" />
          </div>
          <div class="form-group mb-5 col-md-3">
            <input type="password" class="form-control" placeholder="Password" aria-label="Password"/> 
        <div className="input-group-prepend mb-5 col-md-4">
              <button disabled={!form.isValid || form.isSubmitting} type="submit" className="btn btn-primary btn-sm">
                {form.isSubmitting ? <Spinner animation="border" /> : 'Запрос'}
              </button>
            </div>
          </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default RegistrationModal;
