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
  DataTreeTypes,
  DataTreeAction,
  loading,
  loaded,
  loadingFailed,
  refreshingDatabase,
  refreshedDatabase,
  refreshingDatabaseFailed, loadingSelectStarData, loadingSelectStarDataFiled, loadedSelectStarData,
} from '../actions/dataTreeActions';
import { IState } from "../reducers";
import { getDataTree, refreshDatabaseMetadata, selectStar } from '../../services/dataTreeApi';
import { DatabasesAction, } from '../actions/databaseActions';


const loadDataTreeEpic: Epic<DataTreeAction, DataTreeAction, IState> = (
  action$,
  state$,
) =>
  action$.pipe(
    filter(isOfType(DataTreeTypes.LOAD_DATA_TREE)),
    switchMap(action =>
      from(getDataTree()).pipe(
        map((response: any) => loaded(response.result)),
        startWith(loading()),
        catchError(() => of(loadingFailed()))
      )
    )
  );

const notificationIntent = Toaster.create({
  className: 'notification-toaster',
  position: Position.TOP
});

const refreshDatabaseEpic: Epic<DataTreeAction, DataTreeAction, IState> = (
  action$,
  state$,
) =>
  action$.pipe(
    filter(isOfType(DataTreeTypes.REFRESH_DATABASE)),
    switchMap(action =>
      from(refreshDatabaseMetadata(action.payload)).pipe(
        tap(() => {
          notificationIntent.show({
            message: "Refreshing database metadata.",
            intent: Intent.SUCCESS
          });
        }),
        map((response: any) => refreshedDatabase()),
        startWith(refreshingDatabase()),
        catchError((error: any) => {
          const message = error.response?.data?.message || "";
          notificationIntent.show({
            message: `Warning: ${message}`,
            intent: Intent.WARNING
          });

          return of(refreshingDatabaseFailed())
        })
      )
    )
  );

const selectStarEpic: Epic<DataTreeAction, DataTreeAction, IState, any> = (
  action$,
  state$,
  { dispatch },
) =>
  action$.pipe(
    filter(isOfType(DataTreeTypes.LOAD_SELECT_STAR)),
    switchMap(action =>
      from(selectStar(action.payload.database, action.payload.schema, action.payload.table)).pipe(
        map((response: any) => loadedSelectStarData(response.result)),
        startWith(loadingSelectStarData()),
        catchError(() => of(loadingSelectStarDataFiled()))
      ),
    ),
  );

export default combineEpics(
  loadDataTreeEpic,
  refreshDatabaseEpic,
  selectStarEpic
);
