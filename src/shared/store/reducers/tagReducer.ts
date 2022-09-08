import { ApiStatus, ITag } from '../../models';
import { TagsActionTypes, TagsAction } from '../actions/tagActions';
import { removeElementFromList } from '../../utils/list';

export const initialTagState: ITagState = {
  loadingListStatus: ApiStatus.LOADING,
  creatingStatus: ApiStatus.LOADED,
  removingStatus: ApiStatus.LOADED,
  tags: []
}
  
export interface ITagState {
  loadingListStatus: ApiStatus;
  creatingStatus: ApiStatus;
  removingStatus: ApiStatus;
  tags: ITag[];
}

export default function tagsReducer(state: ITagState = initialTagState, action: TagsAction): ITagState {
  switch (action.type) {
    case TagsActionTypes.LOAD_TAGS:
    case TagsActionTypes.LOADING_TAGS:
      return {
        ...state,
        loadingListStatus: ApiStatus.LOADING
      };

    case TagsActionTypes.LOADING_TAGS_FAILED:
      return {
        ...state,  
        loadingListStatus: ApiStatus.FAILED
      };
  
    case TagsActionTypes.LOADED_TAGS:
      return {
        ...state,
        loadingListStatus: ApiStatus.LOADED,
        tags: action.payload.tags
      };

    case TagsActionTypes.CLEAR_TAGS:
      return {
        ...state,
        tags: []
      };

    case TagsActionTypes.CREATE_TAG:
    case TagsActionTypes.CREATING_TAG:
      return {
        ...state,
        creatingStatus: ApiStatus.LOADING
      };

    case TagsActionTypes.CREATING_TAG_FAILED:
      return {
        ...state,  
        creatingStatus: ApiStatus.FAILED
      };
  
    case TagsActionTypes.CREATED_TAG:
      return {
        ...state,
        creatingStatus: ApiStatus.LOADED,
      };

    case TagsActionTypes.REMOVE_TAG:
    case TagsActionTypes.REMOVING_TAG:
      return {
        ...state,
        removingStatus: ApiStatus.LOADING
      };

    case TagsActionTypes.REMOVING_TAG_FAILED:
      return {
        ...state,  
        removingStatus: ApiStatus.FAILED
      };
  
    case TagsActionTypes.REMOVED_TAG:
      return {
        ...state,
        removingStatus: ApiStatus.LOADED
      };

    default:
      return state;
  }
}
