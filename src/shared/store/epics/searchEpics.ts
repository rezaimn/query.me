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

import {
  SearchAction,
  SearchActionTypes,
  searched,
  searching,
  searchingFailed
} from '../actions/searchActions';
import { IState } from '../reducers';
import { search } from '../../services/searchApi';

const searchEpic: Epic<SearchAction, SearchAction, IState> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(SearchActionTypes.SEARCH)),
    switchMap(action =>
      from(search(action.payload)).pipe(
        map((response: any) => {
          return searched(response.result, response.total);
        }),
        startWith(searching()),
        catchError(() => of(searchingFailed()))
      )
    )
  );

export default combineEpics(searchEpic);
