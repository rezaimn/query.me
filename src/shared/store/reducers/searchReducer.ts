import { ApiStatus } from '../../models';
import { SearchActionTypes, SearchAction } from '../actions/searchActions';

export const initialSearchState: ISearchState = {
  loadingStatus: ApiStatus.LOADING,
  results: [],
  totalResults: 0
}
  
export interface ISearchState {
  loadingStatus: ApiStatus;
  results: any;
  totalResults: number;
}

export default function searchReducer(state: ISearchState = initialSearchState, action: SearchAction): ISearchState {
  switch (action.type) {
    case SearchActionTypes.SEARCH:
    case SearchActionTypes.SEARCHING:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADING
      };

    case SearchActionTypes.SEARCHING_FAILED:
      return {
        ...state,  
        loadingStatus: ApiStatus.FAILED
      };
  
    case SearchActionTypes.SEARCHED:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADED,
        results: action.payload.results,
        totalResults: action.payload.totalResults
      };

    default:
      return state;
  }
}
