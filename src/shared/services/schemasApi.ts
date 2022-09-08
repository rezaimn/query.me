import rison from 'rison';

import { IParams, ISort } from '../models';
import { api } from './Api';

export const getSchemas = (params: IParams | undefined, sort: ISort | undefined) => {
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
    api.get(`/es/schema/?q=${rison.encode(requestParams)}`).then(res => res.data) :
    api.get('/es/schema/').then(res => res.data);
};

export const getSchemasMetadata = () => {
  return api.get(`/es/schema/_info`).then(res => res.data);
}

export const getSchema = (id: string, page: number, page_size: number, withTables: boolean) => {
  return withTables ?
    api.get(`/es/schema/${id}`).then(res => res.data).then(schema => {
      const { database_uid, name } = schema.result;
      return api.get(`/es/table/?q=(filters:!((col:database_uid,opr:eq,value:'${database_uid}'),(col:schema,opr:eq,value:${name})),page:${page},page_size:${page_size})`)
        .then(res => ({
          schema,
          tables: res.data
        }));
    }).then(({ schema, tables }) => ({
      ...schema,
      result: {
        ...schema.result,
        tables: tables.result
      }
    })) :
    api.get(`/es/schema/${id}`).then(res => res.data);
};
