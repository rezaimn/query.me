import { Action } from 'redux';
import {
  IUser,
  IFilter,
  IParamsFilter,
  ISort,
  IParams,
  IUsersMetadata,
} from '../../models';

export enum UsersActionTypes {
  LOAD_USERS = 'users/load',
  CAN_LOAD_MORE_USERS = 'users/can_load_more',
  LOADING_USERS = 'users/loading',
  LOADED_USERS = 'users/loaded',
  LOADING_USERS_FAILED = 'users/loading_failed',
  LOAD_USERS_METADATA = 'users/load_metadata',
  LOADING_USERS_METADATA = 'users/loading_metadata',
  LOADED_USERS_METADATA = 'users/loaded_metadata',
  LOADING_USERS_METADATA_FAILED = 'users/loading_metadata_failed',
  LOAD_USER = 'user/load',
  LOAD_CURRENT_USER = 'user/load_current',
  LOADING_USER = 'user/loading',
  LOADING_CURRENT_USER = 'user/loading_current',
  LOADED_USER = 'user/loaded',
  LOADING_USER_FAILED = 'user/loading_failed',
  INVITE_USER = 'user/invite',
  INVITING_USER = 'user/inviting',
  INVITED_USER = 'user/invited',
  INVITING_USER_FAILED = 'user/inviting_failed',
  LAST_INVITED_USER = 'user/last_invited_user',
  SAVE_USER = 'user/save',
  SAVING_USER = 'user/saving',
  SAVED_USER = 'user/saved',
  SAVING_USER_FAILED = 'user/saving_failed',
  REMOVE_USER = 'user/remove',
  REMOVING_USER = 'user/removing',
  REMOVED_USER = 'user/removed',
  REMOVING_USER_FAILED = 'user/removing_failed',
}

// Interfaces

export interface ILoadUsersAction extends Action {
  type: UsersActionTypes.LOAD_USERS;
  payload: {
    viewId: number | undefined;
    filters?: IParamsFilter[] | undefined;
    sort?: ISort;
    reload?:boolean;
    page_size?:number;
    page?:number|undefined;
  };
}

export interface ICanLoadMoreUsersAction extends Action {
  type: UsersActionTypes.CAN_LOAD_MORE_USERS;
  payload: {
    canLoadMore:boolean;
  };
}

export interface ILoadingUsersAction extends Action {
  type: UsersActionTypes.LOADING_USERS;
}

export interface ILoadedUsersAction extends Action {
  type: UsersActionTypes.LOADED_USERS;
  payload: {
    users: IUser[],
    params: IParams | undefined;
    reload?: boolean;
  };
}

export interface ILoadingUsersFailedAction extends Action {
  type: UsersActionTypes.LOADING_USERS_FAILED;
}

export interface ILoadUsersMetadataAction extends Action {
  type: UsersActionTypes.LOAD_USERS_METADATA;
}

export interface ILoadingUsersMetadataAction extends Action {
  type: UsersActionTypes.LOADING_USERS_METADATA;
}

export interface ILoadedUsersMetadataAction extends Action {
  type: UsersActionTypes.LOADED_USERS_METADATA;
  payload: {
    usersMetadata: IUsersMetadata
  };
}

export interface ILoadingUsersMetadataFailedAction extends Action {
  type: UsersActionTypes.LOADING_USERS_METADATA_FAILED;
}

export interface ILoadUserAction extends Action {
  type: UsersActionTypes.LOAD_USER;
  payload: string;
}

export interface ILoadCurrentUserAction extends Action {
  type: UsersActionTypes.LOAD_CURRENT_USER;
}

export interface ILoadingUserAction extends Action {
  type: UsersActionTypes.LOADING_USER;
  payload: string;
}

export interface ILoadingCurrentUserAction extends Action {
  type: UsersActionTypes.LOADING_CURRENT_USER;
}

export interface ILoadedUserAction extends Action {
  type: UsersActionTypes.LOADED_USER;
  payload: {
    user: IUser
  };
}

