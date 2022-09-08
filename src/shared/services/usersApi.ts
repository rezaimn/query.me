import rison from 'rison';

import { api } from './Api';
import { IParams, ISort, IUser } from '../models';

export const getUsers = (params: IParams | undefined, sort: ISort | undefined) => {
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
    api.get(`/user/?q=${rison.encode(requestParams)}`).then(res => res.data) :
    api.get('/user/').then(res => res.data);
};

export const getUsersMetadata = () => {
  return api.get(`/user/_info`).then(res => res.data);
}

export const getUser = (username: string) => {
  return api.get(`/es/user/${username}`).then(res => res.data);
};

export const getCurrentUser = () => {
  return api.get('/user/current').then(res => res.data);
};

export const inviteUser = (user: Partial<IUser>) => {
  const { email, first_name, last_name, roles } = user;
  return api.post('/user/', {
    email, first_name, last_name,
    roles: roles ? roles.map((role: { id: string }) => role.id) : []
  }).then(res => res.data);
};

export const saveUser = (user: Partial<IUser>) => {
  const { uid, first_name, last_name, roles, accepted_terms_on } = user;
  return api.put(`/user/${uid}`, {
    first_name,
    last_name,
    accepted_terms_on,
    roles: roles ? roles.map((role: { id: string }) => role.id) : undefined
  }).then(res => res.data);
};

export const removeUser = (uid: string) => {
  /**
   * This endpoint also accepts workspace_id at the end to specify from which workspace.
   * If workspace_id is not specified, it will use the current workspace.
   *
   * DEL /user/${uid} should redirect here as well.
   */
  return api.delete(`/user/${uid}/remove_from_workspace/`).then(res => res.data);
};
