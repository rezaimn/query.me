import { IListColumn } from '../../../shared/models';

export const databaseColumns: { [id: string]: IListColumn } = {
  database_name: {
    id: 'database_name',
    show_in_table: true,
    label: 'Name',
    width: '45%',
    sortable: true,
    filterable: true,
    type: 'string',
  },
  changed_by: {
    id: 'changed_by',
    show_in_table: true,
    label: 'Modified by',
    width: '12%',
    filterable: true,
    sortable: true,
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
    filterable: true,
    sortable: true,
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
  actions: {
    id: 'actions',
    show_in_table: true,
    label: '',
    width: '5%',
    minWidth: '30px',
  },
};

export const schemaColumns: { [id: string]: IListColumn } = {
    name: {
      id: 'name',
      show_in_table: true,
      label: 'Name',
      width: '80%',
      sortable: true,
    },
    changed_on: {
      id: 'changed_on',
      show_in_table: true,
      sortable: true,
      label: 'Last modified',
      width: '20%',
    },
  };
