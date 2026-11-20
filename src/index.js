import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'redux-zero/react';
import PrintProvider, { NoPrint } from 'react-easy-print';

import store from './_helpers/store';
import App from './App/App';

import { Router } from 'react-router-dom';
import { history } from './_helpers/history';

render(
  <Provider store={store}>
    <PrintProvider>
      <NoPrint>
        <Router history={history}>
          <App />
        </Router>
      </NoPrint>
    </PrintProvider>
  </Provider>,
  document.getElementById('app'),
);
