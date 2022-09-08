import { Action } from 'redux';

// Types

export enum ActivitiesActionTypes {
  FETCH = 'activity/fetch',
  FETCHING = 'activity/fetching',
  FETCHED = 'activity/fetched',
  FETCH_FAILED = 'activity/fetching_failed'
}

// Interfaces

export interface IFetchActivitiesAction extends Action {
  type: ActivitiesActionTypes.FETCH;
}

export interface IFetchingActivitiesAction extends Action {
  type: ActivitiesActionTypes.FETCHING;
}

export interface IFetchedActivitiesAction extends Action {
  type: ActivitiesActionTypes.FETCHED;
  payload: {
    results: any[],
    totalResults: number
  };
}

export interface IFetchActivitiesFailedAction extends Action {
  type: ActivitiesActionTypes.FETCH_FAILED;
}

// Functions

export function fetchActivities(): IFetchActivitiesAction {
  return {
    type: ActivitiesActionTypes.FETCH,
  };
}

export function fetchingActivities(): IFetchingActivitiesAction {
  return {
    type: ActivitiesActionTypes.FETCHING,
  }
}

export function fetchedActivities(results: any[], totalResults: number): IFetchedActivitiesAction {
  return {
    type: ActivitiesActionTypes.FETCHED,
    payload: {
      results,
      totalResults
    }
  }
}

export function fetchActivitiesFailed(): IFetchActivitiesFailedAction {
  return {
    type: ActivitiesActionTypes.FETCH_FAILED
  }
}

export type ActivitiesAction =
  IFetchActivitiesAction |
  IFetchingActivitiesAction |
  IFetchedActivitiesAction |
  IFetchActivitiesFailedAction;
