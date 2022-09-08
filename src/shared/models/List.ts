export interface IListColumn {
  id: string;
  show_in_table: boolean;
  label: string;
  sortable?: boolean;
  width: string;
  minWidth?: string;
  align?: string;
  paddingLeft?: string;
  filterable?: boolean;
  type?: string;
}

export interface ISort {
  name: string;
  direction: string | null;
}


export interface ISharedListColumn {
  description: string;
  label: string;
  name: string;
  required: boolean;
  type: string;
  unique: boolean;
  validate: string[];
}

export interface ISharedListFilter {
  name: string;
  operator: string;
  fillValue: boolean;
}

export interface ISharedListMetadata {
  add_columns: ISharedListColumn[];
  add_title: string;
  edit_columns: ISharedListColumn[];
  edit_title: string;
  filters:{
    [id: string]: ISharedListFilter[];
  };
}
