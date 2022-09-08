import { IQueriesMetadata, ApiStatus, IParams, IQuery, ITagParent } from '../../models';
import { QueriesActionTypes, QueriesAction } from '../actions/queryActions';
import { TagsActionTypes, TagsAction } from '../actions/tagActions';
import { removeElementFromList, updateElementInList } from '../../utils/list';

export const initialQueryState: IQueryState = {
  loadingListStatus: ApiStatus.LOADING,
  loadingMetadataStatus: ApiStatus.LOADING,
  loadingStatus: ApiStatus.LOADING,
  addingStatus: ApiStatus.LOADED,
  queries: [],
  queriesParams: {},
  queriesMetadata: null,
  query: null
}
  
export interface IQueryState {
  loadingStatus: ApiStatus;
  loadingListStatus: ApiStatus;
  loadingMetadataStatus: ApiStatus;
  addingStatus: ApiStatus;
  queries: IQuery[];
  queriesParams: IParams | undefined;
  queriesMetadata: IQueriesMetadata | null;
  query: IQuery | null;
}

function getQueryFromTag(state: IQueryState, { parent }: { parent: ITagParent }) {
  if (parent.objectType !== 'saved_query') {
    return null;
  }

  return state.queries.find(q => q.id === parent.objectId);
}

export default function queriesReducer(state: IQueryState = initialQueryState, action: QueriesAction | TagsAction): IQueryState {
  switch (action.type) {
    case QueriesActionTypes.LOAD_QUERIES:
    case QueriesActionTypes.LOADING_QUERIES:
      return {
        ...state,
        loadingListStatus: ApiStatus.LOADING
      };

    case QueriesActionTypes.LOADING_QUERIES_FAILED:
      return {
        ...state,  
        loadingListStatus: ApiStatus.FAILED
      };
  
    case QueriesActionTypes.LOADED_QUERIES:
      return {
        ...state,
        loadingListStatus: ApiStatus.LOADED,
        queries: action.payload.queries,
        queriesParams: action.payload.params
      };

    case QueriesActionTypes.LOAD_QUERIES_METADATA:
    case QueriesActionTypes.LOADING_QUERIES_METADATA:
      return {
        ...state,
        loadingMetadataStatus: ApiStatus.LOADING
      };

    case QueriesActionTypes.LOADING_QUERIES_METADATA_FAILED:
      return {
        ...state,  
        loadingMetadataStatus: ApiStatus.FAILED
      };
  
    case QueriesActionTypes.LOADED_QUERIES_METADATA:
      return {
        ...state,
        loadingMetadataStatus: ApiStatus.LOADED,
        queriesMetadata: action.payload.queriesMetadata
      };

    case QueriesActionTypes.LOAD_QUERY:
    case QueriesActionTypes.LOADING_QUERY:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADING,
        query: null
      };

    case QueriesActionTypes.LOADING_QUERY_FAILED:
      return {
        ...state,  
        loadingStatus: ApiStatus.FAILED
      };
  
    case QueriesActionTypes.LOADED_QUERY:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADED,
        query: action.payload.query
      };

    case TagsActionTypes.CREATED_TAG:
      const queryForTagCreation = getQueryFromTag(state, action.payload);
      if (!queryForTagCreation) {
        return state;
      }
      const { tag } = action.payload;
      return {
        ...state,
        queries: updateElementInList(state.queries, {
          ...queryForTagCreation,
          tags: queryForTagCreation.tags ? queryForTagCreation.tags.concat([ tag ]) : [ tag ]
        })
      };

    case TagsActionTypes.REMOVED_TAG:
      const queryForTagDeletion = getQueryFromTag(state, action.payload);
      if (!queryForTagDeletion) {
        return state;
      }
      const { uid } = action.payload;
      return {
        ...state,
        queries: updateElementInList(state.queries, {
          ...queryForTagDeletion,
          tags: queryForTagDeletion.tags ?
            removeElementFromList(queryForTagDeletion.tags, { uid }, 'uid') :
            [ ]
        })
      };

    default:
      return state;
  }
}
