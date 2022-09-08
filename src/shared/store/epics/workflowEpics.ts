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
  Intent,
  Position,
  Toaster,
} from '@blueprintjs/core';

import {
  WorkflowsAction,
  WorkflowsActionTypes,
  loadWorkflow,
  loadedWorkflows,
  loadingWorkflows,
  loadingWorkflowsFailed,
  loadedWorkflow,
  loadingWorkflow,
  loadingWorkflowFailed,
  savingWorkflow,
  savedWorkflow,
  savingWorkflowFailed,
  updatedWorkflow,
  updatingWorkflow,
  updatingWorkflowFailed,
  removedWorkflow,
  removingWorkflow,
  removingWorkflowFailed,
  triggeringRunWorkflow,
  triggerRunWorkflowSuccess,
  triggerRunWorkflowFailed,
} from '../actions/workflowActions';
import { IState } from '../reducers';
import {
  getWorkflows,
  getWorkflow,
  saveWorkflow,
  updateWorkflow,
  removeWorkflow,
  runWorkflow,
} from '../../services/workflowsApi';

const runToaster = Toaster.create({
  className: 'run-toaster',
  position: Position.TOP
});

const loadWorkflowsEpic: Epic<WorkflowsAction, WorkflowsAction, IState> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(WorkflowsActionTypes.LOAD_WORKFLOWS)),
    switchMap(action =>
      from(getWorkflows(action.payload)).pipe(
        map((response: any) => loadedWorkflows(response.result)),
        startWith(loadingWorkflows()),
        catchError(() => of(loadingWorkflowsFailed()))
      )
    )
  );

const loadWorkflowEpic: Epic<WorkflowsAction, WorkflowsAction, IState, any> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(WorkflowsActionTypes.LOAD_WORKFLOW)),
    switchMap(action =>
      from(getWorkflow(action.payload)).pipe(
        map((response: any) => loadedWorkflow(response.result)),
        startWith(loadingWorkflow()),
        catchError(() => of(loadingWorkflowFailed()))
      )
    )
  );

const saveWorkflowEpic: Epic<WorkflowsAction, WorkflowsAction, IState, any> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(WorkflowsActionTypes.SAVE_WORKFLOW)),
    switchMap(action =>
      from(saveWorkflow(action.payload)).pipe(
        map((response: any) => {
          if (response?.result?.uid) {
            dispatch(loadWorkflow(response.result.uid));
          }

          return savedWorkflow(response.result);
        }),
        startWith(savingWorkflow()),
        catchError(() => of(savingWorkflowFailed()))
      )
    )
  );

const updateWorkflowEpic: Epic<WorkflowsAction, WorkflowsAction, IState, any> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(WorkflowsActionTypes.UPDATE_WORKFLOW)),
    switchMap(action =>
      from(updateWorkflow(action.payload.uid, action.payload.workflow)).pipe(
        map((response: any) => updatedWorkflow({
          uid: action.payload.uid,
          ...response.result,
        })),
        startWith(updatingWorkflow()),
        catchError(() => of(updatingWorkflowFailed()))
      )
    )
  );

const removeWorkflowEpic: Epic<WorkflowsAction, WorkflowsAction, IState, any> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(WorkflowsActionTypes.REMOVE_WORKFLOW)),
    switchMap(action =>
      from(removeWorkflow(action.payload)).pipe(
        map((response: any) => removedWorkflow(action.payload)),
        startWith(removingWorkflow()),
        catchError(() => of(removingWorkflowFailed()))
      )
    )
  );

const runWorkflowEpic: Epic<WorkflowsAction, WorkflowsAction, IState, any> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(WorkflowsActionTypes.TRIGGER_RUN_WORKFLOW)),
    switchMap(action =>
      from(runWorkflow(action.payload)).pipe(
        tap((response: any) => {
          runToaster.show({
            message: "Schedule is about to run.",
            intent: Intent.SUCCESS
          });
        }),
        map((response: any) => triggerRunWorkflowSuccess(action.payload)),
        startWith(triggeringRunWorkflow()),
        catchError(() => of(triggerRunWorkflowFailed()))
      )
    )
  );

export default combineEpics(
  loadWorkflowsEpic,
  loadWorkflowEpic,
  saveWorkflowEpic,
  updateWorkflowEpic,
  removeWorkflowEpic,
  runWorkflowEpic,
);
