import { Action } from 'redux';

import {
  IDatabase,
  IDatabaseForCreation,
  IDatabasesMetadata,
  IFilter,
  IParamsFilter,
  IParams,
  ISort, INotebookPageBlockExecution,
} from '../../models';

// Types

export enum DatabasesActionTypes {
  LOAD_DATABASES = 'databases/load',
  CAN_LOAD_MORE_DATABASES = 'databases/can_load_more',
  CAN_LOAD_MORE_SCHEMAS_FOR_DATABASE = 'databases/can_load_more_schemas',
  SHARE_DATABASE_WITH_USER = 'database/share_with_user',
  SHARING_DATABASE_WITH_USER = 'database/sharing_with_user',
  SHARED_DATABASE_WITH_USER = 'database/shared_with_user',
  SHARING_DATABASE_WITH_USER_FAILED = 'database/sharing_with_user_failed',
  SHARE_DATABASE_WITH_WORKSPACE = 'database/share_with_workspace',
  SHARING_DATABASE_WITH_WORKSPACE = 'database/sharing_with_workspace',
  SHARED_DATABASE_WITH_WORKSPACE = 'database/shared_with_workspace',
  SHARING_DATABASE_WITH_WORKSPACE_FAILED = 'database/sharing_with_workspace_failed',
  LOADING_DATABASES = 'databases/loading',
  LOADED_DATABASES = 'databases/loaded',
  LOADING_DATABASES_FAILED = 'databases/loading_failed',
  LOAD_DATABASES_METADATA = 'databases/load_metadata',
  LOADING_DATABASES_METADATA = 'databases/loading_metadata',
  LOADED_DATABASES_METADATA = 'databases/loaded_metadata',
  LOADING_DATABASES_METADATA_FAILED = 'databases/loading_metadata_failed',
  LOAD_DATABASE = 'database/load',
  LOADING_DATABASE = 'database/loading',
  LOADED_DATABASE = 'database/loaded',
  LOADING_DATABASE_FAILED = 'database/loading_failed',
  LOAD_DATABASE_SHARING_SETTINGS = 'database/load_sharing_settings',
  LOADING_DATABASE_SHARING_SETTINGS = 'database/loading_sharing_settings',
  LOADED_DATABASE_SHARING_SETTINGS = 'database/loaded_sharing_settings',
  LOADING_DATABASE_SHARING_SETTINGS_FAILED = 'database/loading_sharing_settings_failed',
  LOAD_CURRENT_USER_PERMISSIONS = 'database/load_current_user_permissions',
  LOADING_CURRENT_USER_PERMISSIONS = 'database/loading_current_user_permissions',
  LOADED_CURRENT_USER_PERMISSIONS = 'database/loaded_current_user_permissions',
  LOADING_CURRENT_USER_PERMISSIONS_FAILED = 'database/loading_current_user_permissions_failed',
  SORT_SCHEMAS_IN_DATABASE = 'database/sort_schemas_in_database',
  CREATE_DATABASE = 'database/create',
  CREATING_DATABASE = 'database/creating',
  CREATED_DATABASE = 'database/created',
  CREATING_DATABASE_FAILED = 'database/creating_failed',
  UNSET_LAST_CREATED_DATABASE = 'database/unset_last_created',
  EDIT_DATABASE = 'database/edit',
  EDITING_DATABASE = 'database/editing',
  EDITED_DATABASE = 'database/edited',
  EDITING_DATABASE_FAILED = 'database/editing_failed',
  REMOVE_DATABASE = 'database/remove',
  REMOVING_DATABASE = 'database/removing',
  REMOVED_DATABASE = 'database/removed',
  REMOVING_DATABASE_FAILED = 'database/removing_failed',
}

// Interfaces

export interface ILoadDatabasesAction extends Action {
  type: DatabasesActionTypes.LOAD_DATABASES;
  payload: {
    viewId: number | undefined;
    filters?: IParamsFilter[] | undefined;
    sort?: ISort;
    reload?:boolean;
    page_size?:number;
    page?:number|undefined;
  };
}

