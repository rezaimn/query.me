import {ApiStatus, IParams, IWorkspace} from '../../models';
import {WorkspacesAction, WorkspacesActionTypes} from "../actions/workspaceActions";


export const initialWorkspaceState: IWorkspaceState = {
  loadingListStatus: ApiStatus.LOADING,
  loadingStatus: ApiStatus.LOADING,
  addingStatus: ApiStatus.LOADED,
  savingStatus: ApiStatus.LOADED,
  workspaces: [],
  workspacesParams: {},
  workspace: null // current
}

export interface IWorkspaceState {
  loadingListStatus: ApiStatus;
  loadingStatus: ApiStatus;
  addingStatus: ApiStatus;
  savingStatus: ApiStatus;
  workspaces: IWorkspace[];
  workspacesParams: IParams | undefined;
  workspace: IWorkspace | null;
}

export default function workspacesReducer(state: IWorkspaceState = initialWorkspaceState, action: WorkspacesAction): IWorkspaceState {
  switch (action.type) {
    case WorkspacesActionTypes.LOAD_WORKSPACES:
    case WorkspacesActionTypes.LOADING_WORKSPACES:
      return {
        ...state,
        loadingListStatus: ApiStatus.LOADING
      };

    case WorkspacesActionTypes.LOADING_WORKSPACES_FAILED:
      return {
        ...state,
        loadingListStatus: ApiStatus.FAILED
      };

    case WorkspacesActionTypes.LOADED_WORKSPACES:
      return {
        ...state,
        loadingListStatus: ApiStatus.LOADED,
        workspaces: action.payload.workspaces
      };

    case WorkspacesActionTypes.LOAD_WORKSPACE:
    case WorkspacesActionTypes.LOADING_WORKSPACE:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADING
      };

    case WorkspacesActionTypes.LOAD_CURRENT_WORKSPACE:
    case WorkspacesActionTypes.LOADING_CURRENT_WORKSPACE:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADING
      };

    case WorkspacesActionTypes.LOADING_WORKSPACE_FAILED:
      return {
        ...state,
        loadingStatus: ApiStatus.FAILED
      };

    case WorkspacesActionTypes.LOADED_WORKSPACE:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADED,
        workspace: action.payload.workspace
      };

    case WorkspacesActionTypes.SAVE_WORKSPACE:
    case WorkspacesActionTypes.SAVING_WORKSPACE:
      return {
        ...state,
        savingStatus: ApiStatus.LOADING
      };

    case WorkspacesActionTypes.SAVING_WORKSPACE_FAILED:
      return {
        ...state,
        savingStatus: ApiStatus.FAILED
      };

    case WorkspacesActionTypes.SWITCHING_WORKSPACE:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADING
      };

    case WorkspacesActionTypes.SWITCH_WORKSPACE_ERROR:
      return {
        ...state,
        loadingStatus: ApiStatus.FAILED
      };

    case WorkspacesActionTypes.SWITCHED_WORKSPACE:
      setTimeout(() => window.location.reload(), 1000); // @TODO - improve

      return {
        ...state,
        loadingStatus: ApiStatus.LOADED
      }

    case WorkspacesActionTypes.SAVED_WORKSPACE:
      return {
        ...state,
        savingStatus: ApiStatus.LOADED,
        workspace: {
          ...state.workspace,
          ...action.payload.workspace
        }
      };

    default:
      return state;
  }
}
