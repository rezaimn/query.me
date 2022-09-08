import { Action } from 'redux';
import {
  IQuery,
  IQueriesMetadata,
  IFilter,
  IParams,
  IParamsFilter,
  ISort
} from '../../models';

// Types

export enum QueriesActionTypes {
  LOAD_QUERIES = 'queries/load',
  LOADING_QUERIES = 'queries/loading',
  LOADED_QUERIES = 'queries/loaded',
  LOADING_QUERIES_FAILED = 'queries/loading_failed',
  LOAD_QUERIES_METADATA = 'queries/load_metadata',
  LOADING_QUERIES_METADATA = 'queries/loading_metadata',
  LOADED_QUERIES_METADATA = 'queries/loaded_metadata',
  LOADING_QUERIES_METADATA_FAILED = 'queries/loading_metadata_failed',
  LOAD_QUERY = 'query/load',
  LOADING_QUERY = 'query/loading',
  LOADED_QUERY = 'query/loaded',
  LOADING_QUERY_FAILED = 'query/loading_failed',
}

// Interfaces

export interface ILoadQueriesAction extends Action {
  type: QueriesActionTypes.LOAD_QUERIES;
  payload: {
    viewId: number | undefined;
    filters?: IParamsFilter[] | undefined;
    sort?: ISort;
  };
}

export interface ILoadingQueriesAction extends Action {
  type: QueriesActionTypes.LOADING_QUERIES;
}

export interface ILoadedQueriesAction extends Action {
  type: QueriesActionTypes.LOADED_QUERIES;
  payload: {
    queries: IQuery[];
    params: IParams | undefined;
  };
}

export interface ILoadingQueriesFailedAction extends Action {
  type: QueriesActionTypes.LOADING_QUERIES_FAILED;
}

export interface ILoadQueriesMetadataAction extends Action {
  type: QueriesActionTypes.LOAD_QUERIES_METADATA;
}

export interface ILoadingQueriesMetadataAction extends Action {
  type: QueriesActionTypes.LOADING_QUERIES_METADATA;
}

export interface ILoadedQueriesMetadataAction extends Action {
  type: QueriesActionTypes.LOADED_QUERIES_METADATA;
  payload: {
    queriesMetadata: IQueriesMetadata
  };
}

export interface ILoadingQueriesMetadataFailedAction extends Action {
  type: QueriesActionTypes.LOADING_QUERIES_METADATA_FAILED;
}

export interface ILoadQueryAction extends Action {
  type: QueriesActionTypes.LOAD_QUERY;
  payload: number;
}

export interface ILoadingQueryAction extends Action {
  type: QueriesActionTypes.LOADING_QUERY;
  payload: number;
}

export interface ILoadedQueryAction extends Action {
  type: QueriesActionTypes.LOADED_QUERY;
  payload: {
    query: IQuery
  };
}

export interface ILoadingQueryFailedAction extends Action {
  type: QueriesActionTypes.LOADING_QUERY_FAILED;
}

// Functions

export function loadQueries({
  viewId, filters, sort
}: {
  viewId?: number;
  filters?: IFilter[];
  sort?: ISort;
}): ILoadQueriesAction {
  return {
    type: QueriesActionTypes.LOAD_QUERIES,
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
      sort
    }
  };
}

export function loadingQueries(): ILoadingQueriesAction {
  return {
    type: QueriesActionTypes.LOADING_QUERIES
  }
}

export function loadedQueries(queries: IQuery[], params: IParams | undefined, sort?: ISort): ILoadedQueriesAction {
  return {
    type: QueriesActionTypes.LOADED_QUERIES,
    payload: {
      queries,
      params
    }
  }
}

export function loadingQueriesFailed(): ILoadingQueriesFailedAction {
  return {
    type: QueriesActionTypes.LOADING_QUERIES_FAILED
  }
}

export function loadQueriesMetadata(): ILoadQueriesMetadataAction {
  return {
    type: QueriesActionTypes.LOAD_QUERIES_METADATA
  }
}

export function loadingQueriesMetadata(): ILoadingQueriesMetadataAction {
  return {
    type: QueriesActionTypes.LOADING_QUERIES_METADATA
  }
}

export function loadedQueriesMetadata(queriesMetadata: IQueriesMetadata): ILoadedQueriesMetadataAction {
  return {
    type: QueriesActionTypes.LOADED_QUERIES_METADATA,
    payload: {
      queriesMetadata
    }
  }
}

export function loadingQueriesMetadataFailed(): ILoadingQueriesMetadataFailedAction {
  return {
    type: QueriesActionTypes.LOADING_QUERIES_METADATA_FAILED
  }
}

export function loadQuery(id: number): ILoadQueryAction {
  return {
    type: QueriesActionTypes.LOAD_QUERY,
    payload: id
  }
}

export function loadingQuery(id: number): ILoadingQueryAction {
  return {
    type: QueriesActionTypes.LOADING_QUERY,
    payload: id
  }
}

export function loadedQuery(query: IQuery): ILoadedQueryAction {
  return {
    type: QueriesActionTypes.LOADED_QUERY,
    payload: {
      query
    }
  }
}

export function loadingQueryFailed(): ILoadingQueryFailedAction {
  return {
    type: QueriesActionTypes.LOADING_QUERY_FAILED
  }
}

export type QueriesAction =
  ILoadQueriesAction |
  ILoadingQueriesAction |
  ILoadedQueriesAction |
  ILoadingQueriesFailedAction |
  ILoadQueriesMetadataAction |
  ILoadingQueriesMetadataAction |
  ILoadedQueriesMetadataAction |
  ILoadingQueriesMetadataFailedAction |
  ILoadQueryAction |
  ILoadingQueryAction |
  ILoadedQueryAction |
  ILoadingQueryFailedAction;
