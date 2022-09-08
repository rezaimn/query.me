import { ApiStatus, IView } from '../../models';
import { ViewsActionTypes, ViewsAction } from '../actions/viewActions';
import { removeElementFromList, updateElementInList } from '../../utils/list';

export const initialViewState: IViewState = {
  loadingListStatus: ApiStatus.LOADING,
  loadingStatus: ApiStatus.LOADING,
  creatingStatus: ApiStatus.LOADED,
  savingStatus: ApiStatus.LOADED,
  removingStatus: ApiStatus.LOADED,
  views: [],
  view: null
}
  
export interface IViewState {
  loadingStatus: ApiStatus;
  loadingListStatus: ApiStatus;
  creatingStatus: ApiStatus;
  savingStatus: ApiStatus;
  removingStatus: ApiStatus;
  views: IView[];
  view: IView | null;
}

export default function viewsReducer(state: IViewState = initialViewState, action: ViewsAction): IViewState {
  switch (action.type) {
    case ViewsActionTypes.LOAD_VIEWS:
    case ViewsActionTypes.LOADING_VIEWS:
      return {
        ...state,
        loadingListStatus: ApiStatus.LOADING
      };

    case ViewsActionTypes.LOADING_VIEWS_FAILED:
      return {
        ...state,  
        loadingListStatus: ApiStatus.FAILED
      };
  
    case ViewsActionTypes.LOADED_VIEWS:
      return {
        ...state,
        loadingListStatus: ApiStatus.LOADED,
        views: action.payload.views
      };

    case ViewsActionTypes.LOAD_VIEW:
    case ViewsActionTypes.LOADING_VIEW:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADING
      };

    case ViewsActionTypes.LOADING_VIEW_FAILED:
      return {
        ...state,  
        loadingStatus: ApiStatus.FAILED
      };
  
    case ViewsActionTypes.LOADED_VIEW:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADED,
        view: action.payload.view
      };

    case ViewsActionTypes.CLEAR_VIEW:
      return {
        ...state,
        view: null
      };

    case ViewsActionTypes.CREATE_VIEW:
    case ViewsActionTypes.CREATING_VIEW:
      return {
        ...state,
        creatingStatus: ApiStatus.LOADING
      };

    case ViewsActionTypes.CREATING_VIEW_FAILED:
      return {
        ...state,  
        creatingStatus: ApiStatus.FAILED
      };
  
    case ViewsActionTypes.CREATED_VIEW:
      return {
        ...state,
        creatingStatus: ApiStatus.LOADED,
        views: state.views ?
          state.views.concat(action.payload) :
          [ action.payload ]
      };

    case ViewsActionTypes.SAVE_VIEW:
    case ViewsActionTypes.SAVING_VIEW:
      return {
        ...state,
        savingStatus: ApiStatus.LOADING
      };

    case ViewsActionTypes.SAVING_VIEW_FAILED:
      return {
        ...state,  
        savingStatus: ApiStatus.FAILED
      };

    case ViewsActionTypes.SAVED_VIEW:
      return {
        ...state,
        savingStatus: ApiStatus.LOADED,
        views: state.views ?
          updateElementInList(state.views, action.payload.view) :
          state.views
      };

    case ViewsActionTypes.REMOVE_VIEW:
    case ViewsActionTypes.REMOVING_VIEW:
      return {
        ...state,
        removingStatus: ApiStatus.LOADING
      };

    case ViewsActionTypes.REMOVING_VIEW_FAILED:
      return {
        ...state,  
        removingStatus: ApiStatus.FAILED
      };
  
    case ViewsActionTypes.REMOVED_VIEW:
      return {
        ...state,
        removingStatus: ApiStatus.LOADED,
        views: state.views ?
          removeElementFromList(state.views, { id: action.payload }) :
          state.views
      };

    default:
      return state;
  }
}