export interface ICanLoadMoreDatabasesAction extends Action {
  type: DatabasesActionTypes.CAN_LOAD_MORE_DATABASES;
  payload: {
    canLoadMore:boolean;
  };
}

export interface ICanLoadMoreSchemasForDatabasesAction extends Action {
  type: DatabasesActionTypes.CAN_LOAD_MORE_SCHEMAS_FOR_DATABASE;
  payload: {
    canLoadMoreSchemas: boolean;
  };
}

export interface IShareDatabaseWithUser extends Action {
  type: DatabasesActionTypes.SHARE_DATABASE_WITH_USER;
  payload: {
    databaseUid: string;
    userUid: string;
    permission: string;
  }
}

export interface ISharingDatabaseWithUser extends Action {
  type: DatabasesActionTypes.SHARING_DATABASE_WITH_USER;
}

export interface ISharedDatabaseWithUser extends Action {
  type: DatabasesActionTypes.SHARED_DATABASE_WITH_USER;
  payload: any;
}

export interface ISharingDatabaseWithUserFailed extends Action {
  type: DatabasesActionTypes.SHARING_DATABASE_WITH_USER_FAILED;
}

export interface IShareDatabaseWithWorkspace extends Action {
  type: DatabasesActionTypes.SHARE_DATABASE_WITH_WORKSPACE;
  payload: {
    uid: string;
    permission: string;
  };
}

export interface ISharingDatabaseWithWorkspace extends Action {
  type: DatabasesActionTypes.SHARING_DATABASE_WITH_WORKSPACE;
}

export interface ISharedDatabaseWithWorkspace extends Action {
  type: DatabasesActionTypes.SHARED_DATABASE_WITH_WORKSPACE;
  payload: any;
}

export interface ISharingDatabaseWithWorkspaceFailed extends Action {
  type: DatabasesActionTypes.SHARING_DATABASE_WITH_WORKSPACE_FAILED;
}

export interface ILoadingDatabasesAction extends Action {
  type: DatabasesActionTypes.LOADING_DATABASES;
}

export interface ILoadedDatabasesAction extends Action {
  type: DatabasesActionTypes.LOADED_DATABASES;
  payload: {
    databases: IDatabase[];
    params: IParams | undefined;
    reload?: boolean;
  };
}

export interface ILoadingDatabasesFailedAction extends Action {
  type: DatabasesActionTypes.LOADING_DATABASES_FAILED;
}

export interface ILoadDatabasesMetadataAction extends Action {
  type: DatabasesActionTypes.LOAD_DATABASES_METADATA;
}

export interface ILoadingDatabasesMetadataAction extends Action {
  type: DatabasesActionTypes.LOADING_DATABASES_METADATA;
}

export interface ILoadedDatabasesMetadataAction extends Action {
  type: DatabasesActionTypes.LOADED_DATABASES_METADATA;
  payload: {
    databasesMetadata: IDatabasesMetadata
  };
}

export interface ILoadingDatabasesMetadataFailedAction extends Action {
  type: DatabasesActionTypes.LOADING_DATABASES_METADATA_FAILED;
}

export interface ILoadDatabaseAction extends Action {
  type: DatabasesActionTypes.LOAD_DATABASE;
  payload: {
    uid: string;
    page: number;
    page_size: number;
    reload: boolean;
    with_schema: boolean;
  };
}

export interface ILoadingDatabaseAction extends Action {
  type: DatabasesActionTypes.LOADING_DATABASE;
  payload: string;
}

export interface ILoadedDatabaseAction extends Action {
  type: DatabasesActionTypes.LOADED_DATABASE;
  payload: {
    database: IDatabase,
    reload: boolean;
  };
}

export interface ILoadingDatabaseFailedAction extends Action {
  type: DatabasesActionTypes.LOADING_DATABASE_FAILED;
}

