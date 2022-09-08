import { ApiStatus } from '../../models';
import { UnsplashAction, UnsplashActionTypes } from '../actions/unsplashAction';
import { IUnsplash, IUnsplashImage } from '../../models/Unsplash';

export const initialUnsplashState: IUnsplashState = {
  loadingStatus: ApiStatus.LOADING,
  unsplashImageList: { results: [], total: 0 },
  unsplashRandom: null,
};

export interface IUnsplashState {
  loadingStatus: ApiStatus;
  unsplashImageList: IUnsplash;
  unsplashRandom: IUnsplashImage | null;
}

export default function unsplashReducer(state: IUnsplashState = initialUnsplashState, action: UnsplashAction): IUnsplashState {
  switch (action.type) {
    case UnsplashActionTypes.UNSPLASH_LOAD:
    case UnsplashActionTypes.UNSPLASH_LOADING:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADING,
      };

    case UnsplashActionTypes.UNSPLASH_LOADING_FAILED:
      return {
        ...state,
        loadingStatus: ApiStatus.FAILED,
      };

    case UnsplashActionTypes.UNSPLASH_LOADED:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADED,
        unsplashImageList: action.payload,
      };

    case UnsplashActionTypes.UNSPLASH_RANDOM_LOAD:
    case UnsplashActionTypes.UNSPLASH_RANDOM_LOADING:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADING,
      };

    case UnsplashActionTypes.UNSPLASH_RANDOM_LOADING_FAILED:
      return {
        ...state,
        loadingStatus: ApiStatus.FAILED,
      };

    case UnsplashActionTypes.UNSPLASH_RANDOM_LOADED:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADED,
        unsplashRandom: action.payload,
      };
    default:
      return state;
  }
}
