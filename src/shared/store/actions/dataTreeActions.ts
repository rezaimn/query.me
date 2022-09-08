import { Action } from 'redux';
import { DatabasesActionTypes } from './databaseActions';

export enum DataTreeTypes {
  LOAD_DATA_TREE = 'data_tree/load',
  LOADING_DATA_TREE = 'data_tree/loading',
  LOADED_DATA_TREE = 'data_tree/loaded',
  LOADING_DATA_TREE_FAILED = 'data_tree/loading-failed',

  REFRESH_DATABASE = 'data_tree/refresh-database',
  REFRESHING_DATABASE = 'data_tree/refreshing-database',
  REFRESHED_DATABASE = 'data_tree/refreshed-database',
  REFRESHING_DATABASE_FAILED = 'data_tree/refreshing-database-failed',

  LOAD_SELECT_STAR = 'data_tree/load_select_star',
  LOADING_SELECT_STAR = 'data_tree/loading_select_star',
  LOADED_SELECT_STAR = 'data_tree/loaded_select_star',
  LOADING_SELECT_STAR_FAILED = 'data_tree/loading_select_star_failed',
}

export type NodePath = number[];

export interface ILoad extends Action {
  type: DataTreeTypes.LOAD_DATA_TREE
}

export interface ILoading extends Action {
  type: DataTreeTypes.LOADING_DATA_TREE;
}

export interface ILoaded extends Action {
  type: DataTreeTypes.LOADED_DATA_TREE;
  payload: any;
}

export interface ILoadingFailed extends Action {
  type: DataTreeTypes.LOADING_DATA_TREE_FAILED;
}

export interface IRefreshDatabase extends Action {
  type: DataTreeTypes.REFRESH_DATABASE;
  payload: string;
}

export interface IRefreshingDatabase extends Action {
  type: DataTreeTypes.REFRESHING_DATABASE;
}

export interface IRefreshedDatabase extends Action {
  type: DataTreeTypes.REFRESHED_DATABASE;
}

export interface IRefreshingDatabaseFailed extends Action {
  type: DataTreeTypes.REFRESHING_DATABASE_FAILED;
}

export interface ILoadSelectStarAction extends Action {
  type: DataTreeTypes.LOAD_SELECT_STAR;
  payload: {
    database: string,
    schema: string,
    table: string
  }
}
export interface ILoadingSelectStarAction extends Action {
  type: DataTreeTypes.LOADING_SELECT_STAR;
}
export interface ILoadedSelectStarAction extends Action {
  type: DataTreeTypes.LOADED_SELECT_STAR;
  payload: any
}
export interface ILoadingSelectStarFailedAction extends Action {
  type: DataTreeTypes.LOADING_SELECT_STAR_FAILED;
}

// Functions

export function load(): ILoad {
  return {
    type: DataTreeTypes.LOAD_DATA_TREE
  }
}

export function loading(): ILoading {
  return {
    type: DataTreeTypes.LOADING_DATA_TREE
  }
}

export function loaded(result: any): ILoaded {
  return {
    type: DataTreeTypes.LOADED_DATA_TREE,
    payload: result
  }
}

export function loadingFailed(): ILoadingFailed {
  return {
    type: DataTreeTypes.LOADING_DATA_TREE_FAILED
  }
}

export function refreshDatabase(id: string): IRefreshDatabase {
  return {
    type: DataTreeTypes.REFRESH_DATABASE,
    payload: id
  }
}

export function refreshingDatabase(): IRefreshingDatabase {
  return {
    type: DataTreeTypes.REFRESHING_DATABASE
  }
}

export function refreshedDatabase(): IRefreshedDatabase {
  return {
    type: DataTreeTypes.REFRESHED_DATABASE
  }
}

export function refreshingDatabaseFailed(): IRefreshingDatabaseFailed {
  return {
    type: DataTreeTypes.REFRESHING_DATABASE_FAILED
  }
}

export function loadSelectStarData(database: string, schema: string, table: string): ILoadSelectStarAction {
  return {
    type: DataTreeTypes.LOAD_SELECT_STAR,
    payload: {
      database,
      schema,
      table,
    },
  };
}

export function loadingSelectStarData(): ILoadingSelectStarAction {
  return {
    type: DataTreeTypes.LOADING_SELECT_STAR
  }
}

export function loadedSelectStarData(result: any): ILoadedSelectStarAction {
  return {
    type: DataTreeTypes.LOADED_SELECT_STAR,
    payload: result,
  };
}

export function loadingSelectStarDataFiled(): ILoadingSelectStarFailedAction {
  return {
    type: DataTreeTypes.LOADING_SELECT_STAR_FAILED
  }
}

export type DataTreeAction =
  ILoad |
  ILoading |
  ILoaded |
  ILoadingFailed |
  IRefreshDatabase |
  IRefreshingDatabase |
  IRefreshedDatabase |
  IRefreshingDatabaseFailed|
  ILoadSelectStarAction|
  ILoadingSelectStarAction|
  ILoadedSelectStarAction|
  ILoadingSelectStarFailedAction;
