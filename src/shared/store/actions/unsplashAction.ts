import { Action } from 'redux';
import { IUnsplash, IUnsplashImage } from '../../models/Unsplash';


// Types

export enum UnsplashActionTypes {
  UNSPLASH_LOAD = 'all/unsplash/load',
  UNSPLASH_LOAD_SEARCH = 'all/unsplash/search',
  UNSPLASH_LOADING = 'all/unsplash/loading',
  UNSPLASH_LOADED = 'all/unsplash/loaded',
  UNSPLASH_LOADING_FAILED = 'all/unsplash/loading_failed',
  UNSPLASH_RANDOM_LOAD = 'unsplash/random/load',
  UNSPLASH_RANDOM_LOADING = 'unsplash/random/loading',
  UNSPLASH_RANDOM_LOADED = 'unsplash/random/loaded',
  UNSPLASH_RANDOM_LOADING_FAILED = 'unsplash/random/loading_failed'
}

// Interfaces

export interface IUnsplashLoadAction extends Action {
  type: UnsplashActionTypes.UNSPLASH_LOAD;
}

export interface IUnsplashSearchAction extends Action {
  type: UnsplashActionTypes.UNSPLASH_LOAD_SEARCH;
  payload: {
    keyword: string
  };
}

export interface IUnsplashLoadingAction extends Action {
  type: UnsplashActionTypes.UNSPLASH_LOADING;
}

export interface IUnsplashLoadedAction extends Action {
  type: UnsplashActionTypes.UNSPLASH_LOADED;
  payload: IUnsplash;
}

export interface IUnsplashLoadingFailedAction extends Action {
  type: UnsplashActionTypes.UNSPLASH_LOADING_FAILED;
}

export interface IUnsplashRandomLoadAction extends Action {
  type: UnsplashActionTypes.UNSPLASH_RANDOM_LOAD;
}

export interface IUnsplashRandomLoadingAction extends Action {
  type: UnsplashActionTypes.UNSPLASH_RANDOM_LOADING;
}

export interface IUnsplashRandomLoadedAction extends Action {
  type: UnsplashActionTypes.UNSPLASH_RANDOM_LOADED;
  payload: IUnsplashImage | null;
}

export interface IUnsplashRandomLoadingFailedAction extends Action {
  type: UnsplashActionTypes.UNSPLASH_RANDOM_LOADING_FAILED;
}

// Functions

export function unsplashLoad(): IUnsplashLoadAction {
  return {
    type: UnsplashActionTypes.UNSPLASH_LOAD,
  };
}

export function unsplashSearchLoad(keyword: string): IUnsplashSearchAction {
  return {
    type: UnsplashActionTypes.UNSPLASH_LOAD_SEARCH,
    payload: {
      keyword,
    },
  };
}

export function unsplashLoading(): IUnsplashLoadingAction {
  return {
    type: UnsplashActionTypes.UNSPLASH_LOADING,
  };
}

export function unsplashLoaded(results: IUnsplash): IUnsplashLoadedAction {
  return {
    type: UnsplashActionTypes.UNSPLASH_LOADED,
    payload: results,
  };
}

export function unsplashLoadingFailed(): IUnsplashLoadingFailedAction {
  return {
    type: UnsplashActionTypes.UNSPLASH_LOADING_FAILED,
  };
}


export function unsplashRandomLoad(): IUnsplashRandomLoadAction {
  return {
    type: UnsplashActionTypes.UNSPLASH_RANDOM_LOAD,
  };
}

export function unsplashRandomLoading(): IUnsplashRandomLoadingAction {
  return {
    type: UnsplashActionTypes.UNSPLASH_RANDOM_LOADING,
  };
}

export function unsplashRandomLoaded(image: IUnsplashImage): IUnsplashRandomLoadedAction {
  return {
    type: UnsplashActionTypes.UNSPLASH_RANDOM_LOADED,
    payload: image,
  };
}

export function unsplashRandomLoadingFailed(): IUnsplashRandomLoadingFailedAction {
  return {
    type: UnsplashActionTypes.UNSPLASH_RANDOM_LOADING_FAILED,
  };
}

export type UnsplashAction =
  IUnsplashLoadAction |
  IUnsplashSearchAction |
  IUnsplashLoadingAction |
  IUnsplashLoadedAction |
  IUnsplashLoadingFailedAction |
  IUnsplashRandomLoadAction |
  IUnsplashRandomLoadingAction |
  IUnsplashRandomLoadedAction |
  IUnsplashRandomLoadingFailedAction;
