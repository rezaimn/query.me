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
  getDatabaseMetadata,
} from "../../services/databasesApi";
import {
  EditorAction,
  EditorTypes,
  loadingDatabaseMetadata,
  loadedDatabaseMetadata,
  loadingDatabaseMetadataFailed
} from "../actions/editorActions";
import { IState } from '../reducers';

const loadDatabaseMetadataEpics: Epic<EditorAction, EditorAction, IState> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(EditorTypes.LOAD_DATABASE_METADATA)),
    switchMap((action: any) =>
      from(getDatabaseMetadata(action.payload)).pipe(
        map((response: any) => {
          return loadedDatabaseMetadata(response);
        }),
        startWith(loadingDatabaseMetadata(action.payload)),
        catchError(() => of(loadingDatabaseMetadataFailed()))
      )
    )
  );

export default combineEpics(
  loadDatabaseMetadataEpics,
);
