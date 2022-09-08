import { Action } from 'redux';
import { IWorkflow, IWorkflowToSave } from '../../models';

// Types

export enum WorkflowsActionTypes {
  LOAD_WORKFLOWS = 'workflows/load',
  LOADING_WORKFLOWS = 'workflows/loading',
  LOADED_WORKFLOWS = 'workflows/loaded',
  LOADING_WORKFLOWS_FAILED = 'workflows/loading_failed',
  LOAD_WORKFLOW = 'workflow/load',
  LOADING_WORKFLOW = 'workflow/loading',
  LOADED_WORKFLOW = 'workflow/loaded',
  LOADING_WORKFLOW_FAILED = 'workflow/loading_failed',

  UNSET_WORKFLOWS = 'workflow/unset_workflows',

  SAVE_WORKFLOW = 'workflow/save',
  SAVING_WORKFLOW = 'workflow/saving',
  SAVED_WORKFLOW = 'workflow/saved',
  SAVING_WORKFLOW_FAILED = 'workflow/saving_failed',

  UPDATE_WORKFLOW = 'workflow/update',
  UPDATING_WORKFLOW = 'workflow/updating',
  UPDATED_WORKFLOW = 'workflow/updated',
  UPDATING_WORKFLOW_FAILED = 'workflow/updating_failed',

  REMOVE_WORKFLOW = 'workflow/remove',
  REMOVING_WORKFLOW = 'workflow/removing',
  REMOVED_WORKFLOW = 'workflow/removed',
  REMOVING_WORKFLOW_FAILED = 'workflow/removing_failed',

  TRIGGER_RUN_WORKFLOW = 'workflow/trigger_run',
  TRIGGERING_RUN_WORKFLOW = 'workflow/triggering_run',
  TRIGGER_RUN_WORKFLOW_SUCCESS = 'workflow/trigger_run_success',
  TRIGGER_RUN_WORKFLOW_FAILED = 'workflow/trigger_run_failed',
}

// Interfaces

export interface ILoadWorkflowsAction extends Action {
  type: WorkflowsActionTypes.LOAD_WORKFLOWS;
  payload: string;
}

export interface ILoadingWorkflowsAction extends Action {
  type: WorkflowsActionTypes.LOADING_WORKFLOWS;
}

export interface ILoadedWorkflowsAction extends Action {
  type: WorkflowsActionTypes.LOADED_WORKFLOWS;
  payload: {
    workflows: IWorkflow[];
  }
}

export interface ILoadingWorkflowsFailedAction extends Action {
  type: WorkflowsActionTypes.LOADING_WORKFLOWS_FAILED;
}

export interface ILoadWorkflowAction extends Action {
  type: WorkflowsActionTypes.LOAD_WORKFLOW;
  payload: string;
}

export interface ILoadingWorkflowAction extends Action {
  type: WorkflowsActionTypes.LOADING_WORKFLOW;
}

export interface ILoadedWorkflowAction extends Action {
  type: WorkflowsActionTypes.LOADED_WORKFLOW;
  payload: {
    workflow: IWorkflow;
  }
}

export interface ILoadingWorkflowFailedAction extends Action {
  type: WorkflowsActionTypes.LOADING_WORKFLOW_FAILED;
}

export interface IUnsetWorkflowsAction extends Action {
  type: WorkflowsActionTypes.UNSET_WORKFLOWS;
}

export interface ISaveWorkflowAction extends Action {
  type: WorkflowsActionTypes.SAVE_WORKFLOW;
  payload: IWorkflowToSave;
}

export interface ISavingWorkflowAction extends Action {
  type: WorkflowsActionTypes.SAVING_WORKFLOW;
}

export interface ISavedWorkflowAction extends Action {
  type: WorkflowsActionTypes.SAVED_WORKFLOW;
  payload: IWorkflow;
}

export interface ISavingWorkflowFailedAction extends Action {
  type: WorkflowsActionTypes.SAVING_WORKFLOW_FAILED;
}

