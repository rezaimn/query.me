import {
  ApiStatus,
  ICurrentUserPermissions,
  IDatabase,
  IDatabaseSharingSettings,
  IDatabasesMetadata, INotebookPageBlockExecution,
  IParams,
  ISharedWithUser,
} from '../../models';
import {DatabasesAction, DatabasesActionTypes} from '../actions/databaseActions';
import {removeElementFromList, sortElementsInList} from '../../utils/reducers';

export const initialDatabaseState: IDatabaseState = {
  loadingListStatus: ApiStatus.LOADING,
  loadingStatus: ApiStatus.LOADING,
  loadingMetadataStatus: ApiStatus.LOADING,
  creatingStatus: ApiStatus.LOADED,
  removingStatus: ApiStatus.LOADING,
  updatingStatus: ApiStatus.LOADED,
  databases: [],
  canLoadMoreDatabases: false,
  canLoadMoreSchemasForDatabase: false,
  databasesParams: {},
  databasesMetadata: null,
  database: null,
  lastCreatedDatabase: null,
  currentSharingSettings: null,
  currentUserPermissions: null,
}

export interface IDatabaseState {
  loadingListStatus: ApiStatus;
  loadingStatus: ApiStatus;
  loadingMetadataStatus: ApiStatus;
  creatingStatus: ApiStatus;
  updatingStatus: ApiStatus;
  removingStatus: ApiStatus;
  databases: IDatabase[];
  canLoadMoreDatabases: boolean;
  canLoadMoreSchemasForDatabase: boolean;
  databasesParams: IParams | undefined;
  databasesMetadata: IDatabasesMetadata | null;
  database: IDatabase | null;
  lastCreatedDatabase: IDatabase | null;
  currentSharingSettings: IDatabaseSharingSettings | null;
  currentUserPermissions: ICurrentUserPermissions | null;
}

