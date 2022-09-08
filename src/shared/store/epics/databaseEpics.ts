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
import { Position, Toaster, Intent } from '@blueprintjs/core';

import {
  DatabasesAction,
  DatabasesActionTypes,
  loadedDatabases,
  loadingDatabases,
  loadingDatabasesFailed,
  loadedDatabasesMetadata,
  loadingDatabasesMetadata,
  loadingDatabasesMetadataFailed,
  loadedDatabase,
  loadingDatabase,
  loadingDatabaseFailed,
  loadedDatabaseSharingSettings,
  loadingDatabaseSharingSettings,
  loadingDatabaseSharingSettingsFailed,
  loadedCurrentUserPermissions,
  loadingCurrentUserPermissions,
  loadingCurrentUserPermissionsFailed,
  creatingDatabase,
  createdDatabase,
  creatingDatabaseFailed,
  removingDatabase,
  removedDatabase,
  removingDatabaseFailed,
  editedDatabase,
  editingDatabase,
  editingDatabaseFailed,
  canLoadMoreDatabases,
  canLoadMoreSchemasForDatabase,
  sharedDatabaseWithUser,
  sharingDatabaseWithUser,
  sharingDatabaseWithUserFailed,
  sharedDatabaseWithWorkspace,
  sharingDatabaseWithWorkspace,
  sharingDatabaseWithWorkspaceFailed,
} from '../actions/databaseActions';
import {
  loadedView,
  clearView
} from '../actions/viewActions'
import { IState } from '../reducers';
import { IParams } from '../../models';
import {
  getDatabases,
  getDatabasesMetadata,
  getDatabase,
  getDatabaseSharingSettings,
  getCurrentUserPermissions,
  createDatabase,
  removeDatabase,
  editDatabase,
  shareDatabaseWithUser,
  shareDatabaseWithWorkspace,
} from '../../services/databasesApi';
import { getView } from '../../services/viewsApi';
import { IDatabase } from '../../models';
import {canLoadMoreDataForInfiniteScroll} from '../../utils/canLoadMoreDataForInfiniteScroll';

const databaseToaster = Toaster.create({
  className: 'recipe-toaster',
  position: Position.TOP
});

const loadDatabasesEpic: Epic<DatabasesAction, DatabasesAction, IState> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(DatabasesActionTypes.LOAD_DATABASES)),
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
            if (action.payload.page_size) {
              params.page = action.payload.page;
              params.page_size = action.payload.page_size;
            }
            return from(getDatabases(params, action.payload.sort)).pipe(
              map(response => ({
                response, params
              }))
            );
          }),
          map(({ response, params }) => {
            const { ids, result } = response;
            const databases = result.map((database: IDatabase, index: number) => ({
              ...database,
              uid: ids[index]
            }));
            dispatch(canLoadMoreDatabases(canLoadMoreDataForInfiniteScroll(response, action)));
            return loadedDatabases(databases, params, action.payload.reload, action.payload.sort);
          }),
          startWith(loadingDatabases()),
          catchError(() => of(loadingDatabasesFailed()))
        ) :
        // Get all queries
        from(getDatabases({
          filters: action.payload.filters,
          page: action.payload.page,
          page_size: action.payload.page_size
        }, action.payload.sort)).pipe(
          tap(() => {
            dispatch(clearView());
          }),
          map((response: any) => {
            const { ids, result } = response;
            const databases = result.map((database: IDatabase, index: number) => ({
              ...database,
              uid: ids[index]
            }));
            dispatch(canLoadMoreDatabases(canLoadMoreDataForInfiniteScroll(response, action)));
            return loadedDatabases(databases, action.payload.filters ? {
              filters: action.payload.filters
            } : undefined, action.payload.reload);
          }),
          startWith(loadingDatabases()),
          catchError(() => of(loadingDatabasesFailed()))
        )
    )
  );

const loadDatabasesMetadataEpic: Epic<DatabasesAction, DatabasesAction, IState, any> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(DatabasesActionTypes.LOAD_DATABASES_METADATA)),
    switchMap(action =>
      from(getDatabasesMetadata()).pipe(
        map((response: any) => loadedDatabasesMetadata(response)),
        startWith(loadingDatabasesMetadata()),
        catchError(() => of(loadingDatabasesMetadataFailed()))
      )
    )
  );

const loadDatabaseEpic: Epic<DatabasesAction, DatabasesAction, IState> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(DatabasesActionTypes.LOAD_DATABASE)),
    switchMap(action =>
      from(getDatabase(action.payload.uid, action.payload.page, action.payload.page_size, action.payload.with_schema)).pipe(
        map((response: any) => {
          if (response?.result?.schemas?.length === action.payload.page_size) {
            dispatch(canLoadMoreSchemasForDatabase(true));
          } else {
            dispatch(canLoadMoreSchemasForDatabase(false));
          }
          return loadedDatabase(response.result, action.payload.reload);
        }),
        startWith(loadingDatabase(action.payload.uid)),
        catchError(() => of(loadingDatabaseFailed()))
      )
    )
  );

