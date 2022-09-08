import { IListColumn } from '../../../shared/models';

export const userColumns: { [id: string]: IListColumn } = {
  name: {
    id: 'name',
    show_in_table: true,
    sortable: true,
    label: 'Name',
    width: '30%'
  },
  username: {
    id: 'username',
    show_in_table: false,
    label: 'Username',
    width: '30%',
    filterable: true,
    type:'string'
  },
  first_name: {
    id: 'first_name',
    show_in_table: false,
    label: 'First Name',
    width: '30%',
    filterable: true,
    type:'string'
  },
  last_name: {
    id: 'last_name',
    show_in_table: false,
    label: 'Last Name',
    width: '30%',
    filterable: true,
    type:'string'
  },
  email: {
    id: 'email',
    show_in_table: false,
    label: 'Email',
    width: '30%',
    filterable: true,
    type:'string'
  },
  roles: {
    id: 'roles',
    show_in_table: true,
    sortable: true,
    label: 'Roles',
    width: '29%'
  },
  lastSeen: {
    id: 'lastSeen',
    show_in_table: true,
    sortable: true,
    label: 'Last Seen',
    width: '12%'
  },
  loginCount: {
    id: 'loginCount',
    show_in_table: true,
    sortable: true,
    label: 'Login Count',
    width: '12%'
  },
  created_on: {
    id: 'created_on',
    show_in_table: true,
    sortable: true,
    label: 'Created on',
    width: '12%',
    filterable: true,
    type:'date'
  },
  actions: {
    id: 'actions',
    show_in_table: true,
    label: '',
    width: '5%',
    align: 'right',
    minWidth: '30px'
  }
};
