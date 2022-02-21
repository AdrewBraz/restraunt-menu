// @ts-check
import React from 'react';
import { useEffect } from 'react';
import {
  Jumbotron, Container, Button, Alert,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '../../assets/lg.svg';
import AddModal from './AddModal';
import ReportModal from './ReportModal';
import actions from '../actions';

console.log(ReportModal);

const App = () => {
  const dispatch = useDispatch();
  const {
    errorText, errorStatus, messageText, messageStatus,
  } = useSelector(({ app }) => app);
  console.log(messageText);
  const openModal = () => {
    dispatch(actions.modalReportOpen());
  };

  useEffect(() => {
    if (errorStatus) {
      const timer = setTimeout(() => {
        dispatch(actions.removeError());
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [errorStatus]);
  useEffect(() => {
    if (messageStatus) {
      const timer = setTimeout(() => {
        dispatch(actions.removeMessage());
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [messageStatus]);
  return (
    <>
      <Container>
        <Jumbotron className="bg-white d-flex align-items-center flex-column p-2">
          <Link to="/">
            <Icon style={{ width: '100px', height: '100px' }} />
          </Link>
          <h1 className="text-center">Отчеты из ПУМП по принятым счетам</h1>
          <Container className="mt-5">
            <div className=" d-flex w-50 m-auto flex-row align-items-center justify-content-between">
              <Button onClick={() => { openModal(); }}>Получить отчет</Button>
              <Button onClick={() => { openModal(); }}>Добавить</Button>
            </div>
          </Container>
        </Jumbotron>
      </Container>
      <Container>
        {/* <AddModal /> */}
        <ReportModal />
        <Alert variant="danger" show={errorStatus}>{errorText}</Alert>
        <Alert variant="info" show={messageStatus}>{messageText}</Alert>
      </Container>
    </>
  );
};

export default App;
