import { Action } from 'redux';

export enum UiActionTypes {
  SELECT_HEADER = 'ui/selectHeader',
  SELECT_HEADER_TITLE = 'ui/selectHeaderTitle',
  RESET_HEADER = 'ui/resetHeader',
  SELECT_LEFT_PANEL_BACKGROUND = 'ui/selectLeftPanelBackground',
  RESET_LEFT_PANEL_BACKGROUND = 'ui/resetLeftPanelBackground',
  SET_IS_FULL_SCREEN = 'ui/setIsFullScreen'
}

export interface ISelectHeaderAction extends Action {
  type: UiActionTypes.SELECT_HEADER;
  payload: {
    header: string;
    properties: { [key: string]: string | boolean };
  }
}

export interface ISelectHeaderTitleAction extends Action {
  type: UiActionTypes.SELECT_HEADER_TITLE;
  payload: { title: string; elementId: string };
}

export interface IResetHeaderAction extends Action {
  type: UiActionTypes.RESET_HEADER;
}

export interface ISelectLeftPanelBackgroundAction extends Action {
  type: UiActionTypes.SELECT_LEFT_PANEL_BACKGROUND;
  payload: {
    background: string;
  }
}

export interface ISetIsFullScreenAction extends Action {
  type: UiActionTypes.SET_IS_FULL_SCREEN;
  payload: {
    isFullScreen: boolean;
  }
}

export interface IResetLeftPanelBackgroundAction extends Action {
  type: UiActionTypes.RESET_LEFT_PANEL_BACKGROUND;
}

export function selectHeader(header: string, properties?: { [key: string]: string | boolean }): ISelectHeaderAction {
  return {
    type: UiActionTypes.SELECT_HEADER,
    payload: {
      header,
      properties: properties || {}
    }
  }
}

export function selectHeaderTitle(title: string, elementId: string): ISelectHeaderTitleAction {
  return {
    type: UiActionTypes.SELECT_HEADER_TITLE,
    payload: {
      title,
      elementId
    }
  }
}

export function resetHeader(): IResetHeaderAction {
  return {
    type: UiActionTypes.RESET_HEADER
  }
}

export function selectLeftPanelBackground(background: string): ISelectLeftPanelBackgroundAction {
  return {
    type: UiActionTypes.SELECT_LEFT_PANEL_BACKGROUND,
    payload: {
      background
    }
  }
}

export function setIsFullScreen(isFullScreen: boolean): ISetIsFullScreenAction {
  return {
    type: UiActionTypes.SET_IS_FULL_SCREEN,
    payload: {
      isFullScreen
    }
  }
}

export function resetLeftPanelBackground(): IResetLeftPanelBackgroundAction {
  return {
    type: UiActionTypes.RESET_LEFT_PANEL_BACKGROUND
  }
}

export type UiAction =
  ISelectHeaderAction |
  ISelectHeaderTitleAction |
  IResetHeaderAction |
  ISelectLeftPanelBackgroundAction |
  IResetLeftPanelBackgroundAction |
  ISetIsFullScreenAction;
