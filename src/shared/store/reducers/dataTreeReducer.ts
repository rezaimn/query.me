import {DataTreeAction, DataTreeTypes} from "../actions/dataTreeActions";
import { ApiStatus, IDatabase, INotebookPageBlockExecution } from '../../models';

export const initialDataTreeState: IDataTreeState = {
  loadingStatus: ApiStatus.LOADING,
  databases: null,
  nodes: null,
  selectStarData: null
}

export interface IDataTreeState {
  loadingStatus: ApiStatus;
  databases: IDatabase[] | null;
  selectStarData: INotebookPageBlockExecution | null;
  nodes: any;
}

export default function dataTreeReducer(
  state: IDataTreeState = initialDataTreeState,
  action: DataTreeAction): IDataTreeState {

  switch (action.type) {
    case DataTreeTypes.LOAD_DATA_TREE:
    case DataTreeTypes.LOADING_DATA_TREE:
    case DataTreeTypes.REFRESH_DATABASE:
    case DataTreeTypes.REFRESHING_DATABASE:
        return {
        ...state,
        loadingStatus: ApiStatus.LOADING
      };
    case DataTreeTypes.LOADING_DATA_TREE_FAILED:
    case DataTreeTypes.REFRESHING_DATABASE_FAILED:
        return {
        ...state,
        loadingStatus: ApiStatus.FAILED
      };
    case DataTreeTypes.LOADED_DATA_TREE:
        // this is called on init only
      return {
        ...state,
        nodes: action.payload,
        loadingStatus: ApiStatus.LOADED
      }
    case DataTreeTypes.REFRESHED_DATABASE:
      // this is called on refresh only
      return {
        ...state,
        loadingStatus: ApiStatus.LOADED
      }
    case DataTreeTypes.LOADED_SELECT_STAR:
      let data: any = JSON.parse(action.payload);
      if (data) {
        data.value = {
          data: data.data,
          selected_columns: data.selected_columns,
        };
      }
      return {
        ...state,
        selectStarData: data,
      };
    default:
      return state;
  }
};
