import rison from 'rison';

import { IParams, ISort } from '../models';
import { api } from './Api';

export const getQueries = (params: IParams | undefined, sort: ISort | undefined) => {
  if (params && Object.keys(params).length === 1 && (!params.filters || params.filters.length === 0)) {
    params = undefined;
  }
  let requestParams = {};
  if (params && params.filters) {
    requestParams = {
      filters: params.filters
    };
  }
  if (sort) {
    requestParams = {
      ...requestParams,
      order_column: sort.name,
      order_direction: sort.direction
    };
  }
  return (params || sort) ?
    api.get(`/saved_query/?q=${rison.encode(requestParams)}`).then(res => res.data) :
    api.get('/saved_query/').then(res => res.data);
};

export const getQueriesMetadata = () => {
  return api.get(`/saved_query/_info`).then(res => res.data);
}

export const getQuery = (id: number) => {
  return Promise.all([
    api.get(`/saved_query/${id}`).then(res => res.data),
    api.get(`/query/?q=(filters:!((col:saved_query_id,opr:eq,value:${id})))`).then(res => res.data),
  ]).then(([query, executions]) => ({
    ...query,
    executions
  }));
};