export interface ILoadDatabaseSharingSettingsAction extends Action {
  type: DatabasesActionTypes.LOAD_DATABASE_SHARING_SETTINGS;
  payload: string;
}

export interface ILoadingDatabaseSharingSettingsAction extends Action {
  type: DatabasesActionTypes.LOADING_DATABASE_SHARING_SETTINGS;
}

export interface ILoadedDatabaseSharingSettingsAction extends Action {
  type: DatabasesActionTypes.LOADED_DATABASE_SHARING_SETTINGS;
  payload: any;
}

export interface ILoadingDatabaseSharingSettingsFailedAction extends Action {
  type: DatabasesActionTypes.LOADING_DATABASE_SHARING_SETTINGS_FAILED;
}

export interface ILoadCurrentUserPermissionsAction extends Action {
  type: DatabasesActionTypes.LOAD_CURRENT_USER_PERMISSIONS;
  payload: {
    uid: string;
    userId: string;
  }
}

export interface ILoadingCurrentUserPermissionsAction extends Action {
  type: DatabasesActionTypes.LOADING_CURRENT_USER_PERMISSIONS;
}

export interface ILoadedCurrentUserPermissionsAction extends Action {
  type: DatabasesActionTypes.LOADED_CURRENT_USER_PERMISSIONS;
  payload: any;
}

export interface ILoadingCurrentUserPermissionsFailedAction extends Action {
  type: DatabasesActionTypes.LOADING_CURRENT_USER_PERMISSIONS_FAILED;
}

export interface ISortSchemasInDatabaseAction extends Action {
  type: DatabasesActionTypes.SORT_SCHEMAS_IN_DATABASE;
  payload: {
    databaseUid: string;
    sort: ISort;
  }
}

export interface ICreateDatabaseAction extends Action {
  type: DatabasesActionTypes.CREATE_DATABASE;
  payload: IDatabaseForCreation;
}

export interface ICreatingDatabaseAction extends Action {
  type: DatabasesActionTypes.CREATING_DATABASE;
  payload: IDatabaseForCreation;
}

export interface ICreatedDatabaseAction extends Action {
  type: DatabasesActionTypes.CREATED_DATABASE;
  payload: IDatabase;
}

export interface ICreatingDatabaseFailedAction extends Action {
  type: DatabasesActionTypes.CREATING_DATABASE_FAILED;
}

export interface IUnsetLastCreatedDatabaseAction extends Action {
  type: DatabasesActionTypes.UNSET_LAST_CREATED_DATABASE;
  payload: null;
}

export interface IEditDatabaseAction extends Action {
  type: DatabasesActionTypes.EDIT_DATABASE;
  payload: {
    uid: string;
    database: IDatabaseForCreation
  }
}

export interface IEditingDatabaseAction extends Action {
  type: DatabasesActionTypes.EDITING_DATABASE;
}

export interface IEditedDatabaseAction extends Action {
  type: DatabasesActionTypes.EDITED_DATABASE;
}

export interface IEditingDatabaseFailedAction extends Action {
  type: DatabasesActionTypes.EDITING_DATABASE_FAILED;
}

export interface IRemoveDatabaseAction extends Action {
  type: DatabasesActionTypes.REMOVE_DATABASE;
  payload: string;
}

export interface IRemovingDatabaseAction extends Action {
  type: DatabasesActionTypes.REMOVING_DATABASE;
  payload: string;
}

export interface IRemovedDatabaseAction extends Action {
  type: DatabasesActionTypes.REMOVED_DATABASE;
  payload: string;
}

export interface IRemovingDatabaseFailedAction extends Action {
  type: DatabasesActionTypes.REMOVING_DATABASE_FAILED;
}

// Functions

