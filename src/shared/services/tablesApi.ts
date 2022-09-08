import rison from 'rison';

import { IParams, ISort } from '../models';
import { api } from './Api';

export const getTables = (params: IParams | undefined, sort: ISort | undefined) => {
  if (params && Object.keys(params).length === 1 && (!params.filters || params.filters.length === 0)) {
    params = undefined;
  }
  let requestParams = {};
  if (params && params.filters) {
    requestParams = {
      filters: params.filters
    };
  }
  if (params && params.page_size) {
    requestParams = {
      ...requestParams,
      page: params.page,
      page_size: params.page_size
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
    api.get(`/es/table/?q=${rison.encode(requestParams)}`).then(res => res.data) :
    api.get('/es/table/').then(res => res.data);
};

export const getTablesMetadata = () => {
  return api.get(`/es/table/_info`).then(res => res.data);
}

export const getTable = (id: string, page: number, page_size: number, withColumns: boolean) => {
  return withColumns ?
    api.get(`/es/table/${id}`).then(res => res.data).then(table => {
      const { database_uid, schema, name } = table.result;
      return api.get(`/es/column/?q=(filters:!((col:database_uid,opr:eq,value:'${database_uid}'),(col:schema,opr:eq,value:${schema}),(col:table,opr:eq,value:${name})),page:${page},page_size:${page_size})`)
        .then(res => ({
          table,
          columns: res.data
        }));
    }).then(({ table, columns }) => ({
      ...table,
      result: {
        ...table.result,
        columns: columns.result
      }
    })) :
    api.get(`/es/table/${id}`).then(res => res.data);
};
