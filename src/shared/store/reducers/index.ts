import { combineReducers } from 'redux';
import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';

import viewsReducer, { IViewState, initialViewState } from './viewReducer';
import queriesReducer, { IQueryState, initialQueryState } from './queryReducer';
import workflowsReducer, { IWorkflowState, initialWorkflowState } from './workflowReducer';
import notebooksReducer, { INotebookState, initialNotebookState } from './notebookReducer';
import databasesReducer, { IDatabaseState, initialDatabaseState } from './databaseReducer';
import dataTreeReducer, { IDataTreeState, initialDataTreeState } from "./dataTreeReducer";
import schemasReducer, { ISchemaState, initialSchemaState } from './schemaReducer';
import tablesReducer, { ITableState, initialTableState } from './tableReducer';
import usersReducer, { IUserState, initialUserState } from './userReducer';
import rolesReducer, { IRoleState, initialRoleState } from './roleReducer';
import organizationsReducer, { IOrganizationState, initialOrganizationState } from './organizationReducer';
import workspacesReducer, { IWorkspaceState, initialWorkspaceState } from "./workspaceReducer";
import uiReducer, { IUiState, initialUiState } from './uiReducer';
import searchReducer, { ISearchState, initialSearchState } from './searchReducer';
import tagReducer, { ITagState, initialTagState } from './tagReducer';
import activitiesReducer, { IActivitiesState, initialActivitiesState } from './activityReducer';
import editorReducer, { IEditorState, initialEditorState } from './editorReducer';
import generalReducer, { IGeneralState, initialGeneralState } from './generalReducer';
import unsplashReducer, { initialUnsplashState, IUnsplashState } from './unsplashReducer';

export interface IState {
  router?: RouterState;
  views: IViewState;
  queries: IQueryState;
  workflows: IWorkflowState;
  notebooks: INotebookState;
  databases: IDatabaseState;
  dataTree: IDataTreeState;
  schemas: ISchemaState;
  tables: ITableState;
  users: IUserState;
  roles: IRoleState;
  organizations: IOrganizationState;
  workspaces: IWorkspaceState;
  ui: IUiState;
  search: ISearchState;
  tags: ITagState;
  activities: IActivitiesState;
  editor: IEditorState; // SQL Editor
  general:IGeneralState;
  unsplash: IUnsplashState;
}

export const initialState: IState = {
  views: initialViewState,
  queries: initialQueryState,
  workflows: initialWorkflowState,
  notebooks: initialNotebookState,
  databases: initialDatabaseState,
  dataTree: initialDataTreeState,
  schemas: initialSchemaState,
  tables: initialTableState,
  users: initialUserState,
  roles: initialRoleState,
  organizations: initialOrganizationState,
  workspaces: initialWorkspaceState,
  ui: initialUiState,
  search: initialSearchState,
  tags: initialTagState,
  activities: initialActivitiesState,
  editor: initialEditorState,
  general:initialGeneralState,
  unsplash: initialUnsplashState
};

export default (history: History) => combineReducers({
  router: connectRouter(history),
  views: viewsReducer,
  queries: queriesReducer,
  workflows: workflowsReducer,
  notebooks: notebooksReducer,
  databases: databasesReducer,
  dataTree: dataTreeReducer,
  schemas: schemasReducer,
  tables: tablesReducer,
  users: usersReducer,
  roles: rolesReducer,
  organizations: organizationsReducer,
  workspaces: workspacesReducer,
  ui: uiReducer,
  search: searchReducer,
  tags: tagReducer,
  activities: activitiesReducer,
  editor: editorReducer,
  general: generalReducer,
  unsplash: unsplashReducer
});
