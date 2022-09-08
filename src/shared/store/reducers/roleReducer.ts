import { ApiStatus, IRole } from '../../models';
import { RolesActionTypes, RolesAction } from '../actions/roleActions';

export const initialRoleState: IRoleState = {
  loadingListStatus: ApiStatus.LOADING,
  roles: []
}
  
export interface IRoleState {
  loadingListStatus: ApiStatus;
  roles: IRole[];
}

export default function rolesReducer(state: IRoleState = initialRoleState, action: RolesAction): IRoleState {
  switch (action.type) {
    case RolesActionTypes.LOAD_ROLES:
    case RolesActionTypes.LOADING_ROLES:
      return {
        ...state,
        loadingListStatus: ApiStatus.LOADING
      };

    case RolesActionTypes.LOADING_ROLES_FAILED:
      return {
        ...state,  
        loadingListStatus: ApiStatus.FAILED
      };
  
    case RolesActionTypes.LOADED_ROLES:
      return {
        ...state,
        loadingListStatus: ApiStatus.LOADED,
        roles: action.payload.roles
      };

    default:
      return state;
  }
}
