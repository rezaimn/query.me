import { Action } from 'redux';
import {
  IOrganization,
  IFilter,
  IParamsFilter,
  ISort,
  IParams
} from '../../models';

export enum OrganizationsActionTypes {
  LOAD_ORGANIZATIONS = 'organizations/load',
  LOADING_ORGANIZATIONS = 'organizations/loading',
  LOADED_ORGANIZATIONS = 'organizations/loaded',
  LOADING_ORGANIZATIONS_FAILED = 'organizations/loading_failed',
  LOAD_ORGANIZATION = 'organization/load',
  LOAD_CURRENT_ORGANIZATION = 'organization/load_current',
  LOADING_ORGANIZATION = 'organization/loading',
  LOADING_CURRENT_ORGANIZATION = 'organization/loading_current',
  LOADED_ORGANIZATION = 'organization/loaded',
  LOADING_ORGANIZATION_FAILED = 'organization/loading_failed',
  SAVE_ORGANIZATION = 'organization/save',
  SAVE_CURRENT_ORGANIZATION = 'organization/save_current',
  SAVING_ORGANIZATION = 'organization/saving',
  SAVING_CURRENT_ORGANIZATION = 'organization/saving_current',
  SAVED_ORGANIZATION = 'organization/saved',
  SAVING_ORGANIZATION_FAILED = 'organization/saving_failed'
}

// Interfaces

export interface ILoadOrganizationsAction extends Action {
  type: OrganizationsActionTypes.LOAD_ORGANIZATIONS;
  payload: {
    filters?: IParamsFilter[] | undefined;
    sort?: ISort;
  };
}

export interface ILoadingOrganizationsAction extends Action {
  type: OrganizationsActionTypes.LOADING_ORGANIZATIONS;
}

export interface ILoadedOrganizationsAction extends Action {
  type: OrganizationsActionTypes.LOADED_ORGANIZATIONS;
  payload: {
    organizations: IOrganization[],
    params: IParams | undefined;
  };
}

export interface ILoadingOrganizationsFailedAction extends Action {
  type: OrganizationsActionTypes.LOADING_ORGANIZATIONS_FAILED;
}

export interface ILoadOrganizationAction extends Action {
  type: OrganizationsActionTypes.LOAD_ORGANIZATION;
  payload: string;
}

export interface ILoadCurrentOrganizationAction extends Action {
  type: OrganizationsActionTypes.LOAD_CURRENT_ORGANIZATION;
}

export interface ILoadingOrganizationAction extends Action {
  type: OrganizationsActionTypes.LOADING_ORGANIZATION;
  payload: string;
}

export interface ILoadingCurrentOrganizationAction extends Action {
  type: OrganizationsActionTypes.LOADING_CURRENT_ORGANIZATION;
}

export interface ILoadedOrganizationAction extends Action {
  type: OrganizationsActionTypes.LOADED_ORGANIZATION;
  payload: {
    organization: IOrganization
  };
}

export interface ILoadingOrganizationFailedAction extends Action {
  type: OrganizationsActionTypes.LOADING_ORGANIZATION_FAILED;
}

export interface ISaveOrganizationAction extends Action {
  type: OrganizationsActionTypes.SAVE_ORGANIZATION;
  payload: Partial<IOrganization>;
}

export interface ISaveCurrentOrganizationAction extends Action {
  type: OrganizationsActionTypes.SAVE_CURRENT_ORGANIZATION;
  payload: Partial<IOrganization>;
}

export interface ISavingOrganizationAction extends Action {
  type: OrganizationsActionTypes.SAVING_ORGANIZATION;
  payload: Partial<IOrganization>;
}

export interface ISavingCurrentOrganizationAction extends Action {
  type: OrganizationsActionTypes.SAVING_CURRENT_ORGANIZATION;
  payload: Partial<IOrganization>;
}

export interface ISavedOrganizationAction extends Action {
  type: OrganizationsActionTypes.SAVED_ORGANIZATION;
  payload: {
    organization: IOrganization
  };
}

export interface ISavingOrganizationFailedAction extends Action {
  type: OrganizationsActionTypes.SAVING_ORGANIZATION_FAILED;
}

