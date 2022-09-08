import { UiActionTypes, UiAction } from '../actions/uiActions';

export const initialUiState: IUiState = {
  headerKind: 'default',
  headerProperties: {},
  backgroundKind: 'default',
  isFullScreen: false,
}

export interface IUiState {
  headerKind: string;
  headerProperties: { [key: string]: string | boolean };
  backgroundKind: string;
  isFullScreen: boolean;
}

export default function queriesReducer(state: IUiState = initialUiState, action: UiAction): IUiState {
  switch (action.type) {
    case UiActionTypes.SELECT_HEADER:
      return {
        ...state,
        headerKind: action.payload.header,
        headerProperties: state.headerProperties ? {
          ...state.headerProperties,
          ...action.payload.properties,
        } : action.payload.properties
      };

    case UiActionTypes.SELECT_HEADER_TITLE:
      return {
        ...state,
        headerProperties: state.headerProperties ? {
          ...state.headerProperties,
          ...action.payload
        } : {
          ...action.payload
        }
      };

    case UiActionTypes.RESET_HEADER:
      return {
        ...state,
        headerKind: 'default',
        headerProperties: {}
      };

    case UiActionTypes.SELECT_LEFT_PANEL_BACKGROUND:
      return {
        ...state,
        backgroundKind: action.payload.background
      };

    case UiActionTypes.RESET_LEFT_PANEL_BACKGROUND:
      return {
        ...state,
        backgroundKind: 'default'
      };
    case UiActionTypes.SET_IS_FULL_SCREEN:
      return {
        ...state,
        isFullScreen: action.payload.isFullScreen
      };

    default:
      return state;
  }
}
