import { IListColumn } from '../../../shared/models';

export const schemaColumns: { [id: string]: IListColumn } = {
  name: {
    id: 'name',
    show_in_table: true,
    label: 'Name',
    width: '58%',
    sortable: true,
    filterable: true,
    type: 'string',
  },
  database: {
    id: 'database',
    show_in_table: true,
    label: 'Database',
    width: '15%',
    sortable: true,
    filterable: true,
    type: 'string',
  },
  actions: {
    id: 'actions',
    show_in_table: true,
    label: '',
    width: '27%',
    minWidth: '115px',
  },
};

export const tableColumns: { [id: string]: IListColumn } = {
  name: {
    id: 'name',
    show_in_table: true,
    label: 'Name',
    width: '80%',
    sortable: true,
  },
  changed_on: {
    show_in_table: true,
    id: 'changed_on',
    label: 'Last modified',
    width: '20%',
  },
};
