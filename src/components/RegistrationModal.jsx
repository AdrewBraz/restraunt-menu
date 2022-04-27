import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../actions';
import registrationSchema from '../registrationSchema';

const RegistrationModal = () => {
  const dispatch = useDispatch();
  const modal = useSelector(({ app }) => app.modal);
  const generateOnSubmit = () => async (values) => {
    const { name, password } = values
    try {
      await axios.post('/registration', {name, password}).then(({ data }) => {
        console.log(data);
        dispatch(actions.addMessage(data));
        console.log('success');
      });
    } catch (e) {
      const { data } = e.response;
      const status = true;
      dispatch(actions.addError({ data, status }));
    };
    dispatch(actions.modalClose());
  };
  const closeModal = () => {
    dispatch(actions.modalClose());
  };

  const form = useFormik({
    onSubmit: generateOnSubmit(),
    initialValues: {
      name: '',
      password: '',
    },
    initialErrors: { name: '' },
    validationSchema: registrationSchema,
    validateOnChange: true,
  });


  return (
    <Modal size="lg" show={modal === 'open registration'} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Получение отчета</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form action="/registration" id="dates" encType="application/json" className="form-inline mb-3" method="post"  onSubmit={form.handleSubmit}>
          <div className="form-group align-items-end justify-content-around flex-row w-100">
          <div className="form-group mb-5 col-md-3">
            <input type="text" className="form-control" placeholder="Username" name="name" onChange={form.handleChange} value={form.values.name} aria-label="username" />
            {form.errors.name ? <span>{form.errors.name}</span> : null }
          </div>
          <div className="form-group mb-5 col-md-3">
            <input type="password" className="form-control" placeholder="Password" onChange={form.handleChange} value={form.values.password} name="password" aria-label="Password"/> 
            {form.errors.password ? <span>{form.errors.password}</span> : null }
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