// Functions

export function loadOrganizations({
  filters, sort
}: {
  filters?: IFilter[];
  sort?: ISort;
}): ILoadOrganizationsAction {
  return {
    type: OrganizationsActionTypes.LOAD_ORGANIZATIONS,
    payload: {
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
      sort
    }
  }
}

export function loadingOrganizations(): ILoadingOrganizationsAction {
  return {
    type: OrganizationsActionTypes.LOADING_ORGANIZATIONS
  }
}

export function loadedOrganizations(organizations: IOrganization[], params: IParams | undefined, sort?: ISort): ILoadedOrganizationsAction {
  return {
    type: OrganizationsActionTypes.LOADED_ORGANIZATIONS,
    payload: {
      organizations,
      params
    }
  }
}

export function loadingOrganizationsFailed(): ILoadingOrganizationsFailedAction {
  return {
    type: OrganizationsActionTypes.LOADING_ORGANIZATIONS_FAILED
  }
}

export function loadOrganization(uid: string): ILoadOrganizationAction {
  return {
    type: OrganizationsActionTypes.LOAD_ORGANIZATION,
    payload: uid
  }
}

export function loadCurrentOrganization(): ILoadCurrentOrganizationAction {
  return {
    type: OrganizationsActionTypes.LOAD_CURRENT_ORGANIZATION
  }
}

export function loadingOrganization(uid: string): ILoadingOrganizationAction {
  return {
    type: OrganizationsActionTypes.LOADING_ORGANIZATION,
    payload: uid
  }
}

export function loadingCurrentOrganization(): ILoadingCurrentOrganizationAction {
  return {
    type: OrganizationsActionTypes.LOADING_CURRENT_ORGANIZATION
  }
}

export function loadedOrganization(organization: IOrganization): ILoadedOrganizationAction {
  return {
    type: OrganizationsActionTypes.LOADED_ORGANIZATION,
    payload: {
      organization
    }
  }
}

export function loadingOrganizationFailed(): ILoadingOrganizationFailedAction {
  return {
    type: OrganizationsActionTypes.LOADING_ORGANIZATION_FAILED
  }
}

export function saveOrganization(organization: Partial<IOrganization>): ISaveOrganizationAction {
  return {
    type: OrganizationsActionTypes.SAVE_ORGANIZATION,
    payload: organization
  }
}

export function saveCurrentOrganization(organization: Partial<IOrganization>): ISaveCurrentOrganizationAction {
  return {
    type: OrganizationsActionTypes.SAVE_CURRENT_ORGANIZATION,
    payload: organization
  }
}

export function savingOrganization(organization: Partial<IOrganization>): ISavingOrganizationAction {
  return {
    type: OrganizationsActionTypes.SAVING_ORGANIZATION,
    payload: organization
  }
}

export function savingCurrentOrganization(organization: Partial<IOrganization>): ISavingCurrentOrganizationAction {
  return {
    type: OrganizationsActionTypes.SAVING_CURRENT_ORGANIZATION,
    payload: organization
  }
}

export function savedOrganization(organization: IOrganization): ISavedOrganizationAction {
  return {
    type: OrganizationsActionTypes.SAVED_ORGANIZATION,
    payload: {
      organization
    }
  }
}

export function savingOrganizationFailed(): ISavingOrganizationFailedAction {
  return {
    type: OrganizationsActionTypes.SAVING_ORGANIZATION_FAILED
  }
}

export type OrganizationsAction =
  ILoadOrganizationsAction |
  ILoadingOrganizationsAction |
  ILoadedOrganizationsAction |
  ILoadingOrganizationsFailedAction |
  ILoadOrganizationAction |
  ILoadCurrentOrganizationAction |
  ILoadingOrganizationAction |
  ILoadingCurrentOrganizationAction |
  ILoadedOrganizationAction |
  ILoadingOrganizationFailedAction |
  ISaveOrganizationAction |
  ISaveCurrentOrganizationAction |
  ISavingOrganizationAction |
  ISavingCurrentOrganizationAction |
  ISavedOrganizationAction |
  ISavingOrganizationFailedAction;