const loadDatabaseSharingSettingsEpic: Epic<DatabasesAction, DatabasesAction, IState, any> = (
  action$,
  state$,
  {dispatch}
) =>
  action$.pipe(
    filter(isOfType(DatabasesActionTypes.LOAD_DATABASE_SHARING_SETTINGS)),
    switchMap(action =>
      from(getDatabaseSharingSettings(action.payload)).pipe(
        map((response: any) => loadedDatabaseSharingSettings(response.result)),
        startWith(loadingDatabaseSharingSettings()),
        catchError(() => of(loadingDatabaseSharingSettingsFailed()))
      )
    )
  );

const loadCurrentUserPermissionsEpic: Epic<DatabasesAction, DatabasesAction, IState, any> = (
  action$,
  state$,
  {dispatch}
) =>
  action$.pipe(
    filter(isOfType(DatabasesActionTypes.LOAD_CURRENT_USER_PERMISSIONS)),
    switchMap(action =>
      from(getCurrentUserPermissions(action.payload.uid, action.payload.userId)).pipe(
        map((response: any) => loadedCurrentUserPermissions(response.result)),
        startWith(loadingCurrentUserPermissions()),
        catchError(() => of(loadingCurrentUserPermissionsFailed()))
      )
    )
  );

const createDatabaseEpic: Epic<DatabasesAction, DatabasesAction, IState, any> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(DatabasesActionTypes.CREATE_DATABASE)),
    switchMap(action =>
      from(createDatabase(action.payload)).pipe(
        tap((response: any) => {
          databaseToaster.show({
            message: "Database successfully created.",
            intent: Intent.SUCCESS
          });
        }),
        map((response: any) => createdDatabase({
          ...response.result,
          id: response.id
        })),
        startWith(creatingDatabase(action.payload)),
        catchError((error: any) => {
          const message = error.response?.data?.message || "An error occurred while creating the database.";

          databaseToaster.show({
            message: message,
            intent: Intent.DANGER
          });
          return of(creatingDatabaseFailed());
        })
      )
    )
  );

const editDatabaseEpic: Epic<DatabasesAction, DatabasesAction, IState, any> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(DatabasesActionTypes.EDIT_DATABASE)),
    switchMap(action =>
      from(editDatabase(action.payload.uid, action.payload.database)).pipe(
        tap((response: any) => {
          databaseToaster.show({
            message: "Database connection successfully updated.",
            intent: Intent.SUCCESS
          });
        }),
        map((response: any) => editedDatabase()),
        startWith(editingDatabase()),
        catchError((error: any) => {
          const message = error.response?.data?.message || "An error occurred while updating the database.";

          databaseToaster.show({
            message: message,
            intent: Intent.DANGER
          });
          return of(editingDatabaseFailed());
        })
      )
    )
  );

const removeDatabaseEpic: Epic<DatabasesAction, DatabasesAction, IState, any> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(DatabasesActionTypes.REMOVE_DATABASE)),
    switchMap(action =>
      from(removeDatabase(action.payload)).pipe(
        tap((response: any) => {
          databaseToaster.show({
            message: "Database successfully removed.",
            intent: Intent.SUCCESS
          });
        }),
        map((response: any) => removedDatabase(action.payload)),
        startWith(removingDatabase(action.payload)),
        catchError(() => {
          databaseToaster.show({
            message: "An error occurs when removing the database.",
            intent: Intent.DANGER
          });
          return of(removingDatabaseFailed());
        })
      )
    )
  );

const shareDatabaseWithUserEpic: Epic<DatabasesAction, DatabasesAction, IState, any> = (
  action$,
  state$,
  {dispatch}
) =>
  action$.pipe(
    filter(isOfType(DatabasesActionTypes.SHARE_DATABASE_WITH_USER)),
    switchMap(action =>
      from(shareDatabaseWithUser(
        action.payload.databaseUid,
        action.payload.userUid,
        action.payload.permission)
      ).pipe(
        map((response: any) => sharedDatabaseWithUser(response.result)),
        startWith(sharingDatabaseWithUser()),
        catchError(() => of(sharingDatabaseWithUserFailed()))
      )
    )
  );

const shareDatabaseWithWorkspaceEpic: Epic<DatabasesAction, DatabasesAction, IState, any> = (
  action$,
  state$,
  {dispatch}
) =>
  action$.pipe(
    filter(isOfType(DatabasesActionTypes.SHARE_DATABASE_WITH_WORKSPACE)),
    switchMap(action =>
      from(shareDatabaseWithWorkspace(action.payload.uid, action.payload.permission)).pipe(
        map((response: any) => sharedDatabaseWithWorkspace(response.result)),
        startWith(sharingDatabaseWithWorkspace()),
        catchError(() => of(sharingDatabaseWithWorkspaceFailed()))
      )
    )
  );



export default combineEpics(
  loadDatabasesEpic,
  loadDatabasesMetadataEpic,
  loadDatabaseEpic,
  loadDatabaseSharingSettingsEpic,
  loadCurrentUserPermissionsEpic,
  createDatabaseEpic,
  editDatabaseEpic,
  removeDatabaseEpic,
  shareDatabaseWithUserEpic,
  shareDatabaseWithWorkspaceEpic
);
