import { combineEpics, Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import {
  switchMap,
  map,
  startWith,
  catchError,
  filter
} from 'rxjs/operators';
import { isOfType } from 'typesafe-actions';
import { IState } from '../reducers';
import {GeneralActions, GeneralActionTypes} from '../actions/generalActions';

export default combineEpics();
