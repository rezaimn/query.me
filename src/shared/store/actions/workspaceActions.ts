import { Action } from 'redux';
import {
  IWorkspace,
  IFilter,
  IParamsFilter,
  ISort,
  IParams
} from '../../models';

export enum WorkspacesActionTypes {
  LOAD_WORKSPACES = 'workspaces/load',
  LOADING_WORKSPACES = 'workspaces/loading',
  LOADED_WORKSPACES = 'workspaces/loaded',
  LOADING_WORKSPACES_FAILED = 'workspaces/loading_failed',
  LOAD_WORKSPACE = 'workspace/load',
  LOADING_WORKSPACE = 'workspace/loading',
  LOADED_WORKSPACE = 'workspace/loaded',
  LOADING_WORKSPACE_FAILED = 'workspace/loading_failed',
  LOAD_CURRENT_WORKSPACE = 'workspace/load_current',
  LOADING_CURRENT_WORKSPACE = 'workspace/loading_current',
  LOADED_CURRENT_WORKSPACE = 'workspace/loaded_current',
  LOADING_CURRENT_WORKSPACE_FAILED = 'workspace/loading_current_failed',
  SAVE_WORKSPACE = 'workspace/save',
  SAVE_CURRENT_WORKSPACE = 'workspace/save_current',
  SAVING_WORKSPACE = 'workspace/saving',
  SAVING_CURRENT_WORKSPACE = 'workspace/saving_current',
  SAVED_WORKSPACE = 'workspace/saved',
  SAVING_WORKSPACE_FAILED = 'workspace/saving_failed',
  SWITCH_WORKSPACE = 'workspace/switch_workspace',
  SWITCHED_WORKSPACE = 'workspace/switched_workspace',
  SWITCHING_WORKSPACE = 'workspace/switching_workspace',
  SWITCH_WORKSPACE_ERROR = 'workspace/switch_workspace_error',
}

// Interfaces

export interface ILoadWorkspacesAction extends Action {
  type: WorkspacesActionTypes.LOAD_WORKSPACES;
  payload: {
    filters?: IParamsFilter[] | undefined;
    sort?: ISort;
  };
}

export interface ILoadingWorkspacesAction extends Action {
  type: WorkspacesActionTypes.LOADING_WORKSPACES;
}

export interface ILoadedWorkspacesAction extends Action {
  type: WorkspacesActionTypes.LOADED_WORKSPACES;
  payload: {
    workspaces: IWorkspace[],
    params: IParams | undefined;
  };
}

export interface ILoadingWorkspacesFailedAction extends Action {
  type: WorkspacesActionTypes.LOADING_WORKSPACES_FAILED;
}

export interface ILoadWorkspaceAction extends Action {
  type: WorkspacesActionTypes.LOAD_WORKSPACE;
  payload: string;
}

export interface ILoadingWorkspaceAction extends Action {
  type: WorkspacesActionTypes.LOADING_WORKSPACE;
  payload: string;
}

export interface ILoadedWorkspaceAction extends Action {
  type: WorkspacesActionTypes.LOADED_WORKSPACE;
  payload: {
    workspace: IWorkspace
  };
}

export interface ILoadingWorkspaceFailedAction extends Action {
  type: WorkspacesActionTypes.LOADING_WORKSPACE_FAILED;
}

export interface ILoadCurrentWorkspaceAction extends Action {
  type: WorkspacesActionTypes.LOAD_CURRENT_WORKSPACE;
}

export interface ILoadingCurrentWorkspaceAction extends Action {
  type: WorkspacesActionTypes.LOADING_CURRENT_WORKSPACE;
}

export interface ILoadedCurrentWorkspaceAction extends Action {
  type: WorkspacesActionTypes.LOADED_CURRENT_WORKSPACE;
}

export interface ILoadingCurrentWorkspaceFailedAction extends Action {
  type: WorkspacesActionTypes.LOADING_CURRENT_WORKSPACE_FAILED;
}

export interface ISaveWorkspaceAction extends Action {
  type: WorkspacesActionTypes.SAVE_WORKSPACE;
  payload: Partial<IWorkspace>;
}

export interface ISaveCurrentWorkspaceAction extends Action {
  type: WorkspacesActionTypes.SAVE_CURRENT_WORKSPACE;
  payload: Partial<IWorkspace>;
}

export interface ISavingWorkspaceAction extends Action {
  type: WorkspacesActionTypes.SAVING_WORKSPACE;
  payload: Partial<IWorkspace>;
}

export interface ISavingCurrentWorkspaceAction extends Action {
  type: WorkspacesActionTypes.SAVING_CURRENT_WORKSPACE;
  payload: Partial<IWorkspace>;
}

export interface ISavedWorkspaceAction extends Action {
  type: WorkspacesActionTypes.SAVED_WORKSPACE;
  payload: {
    workspace: IWorkspace
  };
}

export interface ISavingWorkspaceFailedAction extends Action {
  type: WorkspacesActionTypes.SAVING_WORKSPACE_FAILED;
}

export interface ISwitchWorkspaceAction extends Action {
  type: WorkspacesActionTypes.SWITCH_WORKSPACE;
  payload: string;
}

export interface ISwitchedWorkspaceAction extends Action {
  type: WorkspacesActionTypes.SWITCHED_WORKSPACE;
}

export interface ISwitchingWorkspaceAction extends Action {
  type: WorkspacesActionTypes.SWITCHING_WORKSPACE
}

export interface ISwitchWorkspaceErrorAction extends Action {
  type: WorkspacesActionTypes.SWITCH_WORKSPACE_ERROR;
}

// Functions