export function loadDatabases({
  viewId, filters, sort, page_size, page, reload
}: {
  viewId?: number;
  filters?: IFilter[];
  sort?: ISort;
  page_size?: number;
  page?: number;
  reload?: boolean;
}): ILoadDatabasesAction {
  return {
    type: DatabasesActionTypes.LOAD_DATABASES,
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
  };
}

export function canLoadMoreDatabases(canLoadMore:boolean): ICanLoadMoreDatabasesAction {
  return {
    type: DatabasesActionTypes.CAN_LOAD_MORE_DATABASES,
    payload:{
      canLoadMore
    }
  }
}

export function canLoadMoreSchemasForDatabase(canLoadMoreSchemas:boolean): ICanLoadMoreSchemasForDatabasesAction {
  return {
    type: DatabasesActionTypes.CAN_LOAD_MORE_SCHEMAS_FOR_DATABASE,
    payload:{
      canLoadMoreSchemas
    }
  }
}

export function shareDatabaseWithUser(
  databaseUid: string,
  userUid: string,
  permission: string
): IShareDatabaseWithUser {
  return {
    type: DatabasesActionTypes.SHARE_DATABASE_WITH_USER,
    payload: {
      databaseUid: databaseUid,
      userUid: userUid,
      permission
    }
  }
}

export function sharingDatabaseWithUser(): ISharingDatabaseWithUser {
  return {
    type: DatabasesActionTypes.SHARING_DATABASE_WITH_USER,
  }
}

export function sharedDatabaseWithUser(result: any): ISharedDatabaseWithUser {
  return {
    type: DatabasesActionTypes.SHARED_DATABASE_WITH_USER,
    payload: result
  }
}

export function sharingDatabaseWithUserFailed(): ISharingDatabaseWithUserFailed {
  return {
    type: DatabasesActionTypes.SHARING_DATABASE_WITH_USER_FAILED,
  }
}

export function shareDatabaseWithWorkspace(databaseUid: string, permission: string): IShareDatabaseWithWorkspace {
  return {
    type: DatabasesActionTypes.SHARE_DATABASE_WITH_WORKSPACE,
    payload: {
      uid: databaseUid,
      permission
    }
  }
}

export function sharingDatabaseWithWorkspace(): ISharingDatabaseWithWorkspace {
  return {
    type: DatabasesActionTypes.SHARING_DATABASE_WITH_WORKSPACE,
  }
}

export function sharedDatabaseWithWorkspace(result: any): ISharedDatabaseWithWorkspace {
  return {
    type: DatabasesActionTypes.SHARED_DATABASE_WITH_WORKSPACE,
    payload: result
  }
}

export function sharingDatabaseWithWorkspaceFailed(): ISharingDatabaseWithWorkspaceFailed {
  return {
    type: DatabasesActionTypes.SHARING_DATABASE_WITH_WORKSPACE_FAILED,
  }
}

export function loadingDatabases(): ILoadingDatabasesAction {
  return {
    type: DatabasesActionTypes.LOADING_DATABASES
  }
}

export function loadedDatabases(databases: IDatabase[], params?: IParams, reload?: boolean, sort?: ISort): ILoadedDatabasesAction {
  return {
    type: DatabasesActionTypes.LOADED_DATABASES,
    payload: {
      databases,
      params,
      reload
    }
  }
}

export function loadingDatabasesFailed(): ILoadingDatabasesFailedAction {
  return {
    type: DatabasesActionTypes.LOADING_DATABASES_FAILED
  }
}

export function loadDatabasesMetadata(): ILoadDatabasesMetadataAction {
  return {
    type: DatabasesActionTypes.LOAD_DATABASES_METADATA
  }
}

export function loadingDatabasesMetadata(): ILoadingDatabasesMetadataAction {
  return {
    type: DatabasesActionTypes.LOADING_DATABASES_METADATA
  }
}

export function loadedDatabasesMetadata(databasesMetadata: IDatabasesMetadata): ILoadedDatabasesMetadataAction {
  return {
    type: DatabasesActionTypes.LOADED_DATABASES_METADATA,
    payload: {
      databasesMetadata
    }
  }
}

