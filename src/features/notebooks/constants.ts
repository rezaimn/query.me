import { IListColumn } from '../../shared/models';

export const coverImageVerticalPositionDefault = 50;

export enum GetNotebooksType {
  ALL,
  RECENT,
  CREATED_BY_USER,
}

export interface IEmbedMedia {
  url: string;
  width: number;
  height: number;
}
export const notebookColumns: { [id: string]: IListColumn } = {
  id: {
    id: 'id',
    show_in_table: false,
    label: 'ID',
    width: '0%',
    sortable: true,
    filterable: true,
    type: 'string',
  },
  name: {
    id: 'name',
    show_in_table: true,
    label: 'Name',
    width: '25%',
    sortable: true,
    filterable: true,
    type: 'string',
  },
  changed_by: {
    id: 'changed_by',
    show_in_table: true,
    label: 'Modified by',
    width: '12%',
    sortable: true,
    filterable: true,
    type: 'select',
  },
  changed_on: {
    id: 'changed_on',
    show_in_table: true,
    label: 'Last modified',
    width: '13%',
    sortable: true,
    filterable: true,
    type: 'date',
  },
  created_by: {
    id: 'created_by',
    show_in_table: true,
    label: 'Created by',
    width: '12%',
    sortable: true,
    filterable: true,
    type: 'select',
  },
  created_on: {
    id: 'created_on',
    show_in_table: true,
    label: 'Created on',
    width: '13%',
    sortable: true,
    filterable: true,
    type: 'date',
  },
  tags: {
    id: 'tags',
    show_in_table: true,
    label: 'Tags',
    width: '20%',
    sortable: true,
    filterable: true,
    type: 'tag',
  },
  actions: {
    id: 'actions',
    show_in_table: true,
    label: '',
    width: '5%',
    minWidth: '30px',
  },
};
