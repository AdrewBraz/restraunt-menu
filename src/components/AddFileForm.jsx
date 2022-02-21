// @ts-check
import { useFormik } from 'formik';
import React from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import actions from '../actions';
import validationSchema from '../validationSchema';
import { listOfMonths, listOfYears, formatter } from '../../helpers';

const AddFileForm = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { data } = props;
  const generateOnSubmit = () => async (values) => {
    const dates = {
      from: `${values.fromYear}-${values.fromMonth}`,
      to: `${values.toYear}-${values.toMonth}`,
    };
    const result = await axios.post(`${location.pathname}`, dates)
      .then(({ data }) => data)
      .catch(() => new Error('new error'));
    dispatch(actions.fetchData(result));
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
    <>
      <form action="/" id="dates" className="form-inline mb-3" method="post" onSubmit={form.handleSubmit}>
        <div className="form-group align-items-end justify-content-around flex-row w-100">
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
          <div className="input-group-prepend col-md-2">
            <button disabled={!form.isValid || form.isSubmitting} type="submit" className=" btn btn-primary btn-sm">
              {form.isSubmitting ? <Spinner animation="border" /> : 'Запрос'}
            </button>
          </div>
          { data.length <= 0 ? null : (
            <div className="col-md-2">
              <a download href="/download" className="btn btn-success" role="button">
                <FontAwesomeIcon icon={faFileExcel} />
              </a>
            </div>
          )}
        </div>

      </form>
    </>
  );
};

export default AddFileForm;
