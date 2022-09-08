import { combineEpics, Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import {
  switchMap,
  map,
  startWith,
  catchError,
  filter,
} from 'rxjs/operators';
import { isOfType } from 'typesafe-actions';

import { IState } from '../reducers';
import { downloadImageFromUnsplash, unsplash, unsplashRandom, unsplashSearch } from '../../services/unsplashApi';
import {
  UnsplashAction,
  UnsplashActionTypes,
  unsplashLoaded,
  unsplashLoading,
  unsplashLoadingFailed, unsplashRandomLoaded, unsplashRandomLoading, unsplashRandomLoadingFailed,
} from '../actions/unsplashAction';
import { IUnsplash, IUnsplashImage } from '../../models/Unsplash';
import { loadedNotebook, selectNotebookPage } from '../actions/notebookActions';

const unsplashLoadEpic: Epic<UnsplashAction, UnsplashAction, IState> = (
  action$,
  state$,
  { dispatch },
) =>
  action$.pipe(
    filter(isOfType(UnsplashActionTypes.UNSPLASH_LOAD)),
    switchMap(action =>
      from(unsplash()).pipe(
        map((response: IUnsplash) => {
          return unsplashLoaded(response);
        }),
        startWith(unsplashLoading()),
        catchError(() => of(unsplashLoadingFailed())),
      ),
    ),
  );

const unsplashSearchEpic: Epic<UnsplashAction, UnsplashAction, IState> = (
  action$,
  state$,
  { dispatch },
) =>
  action$.pipe(
    filter(isOfType(UnsplashActionTypes.UNSPLASH_LOAD_SEARCH)),
    switchMap(action =>
      from(unsplashSearch(action.payload.keyword)).pipe(
        map((response: IUnsplash) => {
          return unsplashLoaded(response);
        }),
        startWith(unsplashLoading()),
        catchError(() => of(unsplashLoadingFailed())),
      ),
    ),
  );

const unsplashRandomEpic: Epic<UnsplashAction, UnsplashAction, IState> = (
  action$,
  state$,
  { dispatch },
) =>
  action$.pipe(
    filter(isOfType(UnsplashActionTypes.UNSPLASH_RANDOM_LOAD)),
    switchMap(action =>
      from(unsplashRandom()).pipe(
        map((response: IUnsplashImage) => {
          return unsplashRandomLoaded(response);
        }),
        startWith(unsplashRandomLoading()),
        catchError(() => of(unsplashRandomLoadingFailed())),
      ),
    ),
  );

export default combineEpics(unsplashLoadEpic, unsplashSearchEpic, unsplashRandomEpic);
