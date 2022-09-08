import { Action } from 'redux';

// Types
export enum EditorTypes {
  // DB Details (schema, tables, columns)
  LOAD_DATABASE_METADATA = 'editor/load_database_metadata',
  LOADING_DATABASE_METADATA = 'editor/loading_database_metadata',
  LOADED_DATABASE_METADATA = 'editor/loaded_database_metadata',
  LOADING_DATABASE_METADATA_FAILED = 'editor/loading_database_metadata_failed',
  CLEAR_METADATA= 'editor/clear_metadata',
}

// Interfaces
export interface ILoadDatabaseMetadataAction extends Action {
  type: EditorTypes.LOAD_DATABASE_METADATA;
  payload: string | string[];
}

export interface ILoadingDatabaseMetadataAction extends Action {
  type: EditorTypes.LOADING_DATABASE_METADATA;
  payload: string | string[];
}

export interface ILoadedDatabaseMetadataAction extends Action {
  type: EditorTypes.LOADED_DATABASE_METADATA;
  payload: any;

}

export interface ILoadingDatabaseMetadataFailedAction extends Action {
  type: EditorTypes.LOADING_DATABASE_METADATA_FAILED;
}

export interface IClearMetadataAction extends Action {
  type: EditorTypes.CLEAR_METADATA;
}

// Functions

export function loadDatabaseMetadata(uid: string | string[]): ILoadDatabaseMetadataAction {
  return {
    type: EditorTypes.LOAD_DATABASE_METADATA,
    payload: uid
  }
}

export function loadingDatabaseMetadata(uid: string | string[]): ILoadingDatabaseMetadataAction {
  return {
    type: EditorTypes.LOADING_DATABASE_METADATA,
    payload: uid,
  }
}

export function loadedDatabaseMetadata(result: any): ILoadedDatabaseMetadataAction {
  return {
    type: EditorTypes.LOADED_DATABASE_METADATA,
    payload: result
  }
}

export function loadingDatabaseMetadataFailed(): ILoadingDatabaseMetadataFailedAction {
  return {
    type: EditorTypes.LOADING_DATABASE_METADATA_FAILED,
  }
}

export function clearMetadata(): IClearMetadataAction {
  return {
    type: EditorTypes.CLEAR_METADATA,
  }
}

export type EditorAction =
  ILoadDatabaseMetadataAction |
  ILoadingDatabaseMetadataAction |
  ILoadedDatabaseMetadataAction |
  ILoadingDatabaseMetadataFailedAction |
  IClearMetadataAction;
