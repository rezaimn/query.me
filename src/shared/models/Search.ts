export interface SearchResult {
  id?: string;
  database_uid?: number;
  schema_id?: number;
  table_id?: number;
  column?: number;
  query_id?: number;
  index: string;
  name: string;
  type: string
  workspace_id: number;
  data_type?: string; // for columns only
}
