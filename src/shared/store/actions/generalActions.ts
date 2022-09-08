import {Action} from 'redux';

// Types

export enum GeneralActionTypes {
  TABLES_PAGE_SIZE = 'tables_page_size',
  TABLES_FIRST_PAGE = 'tables_first_page'
}

// Interfaces

export interface ITablesPageSizeAction extends Action {
  type: GeneralActionTypes.TABLES_PAGE_SIZE;
  payload: {
    pageSize: number
  }
}

export interface ITablesFirstPageAction extends Action {
  type: GeneralActionTypes.TABLES_FIRST_PAGE;
}

// Functions

export function changeTablesPageSize(pageSize: number): ITablesPageSizeAction {
  return {
    type: GeneralActionTypes.TABLES_PAGE_SIZE,
    payload: {
      pageSize
    }
  };
}


export type GeneralActions = ITablesPageSizeAction | ITablesFirstPageAction;