export interface ILoadingUserFailedAction extends Action {
  type: UsersActionTypes.LOADING_USER_FAILED;
}

export interface ISaveUserAction extends Action {
  type: UsersActionTypes.SAVE_USER;
  payload: Partial<IUser>;
}

export interface ISavingUserAction extends Action {
  type: UsersActionTypes.SAVING_USER;
  payload: Partial<IUser>;
}

export interface ISavedUserAction extends Action {
  type: UsersActionTypes.SAVED_USER;
  payload: {
    user: IUser
  };
}

export interface ISavingUserFailedAction extends Action {
  type: UsersActionTypes.SAVING_USER_FAILED;
}

export interface IInviteUserAction extends Action {
  type: UsersActionTypes.INVITE_USER;
  payload: Partial<IUser>;
}

export interface IInvitingUserAction extends Action {
  type: UsersActionTypes.INVITING_USER;
  payload: Partial<IUser>;
}

export interface IInvitedUserAction extends Action {
  type: UsersActionTypes.INVITED_USER;
  payload: {
    user: IUser
  };
}

export interface IInvitingUserFailedAction extends Action {
  type: UsersActionTypes.INVITING_USER_FAILED;
}

export interface ILastInvitedUserAction extends Action {
  type: UsersActionTypes.LAST_INVITED_USER;
  payload: Partial<IUser> | null;
}

export interface IRemoveUserAction extends Action {
  type: UsersActionTypes.REMOVE_USER;
  payload: string;
}

export interface IRemovingUserAction extends Action {
  type: UsersActionTypes.REMOVING_USER;
  payload: string;
}

export interface IRemovedUserAction extends Action {
  type: UsersActionTypes.REMOVED_USER
  payload: string;
}

export interface IRemovingUserFailedAction extends Action {
  type: UsersActionTypes.REMOVING_USER_FAILED;
}

// Functions

export function loadUsers({
  viewId, filters, sort, page_size, page, reload
}: {
  viewId?: number;
  filters?: IFilter[];
  sort?: ISort;
  page_size?: number;
  page?: number;
  reload?: boolean;
}): ILoadUsersAction {
  return {
    type: UsersActionTypes.LOAD_USERS,
    payload: {
      viewId,
      filters: filters ?
        filters
          .reduce((acc: IParamsFilter[], { name, opr, value }: IFilter) => {
            if (name && opr && value ) {
              acc.push({
                col: name,
                opr, value
              });
            }
            return acc;
          }, [] as IParamsFilter[]) :
        undefined,
      sort,
      reload,
      page_size,
      page
    }
  }
}

export function canLoadMoreUsers(canLoadMore:boolean): ICanLoadMoreUsersAction {
  return {
    type: UsersActionTypes.CAN_LOAD_MORE_USERS,
    payload:{
      canLoadMore
    }
  }
}

export function loadingUsers(): ILoadingUsersAction {
  return {
    type: UsersActionTypes.LOADING_USERS
  }
}

export function loadedUsers(users: IUser[], params: IParams | undefined, reload?: boolean, sort?: ISort): ILoadedUsersAction {
  return {
    type: UsersActionTypes.LOADED_USERS,
    payload: {
      users,
      params,
      reload
    }
  }
}

export function loadingUsersFailed(): ILoadingUsersFailedAction {
  return {
    type: UsersActionTypes.LOADING_USERS_FAILED
  }
}

export function loadUsersMetadata(): ILoadUsersMetadataAction {
  return {
    type: UsersActionTypes.LOAD_USERS_METADATA
  }
}

export function loadingUsersMetadata(): ILoadingUsersMetadataAction {
  return {
    type: UsersActionTypes.LOADING_USERS_METADATA
  }
}

export function loadedUsersMetadata(usersMetadata: IUsersMetadata): ILoadedUsersMetadataAction {
  return {
    type: UsersActionTypes.LOADED_USERS_METADATA,
    payload: {
      usersMetadata
    }
  }
}

export function loadingUsersMetadataFailed(): ILoadingUsersMetadataFailedAction {
  return {
    type: UsersActionTypes.LOADING_USERS_METADATA_FAILED
  }
}

