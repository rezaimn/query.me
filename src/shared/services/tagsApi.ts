import { ITagForCreation, ITagParent } from '../models';
import { api } from './Api';

export const getTags = () => {
  return api.get('/tag/suggestions/').then(res => res.data);
};
  
export const createTag = ({ tag, parent }: { tag: ITagForCreation; parent: ITagParent }) => {
  return api.post(`/tag/${parent.objectType}/${parent.objectId}/`, [ tag.name ]).then(res => res.data);
};

export const removeTag = ({ uid, parent }: { uid: string; parent: ITagParent }) => {
  return api({
    method: 'delete',
    url: `/tag/${parent.objectType}/${parent.objectId}/`,
    data: { tag_uids: [ uid ] }
  }).then(res => res.data);
};
