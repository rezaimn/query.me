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
  SchemasAction,
  SchemasActionTypes,
  loadedSchemas,
  loadingSchemas,
  loadingSchemasFailed,
  loadedSchemasMetadata,
  loadingSchemasMetadata,
  loadingSchemasMetadataFailed,
  loadedSchema,
  loadingSchema,
  loadingSchemaFailed, canLoadMoreSchemas, canLoadMoreTablesForSchema
} from '../actions/schemaActions';
import {
  loadedView,
  clearView
} from '../actions/viewActions'
import { IState } from '../reducers';
import { IParams } from '../../models';
import { getSchemas, getSchemasMetadata, getSchema } from '../../services/schemasApi';
import { getView } from '../../services/viewsApi';
import {canLoadMoreDatabases} from '../actions/databaseActions';
import {canLoadMoreDataForInfiniteScroll} from '../../utils/canLoadMoreDataForInfiniteScroll';

const loadSchemasEpic: Epic<SchemasAction, SchemasAction, IState> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(SchemasActionTypes.LOAD_SCHEMAS)),
    switchMap(action =>
      action.payload && action.payload.viewId ?
        // Get schemas for a specific view
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
            return from(getSchemas(params,action.payload.sort)).pipe(
              map(response => ({
                response, params
              }))
            );
          }),
          map(({ response, params }) => {
            dispatch(canLoadMoreSchemas(canLoadMoreDataForInfiniteScroll(response, action)));
            return loadedSchemas(response.result, params, action.payload.reload);
          }),
          startWith(loadingSchemas()),
          catchError(() => of(loadingSchemasFailed()))
        ) :
        // Get all schemas
        from(getSchemas({
          filters: action.payload.filters,
          page: action.payload.page,
          page_size: action.payload.page_size
        }, action.payload.sort)).pipe(
          tap(() => {
            dispatch(clearView());
          }),
          map((response: any) => {
            dispatch(canLoadMoreSchemas(canLoadMoreDataForInfiniteScroll(response, action)));
            return loadedSchemas(response.result, action.payload.filters ? {
              filters: action.payload.filters
            } : undefined,action.payload.reload);
          }),
          startWith(loadingSchemas()),
          catchError(() => of(loadingSchemasFailed()))
        )
    )
  );

const loadSchemasMetadataEpic: Epic<SchemasAction, SchemasAction, IState, any> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(SchemasActionTypes.LOAD_SCHEMAS_METADATA)),
    switchMap(action =>
      from(getSchemasMetadata()).pipe(
        map((response: any) => loadedSchemasMetadata(response)),
        startWith(loadingSchemasMetadata()),
        catchError(() => of(loadingSchemasMetadataFailed()))
      )
    )
  );

const loadSchemaEpic: Epic<SchemasAction, SchemasAction, IState> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(SchemasActionTypes.LOAD_SCHEMA)),
    switchMap(action =>
      from(getSchema(action.payload.id, action.payload.page, action.payload.page_size, action.payload.with_table)).pipe(
        map((response: any) => {
          if (response.result.tables.length === action.payload.page_size) {
            dispatch(canLoadMoreTablesForSchema(true));
          } else {
            dispatch(canLoadMoreTablesForSchema(false));
          }
          return loadedSchema(response.result, action.payload.reload);
        }),
        startWith(loadingSchema(action.payload.id)),
        catchError(() => of(loadingSchemaFailed()))
      )
    )
  );

export default combineEpics(loadSchemasEpic, loadSchemasMetadataEpic, loadSchemaEpic);
