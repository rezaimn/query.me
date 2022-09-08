import { applyMiddleware, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';

import { rootEpic } from './epics';
import { IState } from './reducers';
import { AppActions } from './actions';
import rootReducer, { initialState } from './reducers';

export const history = createBrowserHistory();

const epicMiddleware = createEpicMiddleware<AppActions, AppActions, IState, any>({
  dependencies: {
    get dispatch() {
      return store.dispatch;
    }
  }
});


const composeEnhancer = composeWithDevTools({
  name: 'query.me'
});

const store = createStore(
  rootReducer(history),
  initialState,
  composeEnhancer(applyMiddleware(routerMiddleware(history), epicMiddleware))
);

epicMiddleware.run(rootEpic);

export default store;
