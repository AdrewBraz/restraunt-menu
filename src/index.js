import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import '../assets/css/style.styl';
import NotFound from './components/NotFound';
import App from './components/App';
import Store from './components/Store';
import reducers from './reducers';

const store = configureStore({
  reducer: reducers,
});

const Root = ({ store }) => {
  return (
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={App} />
        <Route exact path="/store/:id" component={Store} />
      </Switch>
    </BrowserRouter>
  </Provider>
)}
render(<Root store={store} />, document.getElementById('main'));