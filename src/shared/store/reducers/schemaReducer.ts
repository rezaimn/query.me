import { ApiStatus, ISchema, IParams, ISchemasMetadata } from '../../models';
import { SchemasActionTypes, SchemasAction } from '../actions/schemaActions';
import { sortElementsInList } from '../../utils/reducers';
import {TablesActionTypes} from '../actions/tableActions';
import {DatabasesActionTypes} from '../actions/databaseActions';

export const initialSchemaState: ISchemaState = {
  loadingListStatus: ApiStatus.LOADING,
  loadingStatus: ApiStatus.LOADING,
  loadingMetadataStatus: ApiStatus.LOADING,
  addingStatus: ApiStatus.LOADED,
  schemas: [],
  canLoadMoreSchemas: false,
  canLoadMoreTablesForSchema: false,
  schemasParams: {},
  schemasMetadata: null,
  schema: null
}

export interface ISchemaState {
  loadingListStatus: ApiStatus;
  loadingStatus: ApiStatus;
  loadingMetadataStatus: ApiStatus;
  addingStatus: ApiStatus;
  schemas: ISchema[];
  canLoadMoreSchemas: boolean;
  canLoadMoreTablesForSchema: boolean;
  schemasParams: IParams | undefined;
  schemasMetadata: ISchemasMetadata | null;
  schema: ISchema | null;
}

export default function schemasReducer(state: ISchemaState = initialSchemaState, action: SchemasAction): ISchemaState {
  switch (action.type) {
    case SchemasActionTypes.CAN_LOAD_MORE_SCHEMAS:
      return {
        ...state,
        canLoadMoreSchemas: action.payload.canLoadMore
      };
    case SchemasActionTypes.CAN_LOAD_MORE_TABLES_FOR_SCHEMA:
      return {
        ...state,
        canLoadMoreTablesForSchema: action.payload.canLoadMoreTables
      };
    // List
    case SchemasActionTypes.LOAD_SCHEMAS:
    case SchemasActionTypes.LOADING_SCHEMAS:
      return {
        ...state,
        loadingListStatus: ApiStatus.LOADING
      };

    case SchemasActionTypes.LOADING_SCHEMAS_FAILED:
      return {
        ...state,
        loadingListStatus: ApiStatus.FAILED
      };

    case SchemasActionTypes.LOADED_SCHEMAS:
      return {
        ...state,
        loadingListStatus: ApiStatus.LOADED,
        schemas: action.payload.reload?action.payload.schemas:[...state.schemas,...action.payload.schemas],
        schemasParams: action.payload.params
      };

    case SchemasActionTypes.LOAD_SCHEMAS_METADATA:
    case SchemasActionTypes.LOADING_SCHEMAS_METADATA:
      return {
        ...state,
        loadingMetadataStatus: ApiStatus.LOADING
      };

    case SchemasActionTypes.LOADING_SCHEMAS_METADATA_FAILED:
      return {
        ...state,
        loadingMetadataStatus: ApiStatus.FAILED
      };

    case SchemasActionTypes.LOADED_SCHEMAS_METADATA:
      return {
        ...state,
        loadingMetadataStatus: ApiStatus.LOADED,
        schemasMetadata: (action.payload.schemasMetadata && action.payload.schemasMetadata.add_columns) ?
          action.payload.schemasMetadata :
          {
            ...action.payload.schemasMetadata,
            add_columns: [
              { description: '', label: 'Schema Name', name: 'name', required: true, type: 'String', unique: false, validate: [] }
            ]
          }
      };

    // Details
    case SchemasActionTypes.LOAD_SCHEMA:
    case SchemasActionTypes.LOADING_SCHEMA:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADING
      };

    case SchemasActionTypes.LOADING_SCHEMA_FAILED:
      return {
        ...state,
        loadingStatus: ApiStatus.FAILED
      };

    case SchemasActionTypes.LOADED_SCHEMA:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADED,
        schema: {...action.payload.schema,
          tables:[...action.payload.reload?action.payload.schema.tables:[...state?.schema?.tables,...action.payload.schema.tables]]}
      };

    case SchemasActionTypes.SORT_TABLES_IN_SCHEMA:
      return {
        ...state,
        schema: state.schema ? {
          ...state.schema,
          tables: state.schema.tables ?
            sortElementsInList(state.schema.tables, action.payload.sort) :
            state.schema.tables
        } : state.schema
      }

    default:
      return state;
  }
}
