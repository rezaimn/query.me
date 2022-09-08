import { IView, IViewForCreation } from '../models';
import { api } from './Api';
import { capitalizeWord } from "../utils/text";

export const getViews = (type: string) => {
  const types = ['query', 'notebook', 'database', 'schema', 'table'];
  if (types.indexOf(type) >= 0) {
    const capitalType = capitalizeWord(type);

    return api
      .get(`/saved_view/?q=(filters:!((col:view_type,opr:eq,value:${capitalType})))`)
      .then(res => res.data);
  }
  return api.get('/saved_view/').then(res => res.data);
};
  
export const getView = (id: number) => {
  return api.get(`/saved_view/${id}`).then(res => res.data);
};

export const createView = (view: IViewForCreation) => {
  /* return new Promise(resolve => {
    setTimeout(() => {
    resolve();
    }, 1000);
  }).then(() => {
    return api.post(`/saved_view/`, view).then(res => res.data);
  }); */
  return api.post(`/saved_view/`, view).then(res => res.data);
};

export const saveView = (id: number, view: IView) => {
  return api.put(`/saved_view/${id}`, view).then(res => res.data);
};

export const removeView = (id: number) => {
  return api.delete(`/saved_view/${id}`).then(res => res.data);
};
