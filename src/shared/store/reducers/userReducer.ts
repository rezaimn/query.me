import {ApiStatus, IParams, IUser, IUsersMetadata} from '../../models';
import {UsersAction, UsersActionTypes} from '../actions/userActions';
import {removeElementFromList, updateElementInList} from "../../utils/reducers";

export const initialUserState: IUserState = {
  loadingListStatus: ApiStatus.LOADING,
  loadingStatus: ApiStatus.LOADING,
  loadingMetadataStatus: ApiStatus.LOADING,
  invitingStatus: ApiStatus.LOADED,
  savingStatus: ApiStatus.LOADED,
  removingStatus: ApiStatus.LOADED,
  users: [],
  canLoadMoreUsers: false,
  usersParams: {},
  usersMetadata: null,
  user: null,
  lastInvitedUser: null,
}

export interface IUserState {
  loadingListStatus: ApiStatus;
  loadingStatus: ApiStatus;
  loadingMetadataStatus: ApiStatus;
  invitingStatus: ApiStatus;
  savingStatus: ApiStatus;
  removingStatus: ApiStatus;
  users: IUser[];
  canLoadMoreUsers: boolean;
  usersParams: IParams | undefined;
  usersMetadata: IUsersMetadata | null;
  user: IUser | null;
  lastInvitedUser: Partial<IUser> | null;
}

export default function usersReducer(state: IUserState = initialUserState, action: UsersAction): IUserState {
  switch (action.type) {
    case UsersActionTypes.CAN_LOAD_MORE_USERS:
      return {
        ...state,
        canLoadMoreUsers: action.payload.canLoadMore
      };
    case UsersActionTypes.LOAD_USERS:
    case UsersActionTypes.LOADING_USERS:
      return {
        ...state,
        loadingListStatus: ApiStatus.LOADING
      };

    case UsersActionTypes.LOADING_USERS_FAILED:
      return {
        ...state,
        loadingListStatus: ApiStatus.FAILED
      };

    case UsersActionTypes.LOADED_USERS:
      return {
        ...state,
        loadingListStatus: ApiStatus.LOADED,
        users: action.payload.reload?action.payload.users:[...state.users,...action.payload.users],
        usersParams: action.payload.params
      };

    case UsersActionTypes.LOAD_USERS_METADATA:
    case UsersActionTypes.LOADING_USERS_METADATA:
      return {
        ...state,
        loadingMetadataStatus: ApiStatus.LOADING
      };

    case UsersActionTypes.LOADING_USERS_METADATA_FAILED:
      return {
        ...state,
        loadingMetadataStatus: ApiStatus.FAILED
      };

    case UsersActionTypes.LOADED_USERS_METADATA:
      return {
        ...state,
        loadingMetadataStatus: ApiStatus.LOADED,
        usersMetadata: action.payload.usersMetadata
      };

    case UsersActionTypes.LOAD_USER:
    case UsersActionTypes.LOADING_USER:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADING
      };

    case UsersActionTypes.LOAD_CURRENT_USER:
    case UsersActionTypes.LOADING_CURRENT_USER:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADING
      };

    case UsersActionTypes.LOADING_USER_FAILED:
      return {
        ...state,
        loadingStatus: ApiStatus.FAILED
      };

    case UsersActionTypes.LOADED_USER:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADED,
        user: action.payload.user
      };

    case UsersActionTypes.SAVE_USER:
    case UsersActionTypes.SAVING_USER:
      return {
        ...state,
        savingStatus: ApiStatus.LOADING
      };

    case UsersActionTypes.SAVING_USER_FAILED:
      return {
        ...state,
        savingStatus: ApiStatus.FAILED
      };

    case UsersActionTypes.SAVED_USER:
      const updateCurrentUser = (state.user?.uid === action.payload.user.uid);

      return {
        ...state,
        savingStatus: ApiStatus.LOADED,
        user: (
          updateCurrentUser ?
            { ...state.user, ...action.payload.user } :
            state.user
        ),
        users: state.users ? updateElementInList(state.users, action.payload.user, 'uid') : state.users
      };

    case UsersActionTypes.INVITE_USER:
    case UsersActionTypes.INVITING_USER:
      return {
        ...state,
        invitingStatus: ApiStatus.LOADING
      };

    case UsersActionTypes.INVITING_USER_FAILED:
      return {
        ...state,
        invitingStatus: ApiStatus.FAILED
      };

    case UsersActionTypes.INVITED_USER:
      const newUser = {
        ...action.payload.user,
        // these do not come from server
        username: action.payload.user.email,
        created_on_utc: new Date(),
        created_on: new Date().toISOString(),
      };

      return {
        ...state,
        invitingStatus: ApiStatus.LOADED,
        users: state.users ?
          state.users.concat(newUser) :
          [ action.payload.user ],
        lastInvitedUser: newUser
      };

    case UsersActionTypes.LAST_INVITED_USER:
      return {
        ...state,
        lastInvitedUser: action.payload
      }

    case UsersActionTypes.REMOVE_USER:
    case UsersActionTypes.REMOVING_USER:
      return {
        ...state,
        removingStatus: ApiStatus.LOADING
      };

    case UsersActionTypes.REMOVING_USER_FAILED:
      return {
        ...state,
        removingStatus: ApiStatus.FAILED
      }

    case UsersActionTypes.REMOVED_USER: {
      return {
        ...state,
        removingStatus: ApiStatus.LOADED,
        users: state.users ?
          removeElementFromList(state.users, { uid: action.payload }, 'uid') :
          state.users
      };
    }

    default:
      return state;
  }
}
