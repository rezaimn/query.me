import { Action } from 'redux';
import {ISchema, ISchemasMetadata, IFilter, IParamsFilter, IParams, ISort, IDatabase} from '../../models';

export enum SchemasActionTypes {
  LOAD_SCHEMAS = 'schemas/load',
  CAN_LOAD_MORE_SCHEMAS = 'schemas/can_load_more',
  CAN_LOAD_MORE_TABLES_FOR_SCHEMA = 'schemas/can_load_more_tables',
  LOADING_SCHEMAS = 'schemas/loading',
  LOADED_SCHEMAS = 'schemas/loaded',
  LOADING_SCHEMAS_FAILED = 'schemas/loading_failed',
  LOAD_SCHEMAS_METADATA = 'schemas/load_metadata',
  LOADING_SCHEMAS_METADATA = 'schemas/loading_metadata',
  LOADED_SCHEMAS_METADATA = 'schemas/loaded_metadata',
  LOADING_SCHEMAS_METADATA_FAILED = 'schemas/loading_metadata_failed',
  LOAD_SCHEMA = 'schema/load',
  LOADING_SCHEMA = 'schema/loading',
  LOADED_SCHEMA = 'schema/loaded',
  LOADING_SCHEMA_FAILED = 'schema/loading_failed',
  SORT_TABLES_IN_SCHEMA = 'database/sort_tables_in_schema'
}

export interface ILoadSchemasAction extends Action {
  type: SchemasActionTypes.LOAD_SCHEMAS;
  payload: {
    viewId: number | undefined;
    filters?: IParamsFilter[] | undefined;
    sort?: ISort;
    page?: number | undefined;
    page_size?: number | undefined;
    reload?: boolean;
  };
}

export interface ICanLoadMoreSchemasAction extends Action {
  type: SchemasActionTypes.CAN_LOAD_MORE_SCHEMAS;
  payload: {
    canLoadMore:boolean;
  };
}

export interface ICanLoadMoreTablesForSchemaAction extends Action {
  type: SchemasActionTypes.CAN_LOAD_MORE_TABLES_FOR_SCHEMA;
  payload: {
    canLoadMoreTables: boolean;
  };
}

export interface ILoadingSchemasAction extends Action {
  type: SchemasActionTypes.LOADING_SCHEMAS;
}

export interface ILoadedSchemasAction extends Action {
  type: SchemasActionTypes.LOADED_SCHEMAS;
  payload: {
    schemas: ISchema[];
    params: IParams | undefined;
    reload?: boolean;
  };
}

export interface ILoadingSchemasFailedAction extends Action {
  type: SchemasActionTypes.LOADING_SCHEMAS_FAILED;
}

export interface ILoadSchemasMetadataAction extends Action {
  type: SchemasActionTypes.LOAD_SCHEMAS_METADATA;
}

export interface ILoadingSchemasMetadataAction extends Action {
  type: SchemasActionTypes.LOADING_SCHEMAS_METADATA;
}

export interface ILoadedSchemasMetadataAction extends Action {
  type: SchemasActionTypes.LOADED_SCHEMAS_METADATA;
  payload: {
    schemasMetadata: ISchemasMetadata
  };
}

export interface ILoadingSchemasMetadataFailedAction extends Action {
  type: SchemasActionTypes.LOADING_SCHEMAS_METADATA_FAILED;
}

export interface ILoadSchemaAction extends Action {
  type: SchemasActionTypes.LOAD_SCHEMA;
  payload: {
    id: string;
    page: number;
    page_size: number;
    reload: boolean;
    with_table: boolean;
  };
}

export interface ILoadingSchemaAction extends Action {
  type: SchemasActionTypes.LOADING_SCHEMA;
  payload: string;
}

export interface ILoadedSchemaAction extends Action {
  type: SchemasActionTypes.LOADED_SCHEMA;
  payload: {
    schema: ISchema;
    reload: boolean;
  };
}

export interface ILoadingSchemaFailedAction extends Action {
  type: SchemasActionTypes.LOADING_SCHEMA_FAILED;
}

export interface ISortTablesInSchemaAction extends Action {
  type: SchemasActionTypes.SORT_TABLES_IN_SCHEMA;
  payload: {
    schemaId: string;
    sort: ISort;
  }
}

