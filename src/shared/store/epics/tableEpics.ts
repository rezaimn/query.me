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
  TablesAction,
  TablesActionTypes,
  loadedTables,
  loadingTables,
  loadingTablesFailed,
  loadedTablesMetadata,
  loadingTablesMetadata,
  loadingTablesMetadataFailed,
  loadedTable,
  loadingTable,
  loadingTableFailed, canLoadMoreTables, canLoadMoreColumnsForTable
} from '../actions/tableActions';
import {
  loadedView,
  clearView
} from '../actions/viewActions'
import { IState } from '../reducers';
import { IParams } from '../../models';
import { getTables, getTablesMetadata, getTable } from '../../services/tablesApi';
import { getView } from '../../services/viewsApi';
import {canLoadMoreSchemas, canLoadMoreTablesForSchema, loadedSchema} from '../actions/schemaActions';
import {canLoadMoreDataForInfiniteScroll} from '../../utils/canLoadMoreDataForInfiniteScroll';

const loadTablesEpic: Epic<TablesAction, TablesAction, IState> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(TablesActionTypes.LOAD_TABLES)),
    switchMap(action =>
      action.payload && action.payload.viewId ?
        // Get tables for a specific view
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
            if (action.payload.page_size) {
              params.page = action.payload.page;
              params.page_size = action.payload.page_size;
            }
            return from(getTables(params, action.payload.sort)).pipe(
              map(response => ({
                response, params
              }))
            );
          }),
          map(({ response, params }) => {
            dispatch(canLoadMoreTables(canLoadMoreDataForInfiniteScroll(response, action)));
            return loadedTables(response.result, params, action.payload.reload);
          }),
          startWith(loadingTables()),
          catchError(() => of(loadingTablesFailed()))
        ) :
        // Get all tables
        from(getTables({
          filters: action.payload.filters, page: action.payload.page,
          page_size: action.payload.page_size
        }, action.payload.sort)).pipe(
          tap(() => {
            dispatch(clearView());
          }),
          map((response: any) => {
            dispatch(canLoadMoreTables(canLoadMoreDataForInfiniteScroll(response, action)));
            return loadedTables(response.result, action.payload.filters ? {
              filters: action.payload.filters
            } : undefined, action.payload.reload);
          }),
          startWith(loadingTables()),
          catchError(() => of(loadingTablesFailed()))
        )
    )
  );

const loadTablesMetadataEpic: Epic<TablesAction, TablesAction, IState, any> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(TablesActionTypes.LOAD_TABLES_METADATA)),
    switchMap(action =>
      from(getTablesMetadata()).pipe(
        map((response: any) => loadedTablesMetadata(response)),
        startWith(loadingTablesMetadata()),
        catchError(() => of(loadingTablesMetadataFailed()))
      )
    )
  );

const loadTableEpic: Epic<TablesAction, TablesAction, IState> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(TablesActionTypes.LOAD_TABLE)),
    switchMap(action =>
      from(getTable(action.payload.id, action.payload.page, action.payload.page_size, action.payload.with_column)).pipe(
        map((response: any) => {
          if (response.result.columns.length === action.payload.page_size) {
            dispatch(canLoadMoreColumnsForTable(true));
          } else {
            dispatch(canLoadMoreColumnsForTable(false));
          }
          return loadedTable(response.result, action.payload.reload);
        }),
        startWith(loadingTable(action.payload.id)),
        catchError(() => of(loadingTableFailed()))
      )
    )
  );

export default combineEpics(loadTablesEpic, loadTablesMetadataEpic, loadTableEpic);
