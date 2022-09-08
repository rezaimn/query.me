import { Action } from 'redux';
import { ITable, ITablesMetadata, IFilter, IParamsFilter, IParams, ISort } from '../../models';

export enum TablesActionTypes {
  LOAD_TABLES = 'tables/load',
  CAN_LOAD_MORE_TABLES = 'tables/can_load_more',
  CAN_LOAD_MORE_COLUMNS_FOR_TABLE = 'tables/can_load_more_columns',
  LOADING_TABLES = 'tables/loading',
  LOADED_TABLES = 'tables/loaded',
  LOADING_TABLES_FAILED = 'tables/loading_failed',
  LOAD_TABLES_METADATA = 'tables/load_metadata',
  LOADING_TABLES_METADATA = 'tables/loading_metadata',
  LOADED_TABLES_METADATA = 'tables/loaded_metadata',
  LOADING_TABLES_METADATA_FAILED = 'tables/loading_metadata_failed',
  LOAD_TABLE = 'table/load',
  LOADING_TABLE = 'table/loading',
  LOADED_TABLE = 'table/loaded',
  LOADING_TABLE_FAILED = 'table/loading_failed',
  SORT_COLUMNS_IN_TABLE = 'table/sort_columns_in_table'
}

export interface ILoadTablesAction extends Action {
  type: TablesActionTypes.LOAD_TABLES;
  payload: {
    viewId: number | undefined;
    filters?: IParamsFilter[] | undefined;
    sort?: ISort;
    page?: number | undefined;
    page_size?: number | undefined;
    reload?: boolean;
  };
}

export interface ICanLoadMoreTablesAction extends Action {
  type: TablesActionTypes.CAN_LOAD_MORE_TABLES;
  payload: {
    canLoadMore:boolean;
  };
}

export interface ICanLoadMoreColumnsForTableAction extends Action {
  type: TablesActionTypes.CAN_LOAD_MORE_COLUMNS_FOR_TABLE;
  payload: {
    canLoadMoreColumns: boolean;
  };
}

export interface ILoadingTablesAction extends Action {
  type: TablesActionTypes.LOADING_TABLES;
}

export interface ILoadedTablesAction extends Action {
  type: TablesActionTypes.LOADED_TABLES;
  payload: {
    tables: ITable[]
    params: IParams | undefined;
    reload?: boolean;
  };
}

export interface ILoadingTablesFailedAction extends Action {
  type: TablesActionTypes.LOADING_TABLES_FAILED;
}

export interface ILoadTablesMetadataAction extends Action {
  type: TablesActionTypes.LOAD_TABLES_METADATA;
}

export interface ILoadingTablesMetadataAction extends Action {
  type: TablesActionTypes.LOADING_TABLES_METADATA;
}

export interface ILoadedTablesMetadataAction extends Action {
  type: TablesActionTypes.LOADED_TABLES_METADATA;
  payload: {
    tablesMetadata: ITablesMetadata
  };
}

export interface ILoadingTablesMetadataFailedAction extends Action {
  type: TablesActionTypes.LOADING_TABLES_METADATA_FAILED;
}

export interface ILoadTableAction extends Action {
  type: TablesActionTypes.LOAD_TABLE;
  payload: {
    id: string;
    page: number;
    page_size: number;
    reload: boolean;
    with_column: boolean;
  };
}

export interface ILoadingTableAction extends Action {
  type: TablesActionTypes.LOADING_TABLE;
  payload: string;
}

export interface ILoadedTableAction extends Action {
  type: TablesActionTypes.LOADED_TABLE;
  payload: {
    table: ITable;
    reload: boolean;
  };
}

export interface ILoadingTableFailedAction extends Action {
  type: TablesActionTypes.LOADING_TABLE_FAILED;
}

export interface ISortColumnsInTableAction extends Action {
  type: TablesActionTypes.SORT_COLUMNS_IN_TABLE;
  payload: {
    tableId: string;
    sort: ISort;
  }
}

