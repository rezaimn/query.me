import { api } from './Api';

export const getDataTree = () => {
  return api.get(`/es/database/hierarchy`).then(res => res.data);
};

export const refreshDatabaseMetadata = (id: string) => {
  return api.post(`/database/${id}/refresh`).then(res => res.data);
}
export const selectStar = (database: string, schema: string, table: string) => {
  return api.get(`database/${database}/select_star/${table}/${schema}/`).then(res =>res?.data);
}
