import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { Provider } from 'react-redux';

import './index.scss';
import AppContainer from './AppContainer';
import * as serviceWorker from './serviceWorker';
import store from './shared/store';

Sentry.init({
  dsn: "https://acaf4c51b89b4a889d26cb7d5c3d2d0a@o959987.ingest.sentry.io/5942855",
  integrations: [new Integrations.BrowserTracing()],

  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.6 : 1.0,
});

const csrf_for_test = process.env.REACT_APP_CSRF_TOKEN_FOR_TESTING;
const access_token_for_test = process.env.REACT_APP_ACCESS_TOKEN_FOR_TESTING;

ReactDOM.render(
  <React.StrictMode>
     {
       csrf_for_test && (
         <input
           type="hidden"
           name="csrf_token"
           id="csrf_token"
           value={csrf_for_test}
         />
       )
     }
     {
       access_token_for_test && (
         <input
           type="hidden"
           name="access_token"
           id="access_token"
           value={access_token_for_test}
         />
       )
     }
    <Provider store={store}>
      <AppContainer />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
