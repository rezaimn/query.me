import { Action } from 'redux';
import {
  IFilter,
  IParams,
  IParamsFilter
} from '../../models';

// Types

export enum SearchActionTypes {
  SEARCH = 'all/search',
  SEARCHING = 'all/searching',
  SEARCHED = 'all/searched',
  SEARCHING_FAILED = 'all/searching_failed'
}

// Interfaces

export interface ISearchAction extends Action {
  type: SearchActionTypes.SEARCH;
  payload: string;
}

export interface ISearchingAction extends Action {
  type: SearchActionTypes.SEARCHING;
}

export interface ISearchedAction extends Action {
  type: SearchActionTypes.SEARCHED;
  payload: {
    results: any[],
    totalResults: number
  };
}

export interface ISearchingFailedAction extends Action {
  type: SearchActionTypes.SEARCHING_FAILED;
}

// Functions

export function search(text: string): ISearchAction {
  return {
    type: SearchActionTypes.SEARCH,
    payload: text
  };
}

export function searching(): ISearchingAction {
  return {
    type: SearchActionTypes.SEARCHING
  }
}

export function searched(results: any[], totalResults: number): ISearchedAction {
  return {
    type: SearchActionTypes.SEARCHED,
    payload: {
      results,
      totalResults
    }
  }
}

export function searchingFailed(): ISearchingFailedAction {
  return {
    type: SearchActionTypes.SEARCHING_FAILED
  }
}

export type SearchAction =
  ISearchAction |
  ISearchingAction |
  ISearchedAction |
  ISearchingFailedAction;
