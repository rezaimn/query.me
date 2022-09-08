import {ApiStatus} from '../../models';
import {EditorAction, EditorTypes} from '../actions/editorActions';
import { getResultType } from "../../utils/elasticsearch";

interface IMetadata {
  [key: string]: any[]
}

export const initialEditorState: IEditorState = {
  loadingMetadata: ApiStatus.LOADED,
  metadata: null, // used for Autocomplete
}

export interface IEditorState {
  loadingMetadata: ApiStatus;
  metadata: IMetadata | null; // used for Autocomplete
}

const parseMetadata = (payload: any) => {
  const getScore = (type: string) => {
    switch (type) {
      case 'database':
        return 100;
      case 'schema':
        return 50;
      case 'table':
      case 'view':
        return 25;
      case 'column':
        return 10;
    }

  };

  return payload.result?.map((item: any) => {
    let type = getResultType(item);

    return {
      name: item.name || '',
      type: type === 'table' ? item.type : type, // in order to differentiate tables / views
      score: getScore(type)
    }
  });
}

export default function editorReducer(
  state: IEditorState = initialEditorState,
  action: EditorAction): IEditorState {

  switch (action.type) {
    case EditorTypes.LOAD_DATABASE_METADATA:
    case EditorTypes.LOADING_DATABASE_METADATA:
      return {
        ...state,
        loadingMetadata: ApiStatus.LOADING,
      };

    case EditorTypes.LOADED_DATABASE_METADATA:
      const databases = action.payload;

      let metadata = state.metadata;
      databases.forEach((database: any) => {
        const uid = Object.keys(database)[0];

        metadata = {
          ...metadata,
          [uid]: parseMetadata(database[uid])
        }
      });

      return {
        ...state,
        loadingMetadata: ApiStatus.LOADED,
        metadata: metadata
      }

    case EditorTypes.LOADING_DATABASE_METADATA_FAILED:
      return {
        ...state,
        loadingMetadata: ApiStatus.FAILED,
      }

    case EditorTypes.CLEAR_METADATA:
      return {
        ...state,
        metadata: null
      }

    default:
      return state;
  }
};
