import { UserNames, ISharedOption, ISharedWithUser } from './User';

// Uri

export interface IDatabaseUri {
  protocol: string;
  slashes: boolean;
  auth: string;
  username: string;
  password: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  query: { [key: string]: string | undefined; };
  hash: string;
  href: string;
  origin: string;
}

// Database

export interface IDatabase {
  uid: string;
  id: number;
  database_name: string;
  created_on_utc: string;
  created_by: UserNames;
  changed_on_utc: string;
  changed_by: UserNames;
  last_use: string;
  backend: string;
  sqlalchemy_uri?: string;
  schemas?: ISchema[];
  database?: string;
  host?: string;
  port?: number;
  username?: string;
  // BigQuery specific
  project_id?: string;
  dataset?: string;
  // encrypted_extra?:string; // this is treated like password
  // Snowflake specific
  account?: string; // + region
  schema?: string;
  warehouse?: string;
  role?: string;
}

export interface IDatabaseForCreation {
  engine: string;
  name: string;
  database_name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  // BigQuery specific
  project_id?: string;
  dataset?: string;
  encrypted_extra?: string;
  // Snowflake specific
  account?: string; // + region
  schema?: string;
  warehouse?: string;
  role?: string;
}

export interface IDatabaseKind {
  name: string;
  backend: string;
  port?: number;
}

export interface IDatabaseColumn {
  description: string;
  label: string;
  name: string;
  required: boolean;
  type: string;
  unique: boolean;
  validate: string[];
}

export interface IDatabaseFilter {
  name: string;
  operator: string;
  fillValue: boolean;
}

export interface IDatabasesMetadata {
  add_columns: IDatabaseColumn[];
  add_title: string;
  edit_columns: IDatabaseColumn[];
  edit_title: string;
  filters:{
    [id: string]: IDatabaseFilter[];
  };
}

export interface IDatabaseSharingSettings {
  is_public: boolean;
  shared_with_workspace: ISharedOption;
  shared_with_users: ISharedWithUser[];
}

// Schema

export interface ISchema {
  id: string;
  name: string;
  database: string;
  created_on: string;
  created_by: UserNames;
  changed_on: string;
  changed_by: UserNames;
  last_use: string;
  database_type: string;
  tables?: ITable[];
}

export interface ISchemaColumn {
  description: string;
  label: string;
  name: string;
  required: boolean;
  type: string;
  unique: boolean;
  validate: string[];
}

export interface ISchemaFilter {
  name: string;
  operator: string;
  fillValue: boolean;
}

export interface ISchemasMetadata {
  add_columns: ISchemaColumn[];
  add_title: string;
  edit_columns: ISchemaColumn[];
  edit_title: string;
  filters:{
    [id: string]: ISchemaFilter[];
  };
}

// Table

export interface ITable {
  id: string;
  name: string;
  type: string;
  database: string;
  schema: string;
  created_on: string;
  created_by: UserNames;
  changed_on: string;
  changed_by: UserNames;
  last_use: string;
  columns?: ITableColumn[];
}

export interface ITableColumn {
  description: string;
  label: string;
  name: string;
  required: boolean;
  data_type: string;
  type: string;
  unique: boolean;
  validate: string[];
}

export interface ITableFilter {
  name: string;
  operator: string;
  fillValue: boolean;
}

export interface ITablesMetadata {
  add_columns: ITableColumn[];
  add_title: string;
  edit_columns: ITableColumn[];
  edit_title: string;
  filters:{
    [id: string]: ITableFilter[];
  };
}

// SQL Table

export interface ISqlTable {
  catalog: string | null;
  schema: string | null;
  table: string;
}
