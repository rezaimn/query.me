import { api } from './Api';
import { IParams, ISort, IOrganization } from '../models';

export const getOrganizations = (params: IParams | undefined, sort: ISort | undefined) => {
  return api.get('/es/organization/').then(res => res.data);
};

export const getOrganization = (uid: string) => {
  return api.get(`/organization/${uid}`).then(res => res.data);
};

export const getCurrentOrganization = () => {
  return api.get('/organization/current').then(res => res.data);
};

export const saveOrganization = (organization: Partial<IOrganization>) => {
  const { uid, name } = organization;
  return api.put(`/organization/${uid}`, { name }).then(res => res.data);
};

export const saveCurrentOrganization = (organization: Partial<IOrganization>) => {
  const { name } = organization;
  return api.put(`/organization`, { name }).then(res => res.data);
};
