import { IListColumn } from '../../../shared/models';

export const tableColumns: { [id: string]: IListColumn } = {
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
  schema: {
    id: 'schema',
    show_in_table: true,
    label: 'Schema',
    width: '15%',
    sortable: true,
    filterable: true,
    type: 'string',
  },
  actions: {
    id: 'actions',
    show_in_table: true,
    label: '',
    width: '12%',
    minWidth: '115px',
  },
};

export const tableColumnDetails: { [id: string]: IListColumn } = {
    name: {
      id: 'name',
      show_in_table: true,
      label: 'Name',
      width: '80%',
      sortable: true,
    },
    data_type: {
      id: 'data_type',
      show_in_table: true,
      sortable: true,
      label: 'Datatype',
      width: '20%',
    },
  };
