// @ts-check
import React from 'react';
import { useEffect } from 'react';
import { Container, Button, Alert} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '../../assets/lg.svg';
import AddModal from './AddModal';
import ReportModal from './ReportModal';
import DeleteModal from './DeleteModal';
import RegistrationModal from './RegistrationModal'
import actions from '../actions';


const App = () => {
  const dispatch = useDispatch();
  const {
    errorText, errorStatus, messageText, messageStatus, modal
  } = useSelector(({ app }) => app);
  const openModal = (msg) => {
    dispatch(actions.modalOpen(msg));
  };
  console.log(modal)
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
        <div className="jumbotron bg-white d-flex align-items-center flex-column p-2">
          <Link to="/">
            <Icon style={{ width: '100px', height: '100px' }} />
          </Link>
          <h1 className="text-center">Отчеты из ПУМП по принятым счетам</h1>
          <Container className="mt-5">
            <div className=" d-flex w-50 m-auto flex-row align-items-center justify-content-between">
              <Button onClick={() => { openModal('open report'); }}>Получить отчет</Button>
              <Button onClick={() => { openModal('open add'); }}>Добавить</Button>
              <Button onClick={() => { openModal('open delete'); }}>Удалить</Button>
              <Button onClick={() => { openModal('open registration'); }}>Войти</Button>
            </div>
          </Container>
        </div>
      </Container>
      <Container>
        <AddModal />
        <ReportModal />
        <DeleteModal />
        <RegistrationModal />
        <Alert variant="danger" show={errorStatus}>{errorText}</Alert>
        <Alert variant="info" show={messageStatus}>{messageText}</Alert>
      </Container>
    </>
  );
};

export default App;