// Functions

export function loadSchemas({
  viewId, filters, sort, page_size, page, reload
}: {
  viewId?: number;
  filters?: IFilter[];
  sort?: ISort;
  reload?: boolean;
  page_size?: number;
  page?: number;
}): ILoadSchemasAction {
  return {
    type: SchemasActionTypes.LOAD_SCHEMAS,
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

export function canLoadMoreSchemas(canLoadMore:boolean): ICanLoadMoreSchemasAction {
  return {
    type: SchemasActionTypes.CAN_LOAD_MORE_SCHEMAS,
    payload:{
      canLoadMore
    }
  }
}

export function canLoadMoreTablesForSchema(canLoadMoreTables: boolean): ICanLoadMoreTablesForSchemaAction {
  return {
    type: SchemasActionTypes.CAN_LOAD_MORE_TABLES_FOR_SCHEMA,
    payload:{
      canLoadMoreTables
    }
  }
}

export function loadingSchemas(): ILoadingSchemasAction {
  return {
    type: SchemasActionTypes.LOADING_SCHEMAS
  }
}

export function loadedSchemas(schemas: ISchema[], params?: IParams, reload?: boolean, sort?: ISort): ILoadedSchemasAction {
  return {
    type: SchemasActionTypes.LOADED_SCHEMAS,
    payload: {
      schemas,
      params,
      reload
    }
  }
}

export function loadingSchemasFailed(): ILoadingSchemasFailedAction {
  return {
    type: SchemasActionTypes.LOADING_SCHEMAS_FAILED
  }
}

export function loadSchemasMetadata(): ILoadSchemasMetadataAction {
  return {
    type: SchemasActionTypes.LOAD_SCHEMAS_METADATA
  }
}

export function loadingSchemasMetadata(): ILoadingSchemasMetadataAction {
  return {
    type: SchemasActionTypes.LOADING_SCHEMAS_METADATA
  }
}

export function loadedSchemasMetadata(schemasMetadata: ISchemasMetadata): ILoadedSchemasMetadataAction {
  return {
    type: SchemasActionTypes.LOADED_SCHEMAS_METADATA,
    payload: {
      schemasMetadata
    }
  }
}

export function loadingSchemasMetadataFailed(): ILoadingSchemasMetadataFailedAction {
  return {
    type: SchemasActionTypes.LOADING_SCHEMAS_METADATA_FAILED
  }
}

export function loadSchema(id: string, page: number, page_size: number, reload: boolean, with_table: boolean): ILoadSchemaAction {
  return {
    type: SchemasActionTypes.LOAD_SCHEMA,
    payload: {
      id,
      page,
      page_size,
      reload,
      with_table
    }
  }
}

export function loadingSchema(id: string): ILoadingSchemaAction {
  return {
    type: SchemasActionTypes.LOADING_SCHEMA,
    payload: id
  }
}

export function loadedSchema(schema: ISchema, reload: boolean): ILoadedSchemaAction {
  return {
    type: SchemasActionTypes.LOADED_SCHEMA,
    payload: {
      schema,
      reload
    }
  }
}

export function loadingSchemaFailed(): ILoadingSchemaFailedAction {
  return {
    type: SchemasActionTypes.LOADING_SCHEMA_FAILED
  }
}

export function sortTablesInSchema(schemaId: string, sort: ISort) : ISortTablesInSchemaAction {
  return {
    type: SchemasActionTypes.SORT_TABLES_IN_SCHEMA,
    payload: {
      schemaId,
      sort
    }
  }
}

export type SchemasAction =
  ILoadSchemasAction |
  ICanLoadMoreSchemasAction|
  ICanLoadMoreTablesForSchemaAction|
  ILoadingSchemasAction |
  ILoadedSchemasAction |
  ILoadingSchemasFailedAction |
  ILoadSchemasMetadataAction |
  ILoadingSchemasMetadataAction |
  ILoadedSchemasMetadataAction |
  ILoadingSchemasMetadataFailedAction |
  ILoadSchemaAction |
  ILoadingSchemaAction |
  ILoadedSchemaAction |
  ILoadingSchemaFailedAction |
  ISortTablesInSchemaAction;
