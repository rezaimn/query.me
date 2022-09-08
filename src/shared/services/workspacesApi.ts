import { api } from './Api';
import { IParams, ISort, IWorkspace } from '../models';

export const getWorkspaces = (params: IParams | undefined, sort: ISort | undefined) => {
  return api.get('/workspace/').then(res => res.data);
};

export const getWorkspace = (uid: string) => {
  return api.get(`/workspace/${uid}`).then(res => res.data);
};

export const getCurrentWorkspace = () => {
  return api.get('/workspace/current').then(res => res.data);
};

export const saveWorkspace = (workspace: Partial<IWorkspace>) => {
  const { uid, name } = workspace;
  return api.put(`/workspace/${uid}`, { name }).then(res => res.data);
};

export const saveCurrentWorkspace = (workspace: Partial<IWorkspace>) => {
  const { name } = workspace;
  return api.put(`/workspace`, { name }).then(res => res.data);
};

export const switchWorkspace = (uid: string) => {
  return api.get(`/workspace/${uid}/switch`).then(res => res.data);
}
