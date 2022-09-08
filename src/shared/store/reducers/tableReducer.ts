import { ApiStatus, ITable, IParams, ITablesMetadata } from '../../models';
import { TablesActionTypes, TablesAction } from '../actions/tableActions';
import { sortElementsInList } from '../../utils/reducers';
import {DatabasesActionTypes} from '../actions/databaseActions';
import {SchemasActionTypes} from '../actions/schemaActions';

export const initialTableState: ITableState = {
  loadingListStatus: ApiStatus.LOADING,
  loadingStatus: ApiStatus.LOADING,
  loadingMetadataStatus: ApiStatus.LOADING,
  addingStatus: ApiStatus.LOADED,
  tables: [],
  canLoadMoreTables: false,
  canLoadMoreColumnsForTable: false,
  tablesParams: {},
  tablesMetadata: null,
  table: null
}

export interface ITableState {
  loadingListStatus: ApiStatus;
  loadingStatus: ApiStatus;
  loadingMetadataStatus: ApiStatus;
  addingStatus: ApiStatus;
  tables: ITable[];
  canLoadMoreTables: boolean;
  canLoadMoreColumnsForTable: boolean;
  tablesParams: IParams | undefined;
  tablesMetadata: ITablesMetadata | null;
  table: ITable | null;
}

export default function tablesReducer(state: ITableState = initialTableState, action: TablesAction): ITableState {
  switch (action.type) {
    case TablesActionTypes.CAN_LOAD_MORE_TABLES:
      return {
        ...state,
        canLoadMoreTables: action.payload.canLoadMore
      };
    case TablesActionTypes.CAN_LOAD_MORE_COLUMNS_FOR_TABLE:
      return {
        ...state,
        canLoadMoreColumnsForTable: action.payload.canLoadMoreColumns
      };
    // List
    case TablesActionTypes.LOAD_TABLES:
    case TablesActionTypes.LOADING_TABLES:
      return {
        ...state,
        loadingListStatus: ApiStatus.LOADING
      };

    case TablesActionTypes.LOADING_TABLES_FAILED:
      return {
        ...state,
        loadingListStatus: ApiStatus.FAILED
      };

    case TablesActionTypes.LOADED_TABLES:
      return {
        ...state,
        loadingListStatus: ApiStatus.LOADED,
        tables: action.payload.reload?action.payload.tables:[...state.tables,...action.payload.tables],
        tablesParams: action.payload.params
      };

    case TablesActionTypes.LOAD_TABLES_METADATA:
    case TablesActionTypes.LOADING_TABLES_METADATA:
      return {
        ...state,
        loadingMetadataStatus: ApiStatus.LOADING
      };

    case TablesActionTypes.LOADING_TABLES_METADATA_FAILED:
      return {
        ...state,
        loadingMetadataStatus: ApiStatus.FAILED
      };

    case TablesActionTypes.LOADED_TABLES_METADATA:
      return {
        ...state,
        loadingMetadataStatus: ApiStatus.LOADED,
        tablesMetadata: (action.payload.tablesMetadata && action.payload.tablesMetadata.add_columns) ?
          action.payload.tablesMetadata :
          {
            ...action.payload.tablesMetadata,
            add_columns: [
              {
                description: '',
                label: 'Table Name',
                name: 'name',
                required: true,
                data_type: 'String',
                type: 'String',
                unique: false,
                validate: []
              }
            ]
          }
      };

    // Details
    case TablesActionTypes.LOAD_TABLE:
    case TablesActionTypes.LOADING_TABLE:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADING
      };

    case TablesActionTypes.LOADING_TABLE_FAILED:
      return {
        ...state,
        loadingStatus: ApiStatus.FAILED
      };

    case TablesActionTypes.LOADED_TABLE:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADED,
        table: {...action.payload.table,
          columns:[...action.payload.reload?action.payload.table.columns:[...state?.table?.columns,...action.payload.table.columns]]}
      };

    case TablesActionTypes.SORT_COLUMNS_IN_TABLE:
      return {
        ...state,
        table: state.table ? {
          ...state.table,
          columns: state.table.columns ?
            sortElementsInList(state.table.columns, action.payload.sort) :
            state.table.columns
        } : state.table
      }

    default:
      return state;
  }
}
