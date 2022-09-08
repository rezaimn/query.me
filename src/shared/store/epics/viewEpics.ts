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
import { routerActions } from 'connected-react-router';

import {
  ViewsAction,
  ViewsActionTypes,
  loadViews,
  loadedViews,
  loadingViews,
  loadingViewsFailed,
  loadedView,
  loadingView,
  loadingViewFailed,
  createdView,
  creatingView,
  creatingViewFailed,
  savedView,
  savingView,
  savingViewFailed,
  removedView,
  removingView,
  removingViewFailed
} from '../actions/viewActions';
import {
  selectHeaderTitle
} from '../actions/uiActions';
import { IState } from '../reducers';
import { getViews, getView, createView, saveView, removeView } from '../../services/viewsApi';

const removeViewToaster = Toaster.create({
  className: 'recipe-toaster',
  position: Position.TOP
});

const loadViewsEpic: Epic<ViewsAction, ViewsAction, IState> = (
  action$,
  state$
) =>
  action$.pipe(
    filter(isOfType(ViewsActionTypes.LOAD_VIEWS)),
    switchMap(action =>
      from(getViews(action.payload)).pipe(
        map((response: any) => loadedViews(response.result)),
        startWith(loadingViews()),
        catchError(() => of(loadingViewsFailed()))
      )
    )
  );

const loadViewEpic: Epic<ViewsAction, ViewsAction, IState, any> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(ViewsActionTypes.LOAD_VIEW)),
    switchMap(action =>
      from(getView(action.payload)).pipe(
        tap((response: any) => {
          dispatch(selectHeaderTitle(response.result.label, action.payload.toString()));
        }),
        map((response: any) => {
          return loadedView(response.result);
        }),
        startWith(loadingView(action.payload)),
        catchError(() => of(loadingViewFailed()))
      )
    )
  );

const createViewEpic: Epic<ViewsAction, ViewsAction, IState, any> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(ViewsActionTypes.CREATE_VIEW)),
    switchMap(action =>
      from(createView(action.payload)).pipe(
        tap((response: any) => {
          removeViewToaster.show({
            message: "View successfully created.",
            intent: Intent.SUCCESS
          });
          const viewType = response.result.view_type.toLowerCase();
          dispatch(loadViews(viewType));
        }),
        map((response: any) => createdView(response.result)),
        startWith(creatingView(action.payload)),
        catchError(() => {
          removeViewToaster.show({
            message: "An error occurs when creating the view.",
            intent: Intent.DANGER
          });
          return of(creatingViewFailed());
        })
      )
    )
  );

const saveViewEpic: Epic<ViewsAction, ViewsAction, IState, any> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(ViewsActionTypes.SAVE_VIEW)),
    switchMap(action =>
      from(saveView(action.payload.id, action.payload.view)).pipe(
        tap(() => {
          removeViewToaster.show({
            message: "View successfully saved.",
            intent: Intent.SUCCESS
          });
        }),
        map((response: any) => savedView(response.result)),
        startWith(savingView(action.payload.id, action.payload.view)),
        catchError(() => {
          removeViewToaster.show({
            message: "An error occurs when saving the view.",
            intent: Intent.DANGER
          });
          return of(savingViewFailed());
        })
      )
    )
  );

const removeViewEpic: Epic<ViewsAction, ViewsAction, IState, any> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(ViewsActionTypes.REMOVE_VIEW)),
    switchMap(action =>
      from(removeView(action.payload)).pipe(
        tap(() => {
          removeViewToaster.show({
            message: "View successfully removed.",
            intent: Intent.SUCCESS
          });
          if (
            state$.value.views.view &&
            state$.value.views.view.id === action.payload &&
            state$.value.router
          ) {
            if (state$.value.router.location.pathname.startsWith('/q')) {
              dispatch(routerActions.push('/q'));
            } else if (state$.value.router.location.pathname.startsWith('/w')) {
              dispatch(routerActions.push('/w'));
            } else if (state$.value.router.location.pathname.startsWith('/d/d')) {
              dispatch(routerActions.push('/d/d'));
            } else if (state$.value.router.location.pathname.startsWith('/d/s')) {
              dispatch(routerActions.push('/d/s'));
            } else if (state$.value.router.location.pathname.startsWith('/d/t')) {
              dispatch(routerActions.push('/d/t'));
            }
          }
        }),
        map((response: any) => removedView(action.payload)),
        startWith(removingView(action.payload)),
        catchError(() => {
          removeViewToaster.show({
            message: "An error occurs when removing the view.",
            intent: Intent.DANGER
          });
          return of(removingViewFailed());
        })
      )
    )
  );

export default combineEpics(
  loadViewsEpic,
  loadViewEpic,
  createViewEpic,
  saveViewEpic,
  removeViewEpic
);
