export interface UserNames {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface IUserColumn {
  description: string;
  label: string;
  name: string;
  required: boolean;
  type: string;
  unique: boolean;
  validate: string[];
}

export interface IUserFilter {
  name: string;
  operator: string;
  fillValue: boolean;
}

export interface IUsersMetadata {
  add_columns: IUserColumn[];
  add_title: string;
  edit_columns: IUserColumn[];
  edit_title: string;
  filters:{
    [id: string]: IUserFilter[];
  };
}

export interface ISharedOption {
  edit: boolean;
  view: boolean;
  use?: boolean; // used for databases
}

export interface ISharedWithUser extends ISharedOption {
  uid: string;
}

export interface ICurrentUserPermissions extends ISharedOption {

}