// Functions

export function loadTables({
  viewId, filters, sort, page_size, page, reload
}: {
  viewId?: number;
  filters?: IFilter[];
  sort?: ISort;
  reload?: boolean;
  page_size?: number;
  page?: number;
}): ILoadTablesAction {
  return {
    type: TablesActionTypes.LOAD_TABLES,
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
export function canLoadMoreTables(canLoadMore:boolean): ICanLoadMoreTablesAction {
  return {
    type: TablesActionTypes.CAN_LOAD_MORE_TABLES,
    payload:{
      canLoadMore
    }
  }
}

export function canLoadMoreColumnsForTable(canLoadMoreColumns: boolean): ICanLoadMoreColumnsForTableAction {
  return {
    type: TablesActionTypes.CAN_LOAD_MORE_COLUMNS_FOR_TABLE,
    payload:{
      canLoadMoreColumns
    }
  }
}

export function loadingTables(): ILoadingTablesAction {
  return {
    type: TablesActionTypes.LOADING_TABLES
  }
}

export function loadedTables(tables: ITable[], params?: IParams, reload?:boolean): ILoadedTablesAction {
  return {
    type: TablesActionTypes.LOADED_TABLES,
    payload: {
      tables,
      params,
      reload
    }
  }
}

export function loadingTablesFailed(): ILoadingTablesFailedAction {
  return {
    type: TablesActionTypes.LOADING_TABLES_FAILED
  }
}

export function loadTablesMetadata(): ILoadTablesMetadataAction {
  return {
    type: TablesActionTypes.LOAD_TABLES_METADATA
  }
}

export function loadingTablesMetadata(): ILoadingTablesMetadataAction {
  return {
    type: TablesActionTypes.LOADING_TABLES_METADATA
  }
}

export function loadedTablesMetadata(tablesMetadata: ITablesMetadata): ILoadedTablesMetadataAction {
  return {
    type: TablesActionTypes.LOADED_TABLES_METADATA,
    payload: {
      tablesMetadata
    }
  }
}

export function loadingTablesMetadataFailed(): ILoadingTablesMetadataFailedAction {
  return {
    type: TablesActionTypes.LOADING_TABLES_METADATA_FAILED
  }
}

export function loadTable(id: string, page: number, page_size: number, reload: boolean, with_column: boolean): ILoadTableAction {
  return {
    type: TablesActionTypes.LOAD_TABLE,
    payload: {
      id,
      page,
      page_size,
      reload,
      with_column
    }
  }
}

export function loadingTable(id: string): ILoadingTableAction {
  return {
    type: TablesActionTypes.LOADING_TABLE,
    payload: id
  }
}

export function loadedTable(table: ITable, reload: boolean): ILoadedTableAction {
  return {
    type: TablesActionTypes.LOADED_TABLE,
    payload: {
      table,
      reload
    }
  }
}

export function loadingTableFailed(): ILoadingTableFailedAction {
  return {
    type: TablesActionTypes.LOADING_TABLE_FAILED
  }
}

export function sortColumnsInTable(tableId: string, sort: ISort) : ISortColumnsInTableAction {
  return {
    type: TablesActionTypes.SORT_COLUMNS_IN_TABLE,
    payload: {
      tableId,
      sort
    }
  }
}

export type TablesAction =
  ILoadTablesAction |
  ICanLoadMoreTablesAction|
  ICanLoadMoreColumnsForTableAction|
  ILoadingTablesAction |
  ILoadedTablesAction |
  ILoadingTablesFailedAction |
  ILoadTablesMetadataAction |
  ILoadingTablesMetadataAction |
  ILoadedTablesMetadataAction |
  ILoadingTablesMetadataFailedAction |
  ILoadTableAction |
  ILoadingTableAction |
  ILoadedTableAction |
  ILoadingTableFailedAction |
  ISortColumnsInTableAction;

