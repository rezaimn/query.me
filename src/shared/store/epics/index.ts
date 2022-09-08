import { combineEpics } from 'redux-observable';

import viewEpics from './viewEpics';
import queryEpics from './queryEpics';
import workflowEpics from './workflowEpics';
import databaseEpics from './databaseEpics';
import dataTreeEpics from './dataTreeEpics';
import notebookEpics from './notebookEpics';
import schemaEpics from './schemaEpics';
import tableEpics from './tableEpics';
import userEpics from './userEpics';
import roleEpics from './roleEpics';
import organizationEpics from './organizationEpics';
import workspaceEpics from "./workspaceEpics";
import searchEpics from './searchEpics';
import tagEpics from './tagEpics';
import activityEpics from "./activityEpics";
import editorEpics from "./editorEpics";
import generalEpics from "./generalEpics";
import unsplashEpics from './unsplashEpics';

export const rootEpic = combineEpics(
  viewEpics,
  queryEpics,
  workflowEpics,
  notebookEpics,
  databaseEpics,
  dataTreeEpics,
  schemaEpics,
  tableEpics,
  userEpics,
  roleEpics,
  organizationEpics,
  workspaceEpics,
  searchEpics,
  tagEpics,
  activityEpics,
  editorEpics,
  generalEpics,
  unsplashEpics
);
