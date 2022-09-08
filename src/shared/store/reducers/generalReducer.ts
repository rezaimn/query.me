import { ApiStatus } from '../../models';
import { ActivitiesActionTypes, ActivitiesAction } from "../actions/activityActions";
import {GeneralActions, GeneralActionTypes} from '../actions/generalActions';

export const initialGeneralState: IGeneralState = {
  pageSize:15,
  firstPage:0
}

export interface IGeneralState {
  pageSize:number;
  firstPage:number;
}

export default function generalReducer(state: IGeneralState = initialGeneralState, action: GeneralActions): IGeneralState {

  switch (action.type) {
    case GeneralActionTypes.TABLES_PAGE_SIZE:
      return {
        ...state,
        pageSize: action.payload.pageSize
      };
    case GeneralActionTypes.TABLES_FIRST_PAGE:
    default:
      return state;
  }
}