export function loadingDatabasesMetadataFailed(): ILoadingDatabasesMetadataFailedAction {
  return {
    type: DatabasesActionTypes.LOADING_DATABASES_METADATA_FAILED
  }
}

export function loadDatabase(uid: string, page: number, page_size: number, reload: boolean, with_schema: boolean): ILoadDatabaseAction {
  return {
    type: DatabasesActionTypes.LOAD_DATABASE,
    payload: {
      uid,
      page,
      page_size,
      reload,
      with_schema
    }
  }
}

export function loadingDatabase(uid: string): ILoadingDatabaseAction {
  return {
    type: DatabasesActionTypes.LOADING_DATABASE,
    payload: uid
  }
}

export function loadedDatabase(database: IDatabase, reload: boolean): ILoadedDatabaseAction {
  return {
    type: DatabasesActionTypes.LOADED_DATABASE,
    payload: {
      database,
      reload
    }
  }
}

export function loadingDatabaseFailed(): ILoadingDatabaseFailedAction {
  return {
    type: DatabasesActionTypes.LOADING_DATABASE_FAILED
  }
}

export function loadDatabaseSharingSettings(uid: string): ILoadDatabaseSharingSettingsAction {
  return {
    type: DatabasesActionTypes.LOAD_DATABASE_SHARING_SETTINGS,
    payload: uid
  }
}

export function loadingDatabaseSharingSettings(): ILoadingDatabaseSharingSettingsAction {
  return {
    type: DatabasesActionTypes.LOADING_DATABASE_SHARING_SETTINGS,
  }
}

export function loadedDatabaseSharingSettings(settings: any): ILoadedDatabaseSharingSettingsAction {
  return {
    type: DatabasesActionTypes.LOADED_DATABASE_SHARING_SETTINGS,
    payload: settings
  }
}

export function loadingDatabaseSharingSettingsFailed(): ILoadingDatabaseSharingSettingsFailedAction {
  return {
    type: DatabasesActionTypes.LOADING_DATABASE_SHARING_SETTINGS_FAILED,
  }
}

export function loadCurrentUserPermissions(uid: string, userId: string): ILoadCurrentUserPermissionsAction {
  return {
    type: DatabasesActionTypes.LOAD_CURRENT_USER_PERMISSIONS,
    payload: {
      uid,
      userId,
    }
  }
}

export function loadingCurrentUserPermissions(): ILoadingCurrentUserPermissionsAction {
  return {
    type: DatabasesActionTypes.LOADING_CURRENT_USER_PERMISSIONS,
  }
}

export function loadedCurrentUserPermissions(permissions: any): ILoadedCurrentUserPermissionsAction {
  return {
    type: DatabasesActionTypes.LOADED_CURRENT_USER_PERMISSIONS,
    payload: permissions
  }
}

export function loadingCurrentUserPermissionsFailed(): ILoadingCurrentUserPermissionsFailedAction {
  return {
    type: DatabasesActionTypes.LOADING_CURRENT_USER_PERMISSIONS_FAILED,
  }
}

export function sortSchemasInDatabase(databaseUid: string, sort: ISort) : ISortSchemasInDatabaseAction {
  return {
    type: DatabasesActionTypes.SORT_SCHEMAS_IN_DATABASE,
    payload: {
      databaseUid,
      sort
    }
  }
}

export function createDatabase(database: IDatabaseForCreation): ICreateDatabaseAction {
  return {
    type: DatabasesActionTypes.CREATE_DATABASE,
    payload: database
  }
}

export function creatingDatabase(database: IDatabaseForCreation): ICreatingDatabaseAction {
  return {
    type: DatabasesActionTypes.CREATING_DATABASE,
    payload: database
  }
}

export function createdDatabase(database: IDatabase): ICreatedDatabaseAction {
  return {
    type: DatabasesActionTypes.CREATED_DATABASE,
    payload: database
  }
}

