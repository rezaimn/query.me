import { ApiStatus, IOrganization, IParams } from '../../models';
import { OrganizationsActionTypes, OrganizationsAction } from '../actions/organizationActions';

export const initialOrganizationState: IOrganizationState = {
  loadingListStatus: ApiStatus.LOADING,
  loadingStatus: ApiStatus.LOADING,
  addingStatus: ApiStatus.LOADED,
  savingStatus: ApiStatus.LOADED,
  organizations: [],
  organizationsParams: {},
  organization: null
}
  
export interface IOrganizationState {
  loadingListStatus: ApiStatus;
  loadingStatus: ApiStatus;
  addingStatus: ApiStatus;
  savingStatus: ApiStatus;
  organizations: IOrganization[];
  organizationsParams: IParams | undefined;
  organization: IOrganization | null;
}

export default function organizationsReducer(state: IOrganizationState = initialOrganizationState, action: OrganizationsAction): IOrganizationState {
  switch (action.type) {
    case OrganizationsActionTypes.LOAD_ORGANIZATIONS:
    case OrganizationsActionTypes.LOADING_ORGANIZATIONS:
      return {
        ...state,
        loadingListStatus: ApiStatus.LOADING
      };

    case OrganizationsActionTypes.LOADING_ORGANIZATIONS_FAILED:
      return {
        ...state,  
        loadingListStatus: ApiStatus.FAILED
      };
  
    case OrganizationsActionTypes.LOADED_ORGANIZATIONS:
      return {
        ...state,
        loadingListStatus: ApiStatus.LOADED,
        organizations: action.payload.organizations
      };

    case OrganizationsActionTypes.LOAD_ORGANIZATION:
    case OrganizationsActionTypes.LOADING_ORGANIZATION:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADING
      };

    case OrganizationsActionTypes.LOAD_CURRENT_ORGANIZATION:
    case OrganizationsActionTypes.LOADING_CURRENT_ORGANIZATION:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADING
      };
      
    case OrganizationsActionTypes.LOADING_ORGANIZATION_FAILED:
      return {
        ...state,  
        loadingStatus: ApiStatus.FAILED
      };
      
    case OrganizationsActionTypes.LOADED_ORGANIZATION:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADED,
        organization: action.payload.organization
      };

    case OrganizationsActionTypes.SAVE_ORGANIZATION:
    case OrganizationsActionTypes.SAVING_ORGANIZATION:
      return {
        ...state,
        savingStatus: ApiStatus.LOADING
      };

    case OrganizationsActionTypes.SAVING_ORGANIZATION_FAILED:
      return {
        ...state,  
        savingStatus: ApiStatus.FAILED
      };
      
    case OrganizationsActionTypes.SAVED_ORGANIZATION:
      return {
        ...state,
        savingStatus: ApiStatus.LOADED,
        organization: {
          ...state.organization,
          ...action.payload.organization
        }
      };

    default:
      return state;
  }
}
