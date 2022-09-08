import { combineEpics, Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import {
  switchMap,
  map,
  startWith,
  catchError,
  filter,
  tap
} from 'rxjs/operators';
import { isOfType } from 'typesafe-actions';

import {
  QueriesAction,
  QueriesActionTypes,
  loadedQueries,
  loadingQueries,
  loadingQueriesFailed,
  loadedQueriesMetadata,
  loadingQueriesMetadata,
  loadingQueriesMetadataFailed,
  loadedQuery,
  loadingQuery,
  loadingQueryFailed
} from '../actions/queryActions';
import {
  loadedView,
  clearView
} from '../actions/viewActions'
import {
  selectHeaderTitle
} from '../actions/uiActions';
import { IState } from '../reducers';
import { IParams } from '../../models';
import { getQueries, getQueriesMetadata, getQuery } from '../../services/queriesApi';
import { getView } from '../../services/viewsApi';

const loadQueriesEpic: Epic<QueriesAction, QueriesAction, IState> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(QueriesActionTypes.LOAD_QUERIES)),
    switchMap(action =>
      action.payload && action.payload.viewId ?
        // Get queries for a specific view
        from(getView(action.payload.viewId)).pipe(
          switchMap(view => {
            dispatch(loadedView(view.result));  

            const viewResult = view.result;
            let params = {} as IParams;
            if (viewResult && viewResult.params) {
              params = JSON.parse(viewResult.params);
            }
            // If there are some filters, use them instead of
            // the ones from the view. It's typically for the case
            // when the filters are updated.
            if (action.payload.filters) {
              params.filters = action.payload.filters;
            }
            return from(getQueries(params, action.payload.sort)).pipe(
              map(response => ({
                response, params
              }))
            );
          }),
          map(({ response, params }) => loadedQueries(response.result, params, action.payload.sort)),
          startWith(loadingQueries()),
          catchError(() => of(loadingQueriesFailed()))
        ) : 
        // Get all queries
        from(getQueries({ filters: action.payload.filters }, action.payload.sort)).pipe(
          tap(() => {
            dispatch(clearView());
          }),
          map((response: any) => {
            return loadedQueries(response.result, action.payload.filters ? {
              filters: action.payload.filters
            } : undefined, action.payload.sort);
          }),
          startWith(loadingQueries()),
          catchError(() => of(loadingQueriesFailed()))
        )
    )
  );

const loadQueriesMetadataEpic: Epic<QueriesAction, QueriesAction, IState, any> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(QueriesActionTypes.LOAD_QUERIES_METADATA)),
    switchMap(action =>
      from(getQueriesMetadata()).pipe(
        map((response: any) => loadedQueriesMetadata(response)),
        startWith(loadingQueriesMetadata()),
        catchError(() => of(loadingQueriesMetadataFailed()))
      )
    )
  );

const loadQueryEpic: Epic<QueriesAction, QueriesAction, IState, any> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(QueriesActionTypes.LOAD_QUERY)),
    switchMap(action =>
      from(getQuery(action.payload)).pipe(
        tap((response: any) => {
          /* dispatch(selectHeaderTitle(
            response.result.label,
            action.payload
          )); */
        }),
        map((response: any) => loadedQuery(response.result)),
        startWith(loadingQuery(action.payload)),
        catchError(() => of(loadingQueryFailed()))
      )
    )
  );

export default combineEpics(loadQueriesEpic, loadQueriesMetadataEpic, loadQueryEpic);
