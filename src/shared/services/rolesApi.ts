import { api } from './Api';

export const getRoles = () => {
  return api.get('/role/').then(res => res.data);
};
