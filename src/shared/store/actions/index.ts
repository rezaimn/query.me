import { QueriesAction } from './queryActions';
import { WorkflowsAction } from './workflowActions';
import { DatabasesAction } from './databaseActions';
import { SchemasAction } from './schemaActions';
import { TablesAction } from './tableActions';
import { UsersAction } from './userActions';
import {GeneralActions} from './generalActions';

export type AppActions =
  QueriesAction |
  WorkflowsAction |
  DatabasesAction |
  SchemasAction |
  TablesAction |
  UsersAction|
  GeneralActions;