export function creatingDatabaseFailed(): ICreatingDatabaseFailedAction {
  return {
    type: DatabasesActionTypes.CREATING_DATABASE_FAILED
  }
}

export function unsetLastCreatedDatabase(): IUnsetLastCreatedDatabaseAction {
  return {
    type: DatabasesActionTypes.UNSET_LAST_CREATED_DATABASE,
    payload: null,
  }
}

export function editDatabase(uid: string, database: IDatabaseForCreation): IEditDatabaseAction {
  return {
    type: DatabasesActionTypes.EDIT_DATABASE,
    payload: {
      uid: uid,
      database: database
    }
  }
}

export function editingDatabase(): IEditingDatabaseAction {
  return {
    type: DatabasesActionTypes.EDITING_DATABASE,
  }
}

export function editedDatabase(): IEditedDatabaseAction {
  return {
    type: DatabasesActionTypes.EDITED_DATABASE,
  }
}

export function editingDatabaseFailed(): IEditingDatabaseFailedAction {
  return {
    type: DatabasesActionTypes.EDITING_DATABASE_FAILED
  }
}

export function removeDatabase(uid: string): IRemoveDatabaseAction {
  return {
    type: DatabasesActionTypes.REMOVE_DATABASE,
    payload: uid
  }
}

export function removingDatabase(uid: string): IRemovingDatabaseAction {
  return {
    type: DatabasesActionTypes.REMOVING_DATABASE,
    payload: uid
  }
}

export function removedDatabase(uid: string): IRemovedDatabaseAction {
  return {
    type: DatabasesActionTypes.REMOVED_DATABASE,
    payload: uid
  }
}

export function removingDatabaseFailed(): IRemovingDatabaseFailedAction {
  return {
    type: DatabasesActionTypes.REMOVING_DATABASE_FAILED
  }
}
export type DatabasesAction =
  ILoadDatabasesAction |
  ICanLoadMoreDatabasesAction|
  ICanLoadMoreSchemasForDatabasesAction|
  IShareDatabaseWithUser |
  ISharingDatabaseWithUser |
  ISharedDatabaseWithUser |
  ISharingDatabaseWithUserFailed |
  IShareDatabaseWithWorkspace |
  ISharingDatabaseWithWorkspace |
  ISharedDatabaseWithWorkspace |
  ISharingDatabaseWithWorkspaceFailed |
  ILoadingDatabasesAction |
  ILoadedDatabasesAction |
  ILoadingDatabasesFailedAction |
  ILoadDatabasesMetadataAction |
  ILoadingDatabasesMetadataAction |
  ILoadedDatabasesMetadataAction |
  ILoadingDatabasesMetadataFailedAction |
  ILoadDatabaseAction |
  ILoadingDatabaseAction |
  ILoadedDatabaseAction |
  ILoadingDatabaseFailedAction |
  ILoadDatabaseSharingSettingsAction |
  ILoadingDatabaseSharingSettingsAction |
  ILoadedDatabaseSharingSettingsAction |
  ILoadingDatabaseSharingSettingsFailedAction |
  ILoadCurrentUserPermissionsAction |
  ILoadingCurrentUserPermissionsAction |
  ILoadedCurrentUserPermissionsAction |
  ILoadingCurrentUserPermissionsFailedAction |
  ISortSchemasInDatabaseAction |
  ICreateDatabaseAction |
  ICreatingDatabaseAction |
  ICreatedDatabaseAction |
  ICreatingDatabaseFailedAction |
  IUnsetLastCreatedDatabaseAction |
  IEditDatabaseAction |
  IEditingDatabaseAction |
  IEditedDatabaseAction |
  IEditingDatabaseFailedAction |
  IRemoveDatabaseAction |
  IRemovingDatabaseAction |
  IRemovedDatabaseAction |
  IRemovingDatabaseFailedAction;
