import { Action } from 'redux';
import {
  IRole
} from '../../models';

export enum RolesActionTypes {
  LOAD_ROLES = 'roles/load',
  LOADING_ROLES = 'roles/loading',
  LOADED_ROLES = 'roles/loaded',
  LOADING_ROLES_FAILED = 'roles/loading_failed',
}

// Interfaces

export interface ILoadRolesAction extends Action {
  type: RolesActionTypes.LOAD_ROLES;
}

export interface ILoadingRolesAction extends Action {
  type: RolesActionTypes.LOADING_ROLES;
}

export interface ILoadedRolesAction extends Action {
  type: RolesActionTypes.LOADED_ROLES;
  payload: {
    roles: IRole[]
  };
}

export interface ILoadingRolesFailedAction extends Action {
  type: RolesActionTypes.LOADING_ROLES_FAILED;
}

// Functions

export function loadRoles(): ILoadRolesAction {
  return {
    type: RolesActionTypes.LOAD_ROLES
  };
}

export function loadingRoles(): ILoadingRolesAction {
  return {
    type: RolesActionTypes.LOADING_ROLES
  };
}

export function loadedRoles(roles: IRole[]): ILoadedRolesAction {
  return {
    type: RolesActionTypes.LOADED_ROLES,
    payload: {
      roles
    }
  };
}

export function loadingRolesFailed(): ILoadingRolesFailedAction {
  return {
    type: RolesActionTypes.LOADING_ROLES_FAILED
  }
}

export type RolesAction =
  ILoadRolesAction |
  ILoadingRolesAction |
  ILoadedRolesAction |
  ILoadingRolesFailedAction;