export interface IUpdateWorkflowAction extends Action {
  type: WorkflowsActionTypes.UPDATE_WORKFLOW;
  payload: {
    uid: string;
    workflow: IWorkflowToSave;
  };
}

export interface IUpdatingWorkflowAction extends Action {
  type: WorkflowsActionTypes.UPDATING_WORKFLOW;
}

export interface IUpdatedWorkflowAction extends Action {
  type: WorkflowsActionTypes.UPDATED_WORKFLOW;
  payload: IWorkflow;
}

export interface IUpdatingWorkflowFailedAction extends Action {
  type: WorkflowsActionTypes.UPDATING_WORKFLOW_FAILED;
}

export interface IRemoveWorkflowAction extends Action {
  type: WorkflowsActionTypes.REMOVE_WORKFLOW;
  payload: string;
}

export interface IRemovingWorkflowAction extends Action {
  type: WorkflowsActionTypes.REMOVING_WORKFLOW;
}

export interface IRemovedWorkflowAction extends Action {
  type: WorkflowsActionTypes.REMOVED_WORKFLOW;
  payload: string; // uid
}

export interface IRemovingWorkflowFailedAction extends Action {
  type: WorkflowsActionTypes.REMOVING_WORKFLOW_FAILED;
}

export interface ITriggerRunWorkflowAction extends Action {
  type: WorkflowsActionTypes.TRIGGER_RUN_WORKFLOW;
  payload: string;
}

export interface ITriggeringRunWorkflowAction extends Action {
  type: WorkflowsActionTypes.TRIGGERING_RUN_WORKFLOW;
}

export interface ITriggerRunWorkflowSuccessAction extends Action {
  type: WorkflowsActionTypes.TRIGGER_RUN_WORKFLOW_SUCCESS;
  payload: string; // uid
}

export interface ITriggerRunWorkflowFailedAction extends Action {
  type: WorkflowsActionTypes.TRIGGER_RUN_WORKFLOW_FAILED;
}

// Functions

export function loadWorkflows(notebookId: string): ILoadWorkflowsAction { // load workflows for Notebook
  return {
    type: WorkflowsActionTypes.LOAD_WORKFLOWS,
    payload: notebookId,
  };
}

export function loadingWorkflows(): ILoadingWorkflowsAction {
  return {
    type: WorkflowsActionTypes.LOADING_WORKFLOWS
  }
}

export function loadedWorkflows(workflows: IWorkflow[]): ILoadedWorkflowsAction {
  return {
    type: WorkflowsActionTypes.LOADED_WORKFLOWS,
    payload: {
      workflows,
    }
  }
}

export function loadingWorkflowsFailed(): ILoadingWorkflowsFailedAction {
  return {
    type: WorkflowsActionTypes.LOADING_WORKFLOWS_FAILED
  }
}

export function loadWorkflow(uid: string): ILoadWorkflowAction {
  return {
    type: WorkflowsActionTypes.LOAD_WORKFLOW,
    payload: uid
  }
}

export function loadingWorkflow(): ILoadingWorkflowAction {
  return {
    type: WorkflowsActionTypes.LOADING_WORKFLOW,
  }
}

export function loadedWorkflow(workflow: IWorkflow): ILoadedWorkflowAction {
  return {
    type: WorkflowsActionTypes.LOADED_WORKFLOW,
    payload: {
      workflow
    }
  }
}

export function loadingWorkflowFailed(): ILoadingWorkflowFailedAction {
  return {
    type: WorkflowsActionTypes.LOADING_WORKFLOW_FAILED
  }
}

export function unsetWorkflows(): IUnsetWorkflowsAction {
  return {
    type: WorkflowsActionTypes.UNSET_WORKFLOWS,
  }
}

export function saveWorkflow(workflow: IWorkflowToSave): ISaveWorkflowAction {
  return {
    type: WorkflowsActionTypes.SAVE_WORKFLOW,
    payload: workflow,
  }
}

