import { IDatabase, ISqlTable } from './Data';
import { ITag } from './Tag';
import { UserNames } from './User';

export interface IQuery {
  id: number;
  label: string;
  sql: string;
  database: IDatabase;
  sql_tables: ISqlTable[];
  tags: ITag[];
  changed_on: string;
  changed_by: UserNames;
  last_run: string;
}

export interface IQueryColumn {
  description: string;
  label: string;
  name: string;
  required: boolean;
  type: string;
  unique: boolean;
  validate: string[];
}

export interface IQueryFilter {
  name: string;
  operator: string;
}

export interface IQueriesMetadata {
  add_columns: IQueryColumn[];
  add_title: string;
  edit_columns: IQueryColumn[];
  edit_title: string;
  filters:{
    [id: string]: IQueryFilter[];
  };
}
