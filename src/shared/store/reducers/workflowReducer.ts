import {ApiStatus, IWorkflow} from '../../models';
import {WorkflowsAction, WorkflowsActionTypes} from '../actions/workflowActions';

export const initialWorkflowState: IWorkflowState = {
  loadingListStatus: null,
  loadingStatus: null,
  savingStatus: ApiStatus.LOADED,
  workflows: [],
  workflow: null
}

export interface IWorkflowState {
  loadingListStatus: ApiStatus | null;
  loadingStatus: ApiStatus | null;
  savingStatus: ApiStatus;
  workflows: IWorkflow[];
  workflow: IWorkflow | null;
}

export default function workflowsReducer(
  state: IWorkflowState = initialWorkflowState,
  action: WorkflowsAction
): IWorkflowState {

  switch (action.type) {
    case WorkflowsActionTypes.LOAD_WORKFLOWS:
    case WorkflowsActionTypes.LOADING_WORKFLOWS:
      return {
        ...state,
        loadingListStatus: ApiStatus.LOADING
      };

    case WorkflowsActionTypes.LOADING_WORKFLOWS_FAILED:
      return {
        ...state,
        loadingListStatus: ApiStatus.FAILED
      };

    case WorkflowsActionTypes.LOADED_WORKFLOWS:
      return {
        ...state,
        loadingListStatus: ApiStatus.LOADED,
        workflows: action.payload.workflows,
      };

    case WorkflowsActionTypes.LOAD_WORKFLOW:
    case WorkflowsActionTypes.LOADING_WORKFLOW:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADING
      };

    case WorkflowsActionTypes.LOADING_WORKFLOW_FAILED:
      return {
        ...state,
        loadingStatus: ApiStatus.FAILED
      };

    case WorkflowsActionTypes.LOADED_WORKFLOW:
      const workflowInWorkflows = state.workflows
        .find((workflow: IWorkflow) => workflow.uid === action.payload.workflow.uid)

      const newWorkflows = [
        ...state.workflows.map((workflow: IWorkflow) => {
          return {
            ...workflow
          }
        })
      ];

      if (!workflowInWorkflows) {
        newWorkflows.push({
          ...action.payload.workflow
        });
      }

      return {
        ...state,
        loadingStatus: ApiStatus.LOADED,
        workflows: newWorkflows
      };

    case WorkflowsActionTypes.UNSET_WORKFLOWS:
      return {
        ...state,
        loadingListStatus: null,
        workflows: [],
      };

    case WorkflowsActionTypes.SAVE_WORKFLOW:
    case WorkflowsActionTypes.UPDATE_WORKFLOW:
      return {
        ...state,
        savingStatus: ApiStatus.LOADING,
      };

    case WorkflowsActionTypes.SAVED_WORKFLOW:
      return {
        ...state,
        savingStatus: ApiStatus.LOADED,
      };

    case WorkflowsActionTypes.UPDATED_WORKFLOW:
      return {
        ...state,
        workflows: state.workflows.map((workflow: IWorkflow) => {
          if (action.payload.uid === workflow.uid) {
            return {
              ...workflow,
              ...action.payload,
            }
          }

          return {
            ...workflow,
          }
        }),
        savingStatus: ApiStatus.LOADED,
      }

    case WorkflowsActionTypes.SAVING_WORKFLOW_FAILED:
    case WorkflowsActionTypes.UPDATING_WORKFLOW_FAILED:
      return {
        ...state,
        savingStatus: ApiStatus.FAILED,
      };

    case WorkflowsActionTypes.REMOVED_WORKFLOW:
      return {
        ...state,
        workflows: [
          ...state.workflows.filter((workflow: IWorkflow) => workflow.uid !== action.payload)
        ]
      }

    default:
      return state;
  }
}
