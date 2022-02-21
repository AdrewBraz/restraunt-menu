// @ts-check
import React from 'react';
import { render } from 'react-dom';
import { Route, Switch } from 'react-router-dom';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { routerMiddleware, ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import '../assets/application.scss';
import '../assets/application.css';
import App from './components/App';
import createRootReducer from './reducers';
import Oms3 from './components/Oms3';
import Oms2 from './components/Oms2';
import Oms1 from './components/Oms1';

const history = createBrowserHistory();
const middleware = [...getDefaultMiddleware(), routerMiddleware(history)];
const store = configureStore({
  reducer: createRootReducer(history),
  middleware,
});

const Root = ({ store }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
      <Switch>
        <Route exact path="/oms1" component={Oms1} />
        <Route exact path="/oms2" component={Oms2} />
        <Route exact path="/oms3" component={Oms3} />
      </Switch>
    </ConnectedRouter>
  </Provider>
);
render(<Root store={store} />, document.getElementById('main'));