export function savingWorkflow(): ISavingWorkflowAction {
  return {
    type: WorkflowsActionTypes.SAVING_WORKFLOW,
  }
}

export function savedWorkflow(workflow: IWorkflow): ISavedWorkflowAction {
  return {
    type: WorkflowsActionTypes.SAVED_WORKFLOW,
    payload: workflow,
  }
}

export function savingWorkflowFailed(): ISavingWorkflowFailedAction {
  return {
    type: WorkflowsActionTypes.SAVING_WORKFLOW_FAILED,
  }
}

export function updateWorkflow(uid: string, workflow: IWorkflowToSave): IUpdateWorkflowAction {
  return {
    type: WorkflowsActionTypes.UPDATE_WORKFLOW,
    payload: {
      uid,
      workflow,
    }
  }
}

export function updatingWorkflow(): IUpdatingWorkflowAction {
  return {
    type: WorkflowsActionTypes.UPDATING_WORKFLOW,
  }
}

export function updatedWorkflow(workflow: IWorkflow): IUpdatedWorkflowAction {
  return {
    type: WorkflowsActionTypes.UPDATED_WORKFLOW,
    payload: workflow,
  }
}

export function updatingWorkflowFailed(): IUpdatingWorkflowFailedAction {
  return {
    type: WorkflowsActionTypes.UPDATING_WORKFLOW_FAILED,
  }
}

export function removeWorkflow(uid: string): IRemoveWorkflowAction {
  return {
    type: WorkflowsActionTypes.REMOVE_WORKFLOW,
    payload: uid
  }
}

export function removingWorkflow(): IRemovingWorkflowAction {
  return {
    type: WorkflowsActionTypes.REMOVING_WORKFLOW,
  }
}

export function removedWorkflow(uid: string): IRemovedWorkflowAction {
  return {
    type: WorkflowsActionTypes.REMOVED_WORKFLOW,
    payload: uid,
  }
}

export function removingWorkflowFailed(): IRemovingWorkflowFailedAction {
  return {
    type: WorkflowsActionTypes.REMOVING_WORKFLOW_FAILED,
  }
}

export function triggerRunWorkflow(uid: string): ITriggerRunWorkflowAction {
  return {
    type: WorkflowsActionTypes.TRIGGER_RUN_WORKFLOW,
    payload: uid
  }
}

export function triggeringRunWorkflow(): ITriggeringRunWorkflowAction {
  return {
    type: WorkflowsActionTypes.TRIGGERING_RUN_WORKFLOW,
  }
}

export function triggerRunWorkflowSuccess(uid: string): ITriggerRunWorkflowSuccessAction {
  return {
    type: WorkflowsActionTypes.TRIGGER_RUN_WORKFLOW_SUCCESS,
    payload: uid,
  }
}

export function triggerRunWorkflowFailed(): ITriggerRunWorkflowFailedAction {
  return {
    type: WorkflowsActionTypes.TRIGGER_RUN_WORKFLOW_FAILED,
  }
}

export type WorkflowsAction =
  ILoadWorkflowsAction |
  ILoadingWorkflowsAction |
  ILoadedWorkflowsAction |
  ILoadingWorkflowsFailedAction |
  ILoadWorkflowAction |
  ILoadingWorkflowAction |
  ILoadedWorkflowAction |
  ILoadingWorkflowFailedAction |
  IUnsetWorkflowsAction |
  ISaveWorkflowAction |
  ISavingWorkflowAction |
  ISavedWorkflowAction |
  ISavingWorkflowFailedAction |
  IUpdateWorkflowAction |
  IUpdatingWorkflowAction |
  IUpdatedWorkflowAction |
  IUpdatingWorkflowFailedAction |
  IRemoveWorkflowAction |
  IRemovingWorkflowAction |
  IRemovedWorkflowAction |
  IRemovingWorkflowFailedAction |
  ITriggerRunWorkflowAction |
  ITriggeringRunWorkflowAction |
  ITriggerRunWorkflowSuccessAction |
  ITriggerRunWorkflowFailedAction;
