import { ApiStatus } from '../../models';
import { ActivitiesActionTypes, ActivitiesAction } from "../actions/activityActions";

export const initialActivitiesState: IActivitiesState = {
  loadingStatus: ApiStatus.LOADING,
  results: [],
  totalResults: 0
}

export interface IActivitiesState {
  loadingStatus: ApiStatus;
  results: any;
  totalResults: number;
}

export default function activityReducer(state: IActivitiesState = initialActivitiesState, action: ActivitiesAction): IActivitiesState {

  switch (action.type) {
    case ActivitiesActionTypes.FETCH:
    case ActivitiesActionTypes.FETCHING:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADING
      };

    case ActivitiesActionTypes.FETCHED:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADED,
        results: action.payload.results,
        totalResults: action.payload.totalResults
      };

    case ActivitiesActionTypes.FETCH_FAILED:
      return {
        ...state,
        loadingStatus: ApiStatus.FAILED
      };

    default:
      return state;
  }
}
