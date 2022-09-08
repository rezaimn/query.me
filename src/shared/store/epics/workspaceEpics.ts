import { combineEpics, Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import {
  switchMap,
  map,
  startWith,
  catchError,
  filter,
  tap,
} from 'rxjs/operators';
import { isOfType } from 'typesafe-actions';
import { Toaster, Intent, Position } from '@blueprintjs/core';

import {
  WorkspacesAction,
  WorkspacesActionTypes,
  loadedWorkspaces,
  loadingWorkspaces,
  loadingWorkspacesFailed,
  loadedWorkspace,
  loadingWorkspace,
  loadingCurrentWorkspace,
  loadingWorkspaceFailed,
  savedWorkspace,
  savingWorkspace,
  savingCurrentWorkspace,
  savingWorkspaceFailed,
  switchedWorkspace,
  switchingWorkspace,
  switchWorkspaceError
} from '../actions/workspaceActions';
import { IState } from '../reducers';
import {
  getWorkspaces,
  getWorkspace,
  getCurrentWorkspace,
  saveWorkspace,
  saveCurrentWorkspace,
  switchWorkspace,
} from '../../services/workspacesApi';

const switchWorkspaceToaster = Toaster.create({
  position: Position.TOP
});

const loadWorkspacesEpic: Epic<WorkspacesAction, WorkspacesAction, IState> = (
  action$,
  state$
) =>
  action$.pipe(
    filter(isOfType(WorkspacesActionTypes.LOAD_WORKSPACES)),
    switchMap(action =>
      from(getWorkspaces({ filters: action.payload.filters }, action.payload.sort)).pipe(
        map((response: any) => {
          return loadedWorkspaces(response.result, action.payload.filters ? {
            filters: action.payload.filters
          } : undefined);
        }),
        startWith(loadingWorkspaces()),
        catchError(() => of(loadingWorkspacesFailed()))
      )
    )
  );

const loadWorkspaceEpic: Epic<WorkspacesAction, WorkspacesAction, IState> = (
  action$,
  state$
) =>
  action$.pipe(
    filter(isOfType(WorkspacesActionTypes.LOAD_WORKSPACE)),
    switchMap(action =>
      from(getWorkspace(action.payload)).pipe(
        map((response: any) => loadedWorkspace(response.result)),
        startWith(loadingWorkspace(action.payload)),
        catchError(() => of(loadingWorkspaceFailed()))
      )
    )
  );

const loadCurrentWorkspaceEpic: Epic<WorkspacesAction, WorkspacesAction, IState> = (
  action$,
  state$
) =>
  action$.pipe(
    filter(isOfType(WorkspacesActionTypes.LOAD_CURRENT_WORKSPACE)),
    switchMap(action =>
      from(getCurrentWorkspace()).pipe(
        map((response: any) => loadedWorkspace(response)),
        startWith(loadingCurrentWorkspace()),
        catchError(() => of(loadingWorkspaceFailed()))
      )
    )
  );

const saveWorkspaceEpic: Epic<WorkspacesAction, WorkspacesAction, IState> = (
  action$,
  state$
) =>
  action$.pipe(
    filter(isOfType(WorkspacesActionTypes.SAVE_WORKSPACE)),
    switchMap(action =>
      from(saveWorkspace(action.payload)).pipe(
        map((response: any) => savedWorkspace(response.result)),
        startWith(savingWorkspace(action.payload)),
        catchError(() => of(savingWorkspaceFailed()))
      )
    )
  );

const saveCurrentWorkspaceEpic: Epic<WorkspacesAction, WorkspacesAction, IState> = (
  action$,
  state$
) =>
  action$.pipe(
    filter(isOfType(WorkspacesActionTypes.SAVE_CURRENT_WORKSPACE)),
    switchMap(action =>
      from(saveCurrentWorkspace(action.payload)).pipe(
        map((response: any) => savedWorkspace(response.result)),
        startWith(savingCurrentWorkspace(action.payload)),
        catchError(() => of(savingWorkspaceFailed()))
      )
    )
  );

const switchWorkspaceEpic: Epic<WorkspacesAction, WorkspacesAction, IState> = (
  action$,
  state$
) =>
  action$.pipe(
    filter(isOfType(WorkspacesActionTypes.SWITCH_WORKSPACE)),
    switchMap(action =>
      from(switchWorkspace(action.payload)).pipe(
        tap((response: any) => {
          switchWorkspaceToaster.show({
            message: "Workspace changed.",
            intent: Intent.SUCCESS
          });
        }),
        map((response: any) => switchedWorkspace()),
        startWith(switchingWorkspace()),
        catchError(() => {
          switchWorkspaceToaster.show({
            message: "Couldn't change workspace.",
            intent: Intent.DANGER
          });

          return of(switchWorkspaceError());
        })
      )
    )
  )

export default combineEpics(
  loadWorkspacesEpic,
  loadWorkspaceEpic,
  loadCurrentWorkspaceEpic,
  saveWorkspaceEpic,
  saveCurrentWorkspaceEpic,
  switchWorkspaceEpic
);
