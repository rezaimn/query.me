import { Action } from 'redux';
import { IView, IViewForCreation } from '../../models';

// Types

export enum ViewsActionTypes {
  LOAD_VIEWS = 'views/load',
  LOADING_VIEWS = 'views/loading',
  LOADED_VIEWS = 'views/loaded',
  LOADING_VIEWS_FAILED = 'views/loading_failed',
  LOAD_VIEW = 'view/load',
  LOADING_VIEW = 'view/loading',
  LOADED_VIEW = 'view/loaded',
  LOADING_VIEW_FAILED = 'view/loading_failed',
  CLEAR_VIEW = 'view/clear',
  CREATE_VIEW = 'view/create',
  CREATING_VIEW = 'view/creating',
  CREATED_VIEW = 'view/created',
  CREATING_VIEW_FAILED = 'view/creating_failed',
  SAVE_VIEW = 'view/save',
  SAVING_VIEW = 'view/saving',
  SAVED_VIEW = 'view/saved',
  SAVING_VIEW_FAILED = 'view/saving_failed',
  REMOVE_VIEW = 'view/remove',
  REMOVING_VIEW = 'view/removing',
  REMOVED_VIEW = 'view/removed',
  REMOVING_VIEW_FAILED = 'view/removing_failed'
}

// Interfaces

export interface ILoadViewsAction extends Action {
  type: ViewsActionTypes.LOAD_VIEWS;
  payload: string;
}

export interface ILoadingViewsAction extends Action {
  type: ViewsActionTypes.LOADING_VIEWS;
}

export interface ILoadedViewsAction extends Action {
  type: ViewsActionTypes.LOADED_VIEWS;
  payload: {
    views: IView[]
  };
}

export interface ILoadingViewsFailedAction extends Action {
  type: ViewsActionTypes.LOADING_VIEWS_FAILED;
}

export interface ILoadViewAction extends Action {
  type: ViewsActionTypes.LOAD_VIEW;
  payload: number;
}

export interface ILoadingViewAction extends Action {
  type: ViewsActionTypes.LOADING_VIEW;
  payload: number;
}

export interface ILoadedViewAction extends Action {
  type: ViewsActionTypes.LOADED_VIEW;
  payload: {
    view: IView
  };
}

export interface ILoadingViewFailedAction extends Action {
  type: ViewsActionTypes.LOADING_VIEW_FAILED;
}

export interface IClearViewAction extends Action {
  type: ViewsActionTypes.CLEAR_VIEW;
}

export interface ICreateViewAction extends Action {
  type: ViewsActionTypes.CREATE_VIEW;
  payload: IViewForCreation;
}

export interface ICreatingViewAction extends Action {
  type: ViewsActionTypes.CREATING_VIEW;
  payload: IViewForCreation;
}

export interface ICreatedViewAction extends Action {
  type: ViewsActionTypes.CREATED_VIEW;
  payload: IView;
}

export interface ICreatingViewFailedAction extends Action {
  type: ViewsActionTypes.CREATING_VIEW_FAILED;
}

export interface ISaveViewAction extends Action {
  type: ViewsActionTypes.SAVE_VIEW;
  payload: {
    id: number;
    view: IView;
  }
}

export interface ISavingViewAction extends Action {
  type: ViewsActionTypes.SAVING_VIEW;
  payload: {
    id: number;
    view: IView;
  }
}

export interface ISavedViewAction extends Action {
  type: ViewsActionTypes.SAVED_VIEW;
  payload: {
    view: IView
  };
}

export interface ISavingViewFailedAction extends Action {
  type: ViewsActionTypes.SAVING_VIEW_FAILED;
}

export interface IRemoveViewAction extends Action {
  type: ViewsActionTypes.REMOVE_VIEW;
  payload: number;
}

export interface IRemovingViewAction extends Action {
  type: ViewsActionTypes.REMOVING_VIEW;
  payload: number;
}

export interface IRemovedViewAction extends Action {
  type: ViewsActionTypes.REMOVED_VIEW;
  payload: number;
}

export interface IRemovingViewFailedAction extends Action {
  type: ViewsActionTypes.REMOVING_VIEW_FAILED;
}