export function loadUser(username: string): ILoadUserAction {
  return {
    type: UsersActionTypes.LOAD_USER,
    payload: username
  }
}

export function loadCurrentUser(): ILoadCurrentUserAction {
  return {
    type: UsersActionTypes.LOAD_CURRENT_USER
  }
}

export function loadingUser(username: string): ILoadingUserAction {
  return {
    type: UsersActionTypes.LOADING_USER,
    payload: username
  }
}

export function loadingCurrentUser(): ILoadingCurrentUserAction {
  return {
    type: UsersActionTypes.LOADING_CURRENT_USER
  }
}

export function loadedUser(user: IUser): ILoadedUserAction {
  return {
    type: UsersActionTypes.LOADED_USER,
    payload: {
      user
    }
  }
}

export function loadingUserFailed(): ILoadingUserFailedAction {
  return {
    type: UsersActionTypes.LOADING_USER_FAILED
  }
}

export function saveUser(user: Partial<IUser>): ISaveUserAction {
  return {
    type: UsersActionTypes.SAVE_USER,
    payload: user
  }
}

export function savingUser(user: Partial<IUser>): ISavingUserAction {
  return {
    type: UsersActionTypes.SAVING_USER,
    payload: user
  }
}

export function savedUser(user: IUser): ISavedUserAction {
  return {
    type: UsersActionTypes.SAVED_USER,
    payload: {
      user
    }
  }
}

export function savingUserFailed(): ISavingUserFailedAction {
  return {
    type: UsersActionTypes.SAVING_USER_FAILED
  }
}

export function inviteUser(user: Partial<IUser>): IInviteUserAction {
  return {
    type: UsersActionTypes.INVITE_USER,
    payload: user
  }
}

export function invitingUser(user: Partial<IUser>): IInvitingUserAction {
  return {
    type: UsersActionTypes.INVITING_USER,
    payload: user
  }
}

export function invitedUser(user: IUser): IInvitedUserAction {
  return {
    type: UsersActionTypes.INVITED_USER,
    payload: {
      user
    }
  }
}

export function invitingUserFailed(): IInvitingUserFailedAction {
  return {
    type: UsersActionTypes.INVITING_USER_FAILED
  }
}

export function setLastInvitedUser(user: Partial<IUser> | null): ILastInvitedUserAction {
  return {
    type: UsersActionTypes.LAST_INVITED_USER,
    payload: user,
  }
}

export function removeUser(uid: string): IRemoveUserAction {
  return {
    type: UsersActionTypes.REMOVE_USER,
    payload: uid
  }
}

export function removingUser(uid: string): IRemovingUserAction {
  return {
    type: UsersActionTypes.REMOVING_USER,
    payload: uid
  }
}

export function removedUser(uid: string): IRemovedUserAction {
  return {
    type: UsersActionTypes.REMOVED_USER,
    payload: uid
  }
}

export function removingUserFailed(): IRemovingUserFailedAction {
  return {
    type: UsersActionTypes.REMOVING_USER_FAILED
  }
}

export type UsersAction =
  ILoadUsersAction |
  ICanLoadMoreUsersAction|
  ILoadingUsersAction |
  ILoadedUsersAction |
  ILoadingUsersFailedAction |
  ILoadUsersMetadataAction |
  ILoadingUsersMetadataAction |
  ILoadedUsersMetadataAction |
  ILoadingUsersMetadataFailedAction |
  ILoadUserAction |
  ILoadCurrentUserAction |
  ILoadingUserAction |
  ILoadingCurrentUserAction |
  ILoadedUserAction |
  ILoadingUserFailedAction |
  ISaveUserAction |
  ISavingUserAction |
  ISavedUserAction |
  ISavingUserFailedAction |
  IInviteUserAction |
  IInvitingUserAction |
  IInvitedUserAction |
  IInvitingUserFailedAction |
  ILastInvitedUserAction |
  IRemoveUserAction |
  IRemovingUserAction |
  IRemovedUserAction |
  IRemovingUserFailedAction;