export function loadWorkspaces({
  filters, sort
}: {
  filters?: IFilter[];
  sort?: ISort;
}): ILoadWorkspacesAction {
  return {
    type: WorkspacesActionTypes.LOAD_WORKSPACES,
    payload: {
      filters: filters ?
        filters
          .reduce((acc: IParamsFilter[], { name, opr, value }: IFilter) => {
            if (name && opr && value ) {
              acc.push({
                col: name,
                opr, value
              });
            }
            return acc;
          }, [] as IParamsFilter[]) :
        undefined,
      sort
    }
  }
}

export function loadingWorkspaces(): ILoadingWorkspacesAction {
  return {
    type: WorkspacesActionTypes.LOADING_WORKSPACES
  }
}

export function loadedWorkspaces(workspaces: IWorkspace[], params: IParams | undefined, sort?: ISort): ILoadedWorkspacesAction {
  return {
    type: WorkspacesActionTypes.LOADED_WORKSPACES,
    payload: {
      workspaces,
      params
    }
  }
}

export function loadingWorkspacesFailed(): ILoadingWorkspacesFailedAction {
  return {
    type: WorkspacesActionTypes.LOADING_WORKSPACES_FAILED
  }
}

export function loadWorkspace(uid: string): ILoadWorkspaceAction {
  return {
    type: WorkspacesActionTypes.LOAD_WORKSPACE,
    payload: uid
  }
}

export function loadingWorkspace(uid: string): ILoadingWorkspaceAction {
  return {
    type: WorkspacesActionTypes.LOADING_WORKSPACE,
    payload: uid
  }
}

export function loadedWorkspace(workspace: IWorkspace): ILoadedWorkspaceAction {
  return {
    type: WorkspacesActionTypes.LOADED_WORKSPACE,
    payload: {
      workspace
    }
  }
}

export function loadingWorkspaceFailed(): ILoadingWorkspaceFailedAction {
  return {
    type: WorkspacesActionTypes.LOADING_WORKSPACE_FAILED
  }
}

export function loadCurrentWorkspace(): ILoadCurrentWorkspaceAction {
  return {
    type: WorkspacesActionTypes.LOAD_CURRENT_WORKSPACE
  }
}

export function loadingCurrentWorkspace(): ILoadingCurrentWorkspaceAction {
  return {
    type: WorkspacesActionTypes.LOADING_CURRENT_WORKSPACE
  }
}

export function loadedCurrentWorkspace(): ILoadedCurrentWorkspaceAction {
  return {
    type: WorkspacesActionTypes.LOADED_CURRENT_WORKSPACE
  }
}

export function loadingCurrentWorkspaceFailed(): ILoadingCurrentWorkspaceFailedAction {
  return {
    type: WorkspacesActionTypes.LOADING_CURRENT_WORKSPACE_FAILED
  }
}

export function saveWorkspace(workspace: Partial<IWorkspace>): ISaveWorkspaceAction {
  return {
    type: WorkspacesActionTypes.SAVE_WORKSPACE,
    payload: workspace
  }
}

export function saveCurrentWorkspace(workspace: Partial<IWorkspace>): ISaveCurrentWorkspaceAction {
  return {
    type: WorkspacesActionTypes.SAVE_CURRENT_WORKSPACE,
    payload: workspace
  }
}

export function savingWorkspace(workspace: Partial<IWorkspace>): ISavingWorkspaceAction {
  return {
    type: WorkspacesActionTypes.SAVING_WORKSPACE,
    payload: workspace
  }
}

export function savingCurrentWorkspace(workspace: Partial<IWorkspace>): ISavingCurrentWorkspaceAction {
  return {
    type: WorkspacesActionTypes.SAVING_CURRENT_WORKSPACE,
    payload: workspace
  }
}

export function savedWorkspace(workspace: IWorkspace): ISavedWorkspaceAction {
  return {
    type: WorkspacesActionTypes.SAVED_WORKSPACE,
    payload: {
      workspace
    }
  }
}

export function savingWorkspaceFailed(): ISavingWorkspaceFailedAction {
  return {
    type: WorkspacesActionTypes.SAVING_WORKSPACE_FAILED
  }
}

export function switchWorkspace(uid: string): ISwitchWorkspaceAction {
  return {
    type: WorkspacesActionTypes.SWITCH_WORKSPACE,
    payload: uid
  }
}

export function switchedWorkspace(): ISwitchedWorkspaceAction {
  return {
    type: WorkspacesActionTypes.SWITCHED_WORKSPACE
  }
}

export function switchingWorkspace(): ISwitchingWorkspaceAction {
  return {
    type: WorkspacesActionTypes.SWITCHING_WORKSPACE
  }
}

export function switchWorkspaceError(): ISwitchWorkspaceErrorAction {
  return {
    type: WorkspacesActionTypes.SWITCH_WORKSPACE_ERROR
  }
}

export type WorkspacesAction =
  ILoadWorkspacesAction |
  ILoadingWorkspacesAction |
  ILoadedWorkspacesAction |
  ILoadingWorkspacesFailedAction |
  ILoadWorkspaceAction |
  ILoadingWorkspaceAction |
  ILoadedWorkspaceAction |
  ILoadingWorkspaceFailedAction |
  ILoadCurrentWorkspaceAction |
  ILoadingCurrentWorkspaceAction |
  ILoadedCurrentWorkspaceAction |
  ILoadingCurrentWorkspaceFailedAction |
  ISaveWorkspaceAction |
  ISaveCurrentWorkspaceAction |
  ISavingWorkspaceAction |
  ISavingCurrentWorkspaceAction |
  ISavedWorkspaceAction |
  ISavingWorkspaceFailedAction |
  ISwitchWorkspaceAction |
  ISwitchingWorkspaceAction |
  ISwitchedWorkspaceAction |
  ISwitchWorkspaceErrorAction;