// Functions

export function loadViews(type: string): ILoadViewsAction {
  return {
    type: ViewsActionTypes.LOAD_VIEWS,
    payload: type
  }
}

export function loadingViews(): ILoadingViewsAction {
  return {
    type: ViewsActionTypes.LOADING_VIEWS
  }
}

export function loadedViews(views: IView[]): ILoadedViewsAction {
  return {
    type: ViewsActionTypes.LOADED_VIEWS,
    payload: {
      views
    }
  }
}

export function loadingViewsFailed(): ILoadingViewsFailedAction {
  return {
    type: ViewsActionTypes.LOADING_VIEWS_FAILED
  }
}

export function loadView(id: number): ILoadViewAction {
  return {
    type: ViewsActionTypes.LOAD_VIEW,
    payload: id
  }
}

export function loadingView(id: number): ILoadingViewAction {
  return {
    type: ViewsActionTypes.LOADING_VIEW,
    payload: id
  }
}

export function loadedView(view: IView): ILoadedViewAction {
  return {
    type: ViewsActionTypes.LOADED_VIEW,
    payload: {
      view
    }
  }
}

export function loadingViewFailed(): ILoadingViewFailedAction {
  return {
    type: ViewsActionTypes.LOADING_VIEW_FAILED
  }
}

export function clearView(): IClearViewAction {
  return {
    type: ViewsActionTypes.CLEAR_VIEW
  }
}

export function createView(view: IViewForCreation): ICreateViewAction {
  return {
    type: ViewsActionTypes.CREATE_VIEW,
    payload: view
  }
}

export function creatingView(view: IViewForCreation): ICreatingViewAction {
  return {
    type: ViewsActionTypes.CREATING_VIEW,
    payload: view
  }
}

export function createdView(view: IView): ICreatedViewAction {
  return {
    type: ViewsActionTypes.CREATED_VIEW,
    payload: view
  }
}

export function creatingViewFailed(): ICreatingViewFailedAction {
  return {
    type: ViewsActionTypes.CREATING_VIEW_FAILED
  }
}

export function saveView(id: number, view: IView): ISaveViewAction {
  return {
    type: ViewsActionTypes.SAVE_VIEW,
    payload: {
      id,
      view
    }
  }
}

export function savingView(id: number, view: IView): ISavingViewAction {
  return {
    type: ViewsActionTypes.SAVING_VIEW,
    payload: {
      id,
      view
    }
  }
}

export function savedView(view: IView): ISavedViewAction {
  return {
    type: ViewsActionTypes.SAVED_VIEW,
    payload: {
      view
    }
  }
}

export function savingViewFailed(): ISavingViewFailedAction {
  return {
    type: ViewsActionTypes.SAVING_VIEW_FAILED
  }
}

export function removeView(id: number): IRemoveViewAction {
  return {
    type: ViewsActionTypes.REMOVE_VIEW,
    payload: id
  }
}

export function removingView(id: number): IRemovingViewAction {
  return {
    type: ViewsActionTypes.REMOVING_VIEW,
    payload: id
  }
}

export function removedView(id: number): IRemovedViewAction {
  return {
    type: ViewsActionTypes.REMOVED_VIEW,
    payload: id
  }
}

export function removingViewFailed(): IRemovingViewFailedAction {
  return {
    type: ViewsActionTypes.REMOVING_VIEW_FAILED
  }
}

export type ViewsAction =
  ILoadViewsAction |
  ILoadingViewsAction |
  ILoadedViewsAction |
  ILoadingViewsFailedAction |
  ILoadViewAction |
  ILoadingViewAction |
  ILoadedViewAction |
  ILoadingViewFailedAction |
  IClearViewAction |
  ICreateViewAction |
  ICreatingViewAction |
  ICreatedViewAction |
  ICreatingViewFailedAction |
  ISaveViewAction |
  ISavingViewAction |
  ISavedViewAction |
  ISavingViewFailedAction |
  IRemoveViewAction |
  IRemovingViewAction |
  IRemovedViewAction |
  IRemovingViewFailedAction;