export default function databasesReducer(state: IDatabaseState = initialDatabaseState, action: DatabasesAction): IDatabaseState {
  switch (action.type) {
    case DatabasesActionTypes.CAN_LOAD_MORE_DATABASES:
      return {
        ...state,
        canLoadMoreDatabases: action.payload.canLoadMore
      };
    case DatabasesActionTypes.CAN_LOAD_MORE_SCHEMAS_FOR_DATABASE:
      return {
        ...state,
        canLoadMoreSchemasForDatabase: action.payload.canLoadMoreSchemas
      };
    // List
    case DatabasesActionTypes.LOAD_DATABASES:
    case DatabasesActionTypes.LOADING_DATABASES:
      return {
        ...state,
        loadingListStatus: ApiStatus.LOADING
      };

    case DatabasesActionTypes.LOADING_DATABASES_FAILED:
      return {
        ...state,
        loadingListStatus: ApiStatus.FAILED
      };

    case DatabasesActionTypes.LOADED_DATABASES:
      return {
        ...state,
        loadingListStatus: ApiStatus.LOADED,
        databases: action.payload.reload?action.payload.databases:[...state.databases,...action.payload.databases],
        databasesParams: action.payload.params
      };

    case DatabasesActionTypes.LOAD_DATABASES_METADATA:
    case DatabasesActionTypes.LOADING_DATABASES_METADATA:
      return {
        ...state,
        loadingMetadataStatus: ApiStatus.LOADING
      };

    case DatabasesActionTypes.LOADING_DATABASES_METADATA_FAILED:
      return {
        ...state,
        loadingMetadataStatus: ApiStatus.FAILED
      };

    case DatabasesActionTypes.LOADED_DATABASES_METADATA:
      return {
        ...state,
        loadingMetadataStatus: ApiStatus.LOADED,
        databasesMetadata: action.payload.databasesMetadata
      };

    // Details
    case DatabasesActionTypes.LOAD_DATABASE:
    case DatabasesActionTypes.LOADING_DATABASE:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADING
      };

    case DatabasesActionTypes.LOADING_DATABASE_FAILED:
      return {
        ...state,
        loadingStatus: ApiStatus.FAILED
      };

    case DatabasesActionTypes.LOADED_DATABASE:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADED,
        database: action.payload.database.schemas? {...action.payload.database,
          schemas:[...action.payload.reload ? action.payload.database.schemas :
            [...state?.database?.schemas,...action.payload.database.schemas]]} :
          {...action.payload.database}
      };

    case DatabasesActionTypes.LOADED_DATABASE_SHARING_SETTINGS:
      return {
        ...state,
        currentSharingSettings: action.payload
      };

    case DatabasesActionTypes.LOADED_CURRENT_USER_PERMISSIONS:
      return {
        ...state,
        currentUserPermissions: action.payload
      }

    case DatabasesActionTypes.SHARED_DATABASE_WITH_WORKSPACE:
      return {
        ...state,
        currentSharingSettings: {
          ...state.currentSharingSettings as IDatabaseSharingSettings,
          shared_with_workspace: action.payload?.shared
        }
      }

    case DatabasesActionTypes.SHARED_DATABASE_WITH_USER:
      let sharedWithUsers: ISharedWithUser[] = [];
      if (state.currentSharingSettings?.shared_with_users) {
        const { uid: sharedWithUid, shared: sharedProperties } = action.payload;

        if (!(sharedProperties.edit || sharedProperties.use || sharedProperties.view)) {
          // this means that user was deleted from sharing settings (all are false)
          sharedWithUsers = state.currentSharingSettings?.shared_with_users
            .filter((props: any) => props.uid !== sharedWithUid);
        } else {
          const existingUser = state.currentSharingSettings?.shared_with_users
            .find((props: any) => props.uid === sharedWithUid);
          if (existingUser) {
            // if user already exists in the sharing settings, we update it
            sharedWithUsers = state.currentSharingSettings?.shared_with_users
              .map((props: any) => props.uid === sharedWithUid ?
                { uid: sharedWithUid, ...sharedProperties } :
                { ...props });
          } else {
            // if user does not exists in the sharing settings, we add it
            sharedWithUsers = state.currentSharingSettings?.shared_with_users.map((props: any) => ({ ...props }));
            sharedWithUsers.push({ uid: sharedWithUid, ...sharedProperties });
          }
        }

      }

      return {
        ...state,
        currentSharingSettings: {
          ...state.currentSharingSettings as IDatabaseSharingSettings,
          shared_with_users: [...sharedWithUsers]
        }
      }

    case DatabasesActionTypes.SORT_SCHEMAS_IN_DATABASE:
      return {
        ...state,
        database: state.database ? {
          ...state.database,
          schemas: state.database.schemas ?
            sortElementsInList(state.database.schemas, action.payload.sort) :
            state.database.schemas
        } : state.database
      };

    // Create

    case DatabasesActionTypes.CREATE_DATABASE:
    case DatabasesActionTypes.CREATING_DATABASE:
      return {
        ...state,
        creatingStatus: ApiStatus.LOADING
      };

    case DatabasesActionTypes.CREATING_DATABASE_FAILED:
      return {
        ...state,
        creatingStatus: ApiStatus.FAILED
      };

    case DatabasesActionTypes.CREATED_DATABASE:
      return {
        ...state,
        creatingStatus: ApiStatus.LOADED,
        databases: state.databases ?
          state.databases.concat([ action.payload ]) :
          [ action.payload ],
        lastCreatedDatabase: action.payload
      };

    case DatabasesActionTypes.UNSET_LAST_CREATED_DATABASE:
      return {
        ...state,
        lastCreatedDatabase: action.payload
      }

    // Update

    case DatabasesActionTypes.EDIT_DATABASE:
    case DatabasesActionTypes.EDITING_DATABASE:
      return {
        ...state,
        updatingStatus: ApiStatus.LOADING
      };

    case DatabasesActionTypes.EDITING_DATABASE_FAILED:
      return {
        ...state,
        updatingStatus: ApiStatus.FAILED
      };

    case DatabasesActionTypes.EDITED_DATABASE:
      return {
        ...state,
        updatingStatus: ApiStatus.LOADED,
      };

    // Remove

    case DatabasesActionTypes.REMOVE_DATABASE:
    case DatabasesActionTypes.REMOVING_DATABASE:
      return {
        ...state,
        removingStatus: ApiStatus.LOADING
      };

    case DatabasesActionTypes.REMOVING_DATABASE_FAILED:
      return {
        ...state,
        removingStatus: ApiStatus.FAILED
      };

    case DatabasesActionTypes.REMOVED_DATABASE:
      return {
        ...state,
        removingStatus: ApiStatus.LOADED,
        databases: state.databases ?
          removeElementFromList(state.databases, { uid: action.payload }, 'uid') :
          state.databases
      };

    default:
      return state;
  }
}
