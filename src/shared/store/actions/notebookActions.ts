import {INotebookPageBlock} from './../../models/Notebook';
import {Action} from 'redux';
import {
  INotebook,
  INotebooksMetadata,
  INotebookForCreation,
  ICommentThreadForCreation,
  ICommentForCreationWithoutCommentThreadId,
  ICommentThreadForUpdate,
  ICommentThread,
  ICommentForCreation,
  IComment,
  INotebookPage,
  INotebookPageForCreation,
  INotebookPageBlockExecution,
  IFilter,
  IParams,
  IParamsFilter,
  ISort,
  IUser
} from '../../models';
import { GetNotebooksType } from '../../../features/notebooks/constants';

// Types

export enum NotebooksActionTypes {
  LOAD_NOTEBOOKS = 'notebooks/load',
  CAN_LOAD_MORE_NOTEBOOKS = 'notebooks/can_load_more',
  LOADING_NOTEBOOKS = 'notebooks/loading',
  LOADED_NOTEBOOKS = 'notebooks/loaded',
  LOADING_NOTEBOOKS_FAILED = 'notebooks/loading_failed',
  LOAD_NOTEBOOKS_METADATA = 'notebooks/load_metadata',
  LOADING_NOTEBOOKS_METADATA = 'notebooks/loading_metadata',
  LOADED_NOTEBOOKS_METADATA = 'notebooks/loaded_metadata',
  LOADING_NOTEBOOKS_METADATA_FAILED = 'notebooks/loading_metadata_failed',
  LOAD_NOTEBOOK = 'notebook/load',
  LOADING_NOTEBOOK = 'notebook/loading',
  LOADED_NOTEBOOK = 'notebook/loaded',
  LOADING_NOTEBOOK_FAILED = 'notebook/loading_failed',
  UNSET_NOTEBOOK = 'notebook/unset_notebook',
  LOAD_NOTEBOOK_ALIAS = 'notebook/load_alias', // by name
  LOADING_NOTEBOOK_ALIAS = 'notebook/loading_alias',
  LOADED_NOTEBOOK_ALIAS = 'notebook/loaded_alias',
  LOADING_NOTEBOOK_ALIAS_FAILED = 'notebook/load_alias_failed',
  LOAD_NOTEBOOK_SHARING_SETTINGS = 'notebook/load_sharing_settings',
  LOADING_NOTEBOOK_SHARING_SETTINGS = 'notebook/loading_sharing_settings',
  LOADED_NOTEBOOK_SHARING_SETTINGS = 'notebook/loaded_sharing_settings',
  LOADING_NOTEBOOK_SHARING_SETTINGS_FAILED = 'notebook/loading_sharing_settings_failed',
  LOAD_CURRENT_USER_PERMISSIONS = 'notebook/load_current_user_permissions',
  LOADING_CURRENT_USER_PERMISSIONS = 'notebook/loading_current_user_permissions',
  LOADED_CURRENT_USER_PERMISSIONS = 'notebook/loaded_current_user_permissions',
  LOADING_CURRENT_USER_PERMISSIONS_FAILED = 'notebook/loading_current_user_permissions_failed',
  CREATE_NOTEBOOK = 'notebook/create',
  CREATING_NOTEBOOK = 'notebook/creating',
  CREATED_NOTEBOOK = 'notebook/created',
  CREATING_NOTEBOOK_FAILED = 'notebook/creating_failed',
  CREATE_COMMENT_THREAD = 'comment-thread/create',
  CREATING_COMMENT_THREAD = 'comment-thread/creating',
  CREATED_COMMENT_THREAD = 'comment-thread/created',
  CREATING_COMMENT_THREAD_FAILED = 'comment-thread/creating_failed',
  UPDATE_COMMENT_THREAD = 'comment-thread/update',
  SAVED_COMMENT_THREAD = 'comment-thread/saved',
  SAVING_COMMENT_THREAD = 'comment-thread/saving',
  SAVING_COMMENT_THREAD_FAILED = 'comment-thread/saving_failed',
  CREATE_COMMENT = 'comment/create',
  CREATING_COMMENT = 'comment/creating',
  CREATED_COMMENT = 'comment/created',
  CREATING_COMMENT_FAILED = 'comment/creating_failed',
  DELETE_COMMENT = 'comment/delete',
  DELETING_COMMENT = 'comment/deleting',
  DELETED_COMMENT = 'comment/deleted',
  DELETING_COMMENT_FAILED = 'comment/deleting_failed',
  UPDATE_COMMENT = 'comment/update',
  UPDATING_COMMENT = 'comment/updating',
  UPDATED_COMMENT = 'comment/updated',
  UPDATING_COMMENT_FAILED = 'comment/updating_failed',
  SAVE_NOTEBOOK = 'notebook/save',
  SAVING_NOTEBOOK = 'notebook/saving',
  SAVED_NOTEBOOK = 'notebook/saved',
  SAVING_NOTEBOOK_FAILED = 'notebook/saving_failed',
  REMOVE_NOTEBOOK = 'notebook/remove',
  REMOVING_NOTEBOOK = 'notebook/removing',
  REMOVED_NOTEBOOK = 'notebook/removed',
  REMOVING_NOTEBOOK_FAILED = 'notebook/removing_failed',
  DUPLICATE_NOTEBOOK = 'notebook/duplicate_notebook',
  DUPLICATING_NOTEBOOK = 'notebook/duplicating_notebook',
  DUPLICATED_NOTEBOOK = 'notebook/duplicated_notebook',
  DUPLICATING_NOTEBOOK_FAILED = 'notebook/duplicated_notebook_failed',
  UNSET_DUPLICATED_NOTEBOOK = 'notebook/unset_duplicated_notebook',
  EXECUTE_NOTEBOOK = 'notebook/execute',
  EXECUTING_NOTEBOOK = 'notebook/executing',
  EXECUTED_NOTEBOOK = 'notebook/executed',
  EXECUTING_NOTEBOOK_FAILED = 'notebook/executing_failed',
  TOGGLE_CONFIG_VIEW = 'notebook/toggle-config-view',
  SHARE_NOTEBOOK_WITH_USER = 'notebook/share_with_user',
  SHARING_NOTEBOOK_WITH_USER = 'notebook/sharing_with_user',
  SHARED_NOTEBOOK_WITH_USER = 'notebook/shared_with_user',
  SHARING_NOTEBOOK_WITH_USER_FAILED = 'notebook/sharing_with_user_failed',
  SHARED_NOTEBOOK_WITH_PUBLIC = 'notebook/shared_with_public',
  SHARE_NOTEBOOK_WITH_WORKSPACE = 'notebook/share_with_workspace',
  SHARING_NOTEBOOK_WITH_WORKSPACE = 'notebook/sharing_with_workspace',
  SHARED_NOTEBOOK_WITH_WORKSPACE = 'notebook/shared_with_workspace',
  SHARING_NOTEBOOK_WITH_WORKSPACE_FAILED = 'notebook/sharing_with_workspace_failed',
  SELECT_NOTEBOOK_PAGE = 'notebook-page/select',
  CREATE_NOTEBOOK_PAGE = 'notebook-page/create',
  CREATING_NOTEBOOK_PAGE = 'notebook-page/creating',
  CREATED_NOTEBOOK_PAGE = 'notebook-page/created',
  CREATING_NOTEBOOK_PAGE_FAILED = 'notebook-page/creating_failed',
  SAVE_NOTEBOOK_PAGE = 'notebook-page/save',
  SAVING_NOTEBOOK_PAGE = 'notebook-page/saving',
  SAVED_NOTEBOOK_PAGE = 'notebook-page/saved',
  SAVING_NOTEBOOK_PAGE_FAILED = 'notebook-page/saving_failed',
  UPDATE_NOTEBOOK_PAGE = 'notebook-page/update',
  REMOVE_NOTEBOOK_PAGE = 'notebook-page/remove',
  REMOVING_NOTEBOOK_PAGE = 'notebook-page/removing',
  REMOVED_NOTEBOOK_PAGE = 'notebook-page/removed',
  REMOVING_NOTEBOOK_PAGE_FAILED = 'notebook-page/removing_failed',
  EXECUTE_NOTEBOOK_PAGE = 'notebook-page/execute',
  EXECUTING_NOTEBOOK_PAGE = 'notebook-page/executing',
  EXECUTED_NOTEBOOK_PAGE = 'notebook-page/executed',
  EXECUTING_NOTEBOOK_PAGE_FAILED = 'notebook-page/executing_failed',
  SELECT_NOTEBOOK_PAGE_BLOCK = 'notebook-page-block/select',
  SAVE_NOTEBOOK_PAGE_BLOCKS = 'notebook-page-blocks/save',
  SAVING_NOTEBOOK_PAGE_BLOCKS = 'notebook-page-blocks/saving',
  SAVED_NOTEBOOK_PAGE_BLOCKS = 'notebook-page-blocks/saved',
  SAVING_NOTEBOOK_PAGE_BLOCKS_FAILED = 'notebook-page-blocks/saving_failed',
  SAVE_NOTEBOOK_PAGE_BLOCK = 'notebook-page-block/save',
  SAVING_NOTEBOOK_PAGE_BLOCK = 'notebook-page-block/saving',
  SAVED_NOTEBOOK_PAGE_BLOCK = 'notebook-page-block/saved',
  SAVING_NOTEBOOK_PAGE_BLOCK_FAILED = 'notebook-page-block/saving_failed',
  EXECUTED_NOTEBOOK_PAGE_BLOCK = 'notebook-page-block/executed',
  UPDATED_NOTEBOOK_PAGE_BLOCK_EXECUTION = 'notebook-page-block-execution/updated',
  SAVE_NOTEBOOK_PAGES_POSITION = 'notebook-page-position/save',
  SAVING_NOTEBOOK_PAGES_POSITION = 'notebook-page-position/saving',
  SAVED_NOTEBOOK_PAGES_POSITION = 'notebook-page-position/saved',
  SAVING_NOTEBOOK_PAGES_POSITION_FAILED = 'notebook-page-position/saving_failed',
  MOVED_NOTEBOOK_PAGE_BLOCK_SUCCESS = 'notebook-page-move-block/saved',
  CTRL_PLUS_DOT_SELECTED = 'notebook-page-block/ctrl_dot_selected'
}

// Interfaces

export interface ILoadNotebooksAction extends Action {
  type: NotebooksActionTypes.LOAD_NOTEBOOKS;
  payload: {
    viewId: number | undefined;
    filters?: IParamsFilter[] | undefined;
    sort?: ISort;
    page?: number | undefined;
    page_size?: number | undefined;
    reload?:boolean;
    type?: GetNotebooksType;
  };
}

export interface ICanLoadMoreNotebooksAction extends Action {
  type: NotebooksActionTypes.CAN_LOAD_MORE_NOTEBOOKS;
  payload: {
    canLoadMore:boolean;
  };
}

export interface ILoadingNotebooksAction extends Action {
  type: NotebooksActionTypes.LOADING_NOTEBOOKS;
}

export interface ILoadedNotebooksAction extends Action {
  type: NotebooksActionTypes.LOADED_NOTEBOOKS;
  payload: {
    notebooks: INotebook[];
    params: IParams | undefined;
    reload?: boolean;
  };
}

export interface ILoadingNotebooksFailedAction extends Action {
  type: NotebooksActionTypes.LOADING_NOTEBOOKS_FAILED;
}

export interface IUnsetNotebookAction extends Action {
  type: NotebooksActionTypes.UNSET_NOTEBOOK;
  payload: null;
}

export interface ILoadNotebooksMetadataAction extends Action {
  type: NotebooksActionTypes.LOAD_NOTEBOOKS_METADATA;
}

export interface ILoadingNotebooksMetadataAction extends Action {
  type: NotebooksActionTypes.LOADING_NOTEBOOKS_METADATA;
}

export interface ILoadedNotebooksMetadataAction extends Action {
  type: NotebooksActionTypes.LOADED_NOTEBOOKS_METADATA;
  payload: {
    notebooksMetadata: INotebooksMetadata
  };
}

export interface ILoadingNotebooksMetadataFailedAction extends Action {
  type: NotebooksActionTypes.LOADING_NOTEBOOKS_METADATA_FAILED;
}

export interface ILoadNotebookAction extends Action {
  type: NotebooksActionTypes.LOAD_NOTEBOOK;
  payload: {
    notebookId: string;
    pageId?: string;
  };
}

export interface ILoadingNotebookAction extends Action {
  type: NotebooksActionTypes.LOADING_NOTEBOOK;
  payload: {
    notebookId: string;
    pageId?: string;
  };
}

export interface ILoadedNotebookAction extends Action {
  type: NotebooksActionTypes.LOADED_NOTEBOOK;
  payload: {
    notebook: INotebook;
    pageId?: string;
  };
}

export interface ILoadingNotebookFailedAction extends Action {
  type: NotebooksActionTypes.LOADING_NOTEBOOK_FAILED;
}

export function unsetNotebook(): IUnsetNotebookAction {
  return {
    type: NotebooksActionTypes.UNSET_NOTEBOOK,
    payload: null,
  }
}

export interface ILoadNotebookAliasAction extends Action {
  type: NotebooksActionTypes.LOAD_NOTEBOOK_ALIAS;
  payload: string;
}

export interface ILoadingNotebookAliasAction extends Action {
  type: NotebooksActionTypes.LOADING_NOTEBOOK_ALIAS;
}

export interface ILoadedNotebookAliasAction extends Action {
  type: NotebooksActionTypes.LOADED_NOTEBOOK_ALIAS;
  payload: any;
}

export interface ILoadingNotebookAliasFailedAction extends Action {
  type: NotebooksActionTypes.LOADING_NOTEBOOK_ALIAS_FAILED;
}

export interface ILoadNotebookSharingSettingsAction extends Action {
  type: NotebooksActionTypes.LOAD_NOTEBOOK_SHARING_SETTINGS;
  payload: string;
}

export interface ILoadingNotebookSharingSettingsAction extends Action {
  type: NotebooksActionTypes.LOADING_NOTEBOOK_SHARING_SETTINGS;
}

export interface ILoadedNotebookSharingSettingsAction extends Action {
  type: NotebooksActionTypes.LOADED_NOTEBOOK_SHARING_SETTINGS;
  payload: any;
}

export interface ILoadingNotebookSharingSettingsFailedAction extends Action {
  type: NotebooksActionTypes.LOADING_NOTEBOOK_SHARING_SETTINGS_FAILED;
}

export interface ILoadCurrentUserPermissionsAction extends Action {
  type: NotebooksActionTypes.LOAD_CURRENT_USER_PERMISSIONS;
  payload: {
    uid: string;
    userId: string;
  }
}

export interface ILoadingCurrentUserPermissionsAction extends Action {
  type: NotebooksActionTypes.LOADING_CURRENT_USER_PERMISSIONS;
}

export interface ILoadedCurrentUserPermissionsAction extends Action {
  type: NotebooksActionTypes.LOADED_CURRENT_USER_PERMISSIONS;
  payload: any;
}

export interface ILoadingCurrentUserPermissionsFailedAction extends Action {
  type: NotebooksActionTypes.LOADING_CURRENT_USER_PERMISSIONS_FAILED;
}

export interface ICreateNotebookAction extends Action {
  type: NotebooksActionTypes.CREATE_NOTEBOOK;
  payload: INotebookForCreation;
}

export interface ICreateCommentThreadAction extends Action {
  type: NotebooksActionTypes.CREATE_COMMENT_THREAD;
  payload: {
    commentThread: ICommentThreadForCreation,
    comment: ICommentForCreationWithoutCommentThreadId

  };
}

export interface ISavedCommentThreadAction extends Action {
  type: NotebooksActionTypes.SAVED_COMMENT_THREAD;
  payload: {
    commentThread: ICommentThread
  };
}

export interface ICreatedCommentThreadAction extends Action {
  type: NotebooksActionTypes.CREATED_COMMENT_THREAD;
  payload: ICommentThread;
}

export interface ICreatingCommentThreadAction extends Action {
  type: NotebooksActionTypes.CREATING_COMMENT_THREAD;
  payload: ICommentThreadForCreation;
}

export interface ICreatingCommentThreadFailedAction extends Action {
  type: NotebooksActionTypes.CREATING_COMMENT_THREAD_FAILED;
}

export interface IUpdateCommentThreadAction extends Action {
  type: NotebooksActionTypes.UPDATE_COMMENT_THREAD;
  payload: {
    id: number,
    uid: string,
    commentThread: ICommentThreadForUpdate,
  };
}

export interface ISavingCommentThreadAction extends Action {
  type: NotebooksActionTypes.SAVING_COMMENT_THREAD;
  payload: {
    id: number;
    uid: string;
    commentThread: ICommentThreadForUpdate;
  }
}

export interface ISavingCommentThreadFailedAction extends Action {
  type: NotebooksActionTypes.SAVING_COMMENT_THREAD_FAILED;
}

export interface ICreateCommentAction extends Action {
  type: NotebooksActionTypes.CREATE_COMMENT;
  payload: {
    comment: ICommentForCreation
  };
}

export interface ICreatedCommentAction extends Action {
  type: NotebooksActionTypes.CREATED_COMMENT;
  payload: { comment: IComment, user: any };
}

export interface ICreatingCommentAction extends Action {
  type: NotebooksActionTypes.CREATING_COMMENT;
  payload: ICommentForCreation;
}

export interface ICreatingCommentFailedAction extends Action {
  type: NotebooksActionTypes.CREATING_COMMENT_FAILED;
}

export interface IDeleteCommentAction extends Action {
  type: NotebooksActionTypes.DELETE_COMMENT;
  payload: {
    commentUid: string;
    commentThread: ICommentThread;
    blockUid: string;
    pageUid: string;
    notebookUid: string;
  };
}

export interface IDeletedCommentAction extends Action {
  type: NotebooksActionTypes.DELETED_COMMENT;
  payload: {
    commentUid: string;
    commentThread: ICommentThread;
    blockUid: string;
    pageUid: string;
    notebookUid: string;
  };
}

export interface IDeletingCommentAction extends Action {
  type: NotebooksActionTypes.DELETING_COMMENT;
  payload: {
    commentUid: string;
  };
}

export interface IDeletingCommentFailedAction extends Action {
  type: NotebooksActionTypes.DELETING_COMMENT_FAILED;
}

export interface IUpdateCommentAction extends Action {
  type: NotebooksActionTypes.UPDATE_COMMENT;
  payload: {
    comment: IComment,
    commentThread: ICommentThread;
    blockUid: string;
    pageUid: string;
    notebookUid: string;
  };
}

export interface IUpdatedCommentAction extends Action {
  type: NotebooksActionTypes.UPDATED_COMMENT;
  payload: {
    comment: IComment,
    commentThread: ICommentThread;
    blockUid: string;
    pageUid: string;
    notebookUid: string;
  };
}

export interface IUpdatingCommentAction extends Action {
  type: NotebooksActionTypes.UPDATING_COMMENT;
  payload: {
    comment: IComment,
  };
}

export interface IUpdatingCommentFailedAction extends Action {
  type: NotebooksActionTypes.UPDATING_COMMENT_FAILED;
}


export interface ICreatingNotebookAction extends Action {
  type: NotebooksActionTypes.CREATING_NOTEBOOK;
  payload: INotebookForCreation;
}

export interface ICreatedNotebookAction extends Action {
  type: NotebooksActionTypes.CREATED_NOTEBOOK;
  payload: INotebook;
}

export interface ICreatingNotebookFailedAction extends Action {
  type: NotebooksActionTypes.CREATING_NOTEBOOK_FAILED;
}

export interface ISaveNotebookAction extends Action {
  type: NotebooksActionTypes.SAVE_NOTEBOOK;
  payload: {
    id: string;
    notebook: Partial<INotebook>;
  }
}

export interface ISavingNotebookAction extends Action {
  type: NotebooksActionTypes.SAVING_NOTEBOOK;
  payload: {
    id: string;
    notebook: Partial<INotebook>;
  }
}

export interface ISavedNotebookAction extends Action {
  type: NotebooksActionTypes.SAVED_NOTEBOOK;
  payload: {
    notebook: INotebook
  };
}

export interface ISavingNotebookFailedAction extends Action {
  type: NotebooksActionTypes.SAVING_NOTEBOOK_FAILED;
}

export interface IRemoveNotebookAction extends Action {
  type: NotebooksActionTypes.REMOVE_NOTEBOOK;
  payload: string;
}

export interface IRemovingNotebookAction extends Action {
  type: NotebooksActionTypes.REMOVING_NOTEBOOK;
  payload: string;
}

export interface IRemovedNotebookAction extends Action {
  type: NotebooksActionTypes.REMOVED_NOTEBOOK;
  payload: string;
}

export interface IRemovingNotebookFailedAction extends Action {
  type: NotebooksActionTypes.REMOVING_NOTEBOOK_FAILED;
}

export interface IDuplicateNotebookAction extends Action {
  type: NotebooksActionTypes.DUPLICATE_NOTEBOOK;
  payload: string;
}

export interface IDuplicatingNotebookAction extends Action {
  type: NotebooksActionTypes.DUPLICATING_NOTEBOOK;
  payload: string;
}

export interface IDuplicatedNotebookAction extends Action {
  type: NotebooksActionTypes.DUPLICATED_NOTEBOOK;
  payload: INotebook;
}

export interface IDuplicatingNotebookFailedAction extends Action {
  type: NotebooksActionTypes.DUPLICATING_NOTEBOOK_FAILED;
}

export interface IUnsetDuplicatedNotebookAction extends Action {
  type: NotebooksActionTypes.UNSET_DUPLICATED_NOTEBOOK;
  payload: null;
}

export interface IExecuteNotebookAction extends Action {
  type: NotebooksActionTypes.EXECUTE_NOTEBOOK;
  payload: string;  // notebook identifier
}

export interface IExecutingNotebookAction extends Action {
  type: NotebooksActionTypes.EXECUTING_NOTEBOOK;
}

export interface IExecutedNotebookAction extends Action {
  type: NotebooksActionTypes.EXECUTED_NOTEBOOK;
  payload: any;
}

export interface IExecutingNotebookFailedAction extends Action {
  type: NotebooksActionTypes.EXECUTING_NOTEBOOK_FAILED;
}

export interface IToggleConfigView extends Action {
  type: NotebooksActionTypes.TOGGLE_CONFIG_VIEW;
}

export interface IShareNotebookWithUser extends Action {
  type: NotebooksActionTypes.SHARE_NOTEBOOK_WITH_USER;
  payload: {
    notebookUid: string;
    userUid: string;
    permission: string;
  }
}

export interface ISharingNotebookWithUser extends Action {
  type: NotebooksActionTypes.SHARING_NOTEBOOK_WITH_USER;
}

export interface ISharedNotebookWithUser extends Action {
  type: NotebooksActionTypes.SHARED_NOTEBOOK_WITH_USER;
  payload: any;
}

export interface ISharingNotebookWithUserFailed extends Action {
  type: NotebooksActionTypes.SHARING_NOTEBOOK_WITH_USER_FAILED;
}

export interface ISharedNotebookWithPublic extends Action {
  type: NotebooksActionTypes.SHARED_NOTEBOOK_WITH_PUBLIC;
  payload: boolean;
}

export interface IShareNotebookWithWorkspace extends Action {
  type: NotebooksActionTypes.SHARE_NOTEBOOK_WITH_WORKSPACE;
  payload: {
    uid: string;
    permission: string;
  };
}

export interface ISharingNotebookWithWorkspace extends Action {
  type: NotebooksActionTypes.SHARING_NOTEBOOK_WITH_WORKSPACE;
}

export interface ISharedNotebookWithWorkspace extends Action {
  type: NotebooksActionTypes.SHARED_NOTEBOOK_WITH_WORKSPACE;
  payload: any;
}

export interface ISharingNotebookWithWorkspaceFailed extends Action {
  type: NotebooksActionTypes.SHARING_NOTEBOOK_WITH_WORKSPACE_FAILED;
}

export interface ICreateNotebookPageAction extends Action {
  type: NotebooksActionTypes.CREATE_NOTEBOOK_PAGE;
  payload: INotebookPageForCreation;
}

export interface ISelectNotebookPageAction extends Action {
  type: NotebooksActionTypes.SELECT_NOTEBOOK_PAGE;
  payload: INotebookPage | null;
}

export interface ICreatingNotebookPageAction extends Action {
  type: NotebooksActionTypes.CREATING_NOTEBOOK_PAGE;
  payload: INotebookPageForCreation;
}

export interface ICreatedNotebookPageAction extends Action {
  type: NotebooksActionTypes.CREATED_NOTEBOOK_PAGE;
  payload: INotebook;
}

export interface ICreatingNotebookPageFailedAction extends Action {
  type: NotebooksActionTypes.CREATING_NOTEBOOK_PAGE_FAILED;
}

export interface ISaveNotebookPageAction extends Action {
  type: NotebooksActionTypes.SAVE_NOTEBOOK_PAGE;
  payload: {
    id: string;
    page: INotebookPage;
    downloadCoverImageUrl?: string;
  }
}

export interface ISavingNotebookPageAction extends Action {
  type: NotebooksActionTypes.SAVING_NOTEBOOK_PAGE;
  payload: {
    id: string;
    page: INotebookPage;
  }
}

export interface ISavedNotebookPageAction extends Action {
  type: NotebooksActionTypes.SAVED_NOTEBOOK_PAGE;
  payload: {
    page: INotebookPage;
  };
}

export interface ISavingNotebookPageFailedAction extends Action {
  type: NotebooksActionTypes.SAVING_NOTEBOOK_PAGE_FAILED;
}

export interface IUpdateNotebookPageAction extends Action {
  type: NotebooksActionTypes.UPDATE_NOTEBOOK_PAGE;
  payload: {
    id: string;
    page: Partial<INotebookPage>;
  };
}

export interface IRemoveNotebookPageAction extends Action {
  type: NotebooksActionTypes.REMOVE_NOTEBOOK_PAGE;
  payload: string;
}

export interface IRemovingNotebookPageAction extends Action {
  type: NotebooksActionTypes.REMOVING_NOTEBOOK_PAGE;
  payload: string;
}

export interface IRemovedNotebookPageAction extends Action {
  type: NotebooksActionTypes.REMOVED_NOTEBOOK_PAGE;
  payload: string;
}

export interface IRemovingNotebookPageFailedAction extends Action {
  type: NotebooksActionTypes.REMOVING_NOTEBOOK_PAGE_FAILED;
}

export interface IExecuteNotebookPageAction extends Action {
  type: NotebooksActionTypes.EXECUTE_NOTEBOOK_PAGE;
  payload: string;
}

export interface IExecutingNotebookPageAction extends Action {
  type: NotebooksActionTypes.EXECUTING_NOTEBOOK_PAGE;
}

export interface IExecutedNotebookPageAction extends Action {
  type: NotebooksActionTypes.EXECUTED_NOTEBOOK_PAGE;
  payload: any;
}

export interface IExecutingNotebookPageFailedAction extends Action {
  type: NotebooksActionTypes.EXECUTING_NOTEBOOK_PAGE_FAILED;
}

export interface ISelectNotebookPageBlockAction extends Action {
  type: NotebooksActionTypes.SELECT_NOTEBOOK_PAGE_BLOCK;
  payload: {
    pageUid: string;
    blockUid: string | null;
    blockId: any;
  }
}

export interface ISaveNotebookPageBlocksAction extends Action {
  type: NotebooksActionTypes.SAVE_NOTEBOOK_PAGE_BLOCKS;
  payload: {
    id: string;
    page: Partial<INotebookPage>;
    blockMoved?: boolean;
  }
}

export interface ISavingNotebookPageBlocksAction extends Action {
  type: NotebooksActionTypes.SAVING_NOTEBOOK_PAGE_BLOCKS;
  payload: {
    id: string;
    page: Partial<INotebookPage>;
  }
}

export interface ISavedNotebookPageBlocksAction extends Action {
  type: NotebooksActionTypes.SAVED_NOTEBOOK_PAGE_BLOCKS;
  payload: {
    page: Partial<INotebookPage>;
  };
}

export interface ISavingNotebookPageBlocksFailedAction extends Action {
  type: NotebooksActionTypes.SAVING_NOTEBOOK_PAGE_BLOCKS_FAILED;
}

export interface ISaveNotebookPageBlockAction extends Action {
  type: NotebooksActionTypes.SAVE_NOTEBOOK_PAGE_BLOCK;
  payload: {
    id: string;
    page: Partial<INotebookPage>;
    block: Partial<INotebookPageBlock>;
  }
}

export interface ISavingNotebookPageBlockAction extends Action {
  type: NotebooksActionTypes.SAVING_NOTEBOOK_PAGE_BLOCK;
  payload: {
    id: string;
    page: Partial<INotebookPage>;
    block: Partial<INotebookPageBlock>;
  }
}

export interface ISavedNotebookPageBlockAction extends Action {
  type: NotebooksActionTypes.SAVED_NOTEBOOK_PAGE_BLOCK;
  payload: {
    page: Partial<INotebookPage>;
    block: INotebookPageBlock;
  };
}

export interface ISavingNotebookPageBlockFailedAction extends Action {
  type: NotebooksActionTypes.SAVING_NOTEBOOK_PAGE_BLOCK_FAILED;
}

export interface IExecutedNotebookPageBlockAction extends Action {
  type: NotebooksActionTypes.EXECUTED_NOTEBOOK_PAGE_BLOCK;
  payload: {
    id: string;
    page: Partial<INotebookPage>;
    block: Partial<INotebookPageBlock>;
    execution: INotebookPageBlockExecution;
  };
}

export interface IUpdatedNotebookPageBlockExecutionAction extends Action {
  type: NotebooksActionTypes.UPDATED_NOTEBOOK_PAGE_BLOCK_EXECUTION;
  payload: {
    id: string;
    page: Partial<INotebookPage>;
    block: Partial<INotebookPageBlock>;
    execution: INotebookPageBlockExecution;
  };
}

export interface ISaveNotebookPagesPositionAction extends Action {
  type: NotebooksActionTypes.SAVE_NOTEBOOK_PAGES_POSITION;
  payload:{
    notebookId: string,
    notebookPagesIds: string[]
  }
}

export interface ISavingNotebookPagesPositionAction extends Action {
  type: NotebooksActionTypes.SAVING_NOTEBOOK_PAGES_POSITION;
}

export interface ISavedNotebookPagesPositionAction extends Action {
  type: NotebooksActionTypes.SAVED_NOTEBOOK_PAGES_POSITION;
  payload: {
    pagesIds: string[]
  }
}

export interface ISavingNotebookPagesPositionFailedAction extends Action {
  type: NotebooksActionTypes.SAVING_NOTEBOOK_PAGES_POSITION_FAILED;
}

export interface IMovedNotebookPageBlockSuccessAction extends Action {
  type: NotebooksActionTypes.MOVED_NOTEBOOK_PAGE_BLOCK_SUCCESS;
  payload: boolean;
}

// Functions

export function loadNotebooks({
  viewId, filters, sort, page_size, page, reload, type
}: {
  viewId?: number;
  filters?: IFilter[];
  sort?: ISort;
  reload?: boolean;
  page_size?: number;
  page?: number;
  type?: GetNotebooksType;

}): ILoadNotebooksAction {
  return {
    type: NotebooksActionTypes.LOAD_NOTEBOOKS,
    payload: {
      viewId,
      filters: filters ?
        filters
          .reduce((acc: IParamsFilter[], {name, opr, value}: IFilter) => {
            if (name && opr && value) {
              acc.push({
                col: name,
                opr, value
              });
            }
            return acc;
          }, [] as IParamsFilter[]) :
        undefined,
      sort,
      reload,
      page_size,
      page,
      type
    }
  };
}

export function canLoadMoreNotebooks(canLoadMore:boolean): ICanLoadMoreNotebooksAction {
  return {
    type: NotebooksActionTypes.CAN_LOAD_MORE_NOTEBOOKS,
    payload:{
      canLoadMore
    }
  }
}

export function loadingNotebooks(): ILoadingNotebooksAction {
  return {
    type: NotebooksActionTypes.LOADING_NOTEBOOKS
  }
}

export function loadedNotebooks(notebooks: INotebook[],  params: IParams | undefined, reload?: boolean, sort?: ISort): ILoadedNotebooksAction {
  return {
    type: NotebooksActionTypes.LOADED_NOTEBOOKS,
    payload: {
      notebooks,
      params,
      reload
    }
  }
}

export function loadingNotebooksFailed(): ILoadingNotebooksFailedAction {
  return {
    type: NotebooksActionTypes.LOADING_NOTEBOOKS_FAILED
  }
}

export function loadNotebooksMetadata(): ILoadNotebooksMetadataAction {
  return {
    type: NotebooksActionTypes.LOAD_NOTEBOOKS_METADATA
  }
}

export function loadingNotebooksMetadata(): ILoadingNotebooksMetadataAction {
  return {
    type: NotebooksActionTypes.LOADING_NOTEBOOKS_METADATA
  }
}

export function loadedNotebooksMetadata(notebooksMetadata: INotebooksMetadata): ILoadedNotebooksMetadataAction {
  return {
    type: NotebooksActionTypes.LOADED_NOTEBOOKS_METADATA,
    payload: {
      notebooksMetadata
    }
  }
}

export function loadingNotebooksMetadataFailed(): ILoadingNotebooksMetadataFailedAction {
  return {
    type: NotebooksActionTypes.LOADING_NOTEBOOKS_METADATA_FAILED
  }
}

export function loadNotebook(notebookId: string, pageId?: string): ILoadNotebookAction {
  return {
    type: NotebooksActionTypes.LOAD_NOTEBOOK,
    payload: {
      notebookId,
      pageId
    }
  }
}

export function loadingNotebook(notebookId: string, pageId?: string): ILoadingNotebookAction {
  return {
    type: NotebooksActionTypes.LOADING_NOTEBOOK,
    payload: {
      notebookId,
      pageId
    }
  }
}

export function loadedNotebook(notebook: INotebook, pageId?: string): ILoadedNotebookAction {
  return {
    type: NotebooksActionTypes.LOADED_NOTEBOOK,
    payload: {
      notebook,
      pageId
    }
  }
}

export function loadingNotebookFailed(): ILoadingNotebookFailedAction {
  return {
    type: NotebooksActionTypes.LOADING_NOTEBOOK_FAILED
  }
}

export function loadNotebookAlias(alias: string): ILoadNotebookAliasAction {
  return {
    type: NotebooksActionTypes.LOAD_NOTEBOOK_ALIAS,
    payload: alias
  }
}

export function loadingNotebookAlias(): ILoadingNotebookAliasAction {
  return {
    type: NotebooksActionTypes.LOADING_NOTEBOOK_ALIAS,
  }
}

export function loadedNotebookAlias(notebook: INotebook): ILoadedNotebookAliasAction {
  return {
    type: NotebooksActionTypes.LOADED_NOTEBOOK_ALIAS,
    payload: notebook
  }
}

export function loadingNotebookAliasFailed(): ILoadingNotebookAliasFailedAction {
  return {
    type: NotebooksActionTypes.LOADING_NOTEBOOK_ALIAS_FAILED,
  }
}

export function loadNotebookSharingSettings(uid: string): ILoadNotebookSharingSettingsAction {
  return {
    type: NotebooksActionTypes.LOAD_NOTEBOOK_SHARING_SETTINGS,
    payload: uid
  }
}

export function loadingNotebookSharingSettings(): ILoadingNotebookSharingSettingsAction {
  return {
    type: NotebooksActionTypes.LOADING_NOTEBOOK_SHARING_SETTINGS,
  }
}

export function loadedNotebookSharingSettings(settings: any): ILoadedNotebookSharingSettingsAction {
  return {
    type: NotebooksActionTypes.LOADED_NOTEBOOK_SHARING_SETTINGS,
    payload: settings
  }
}

export function loadingNotebookSharingSettingsFailed(): ILoadingNotebookSharingSettingsFailedAction {
  return {
    type: NotebooksActionTypes.LOADING_NOTEBOOK_SHARING_SETTINGS_FAILED,
  }
}

export function loadCurrentUserPermissions(uid: string, userId: string): ILoadCurrentUserPermissionsAction {
  return {
    type: NotebooksActionTypes.LOAD_CURRENT_USER_PERMISSIONS,
    payload: {
      uid,
      userId,
    }
  }
}

export function loadingCurrentUserPermissions(): ILoadingCurrentUserPermissionsAction {
  return {
    type: NotebooksActionTypes.LOADING_CURRENT_USER_PERMISSIONS,
  }
}

export function loadedCurrentUserPermissions(permissions: any): ILoadedCurrentUserPermissionsAction {
  return {
    type: NotebooksActionTypes.LOADED_CURRENT_USER_PERMISSIONS,
    payload: permissions
  }
}

export function loadingCurrentUserPermissionsFailed(): ILoadingCurrentUserPermissionsFailedAction {
  return {
    type: NotebooksActionTypes.LOADING_CURRENT_USER_PERMISSIONS_FAILED,
  }
}

export function createNotebook(notebook: INotebookForCreation): ICreateNotebookAction {
  return {
    type: NotebooksActionTypes.CREATE_NOTEBOOK,
    payload: notebook
  }
}

export function createCommentThread(
  commentThread: ICommentThreadForCreation,
  comment: ICommentForCreationWithoutCommentThreadId,
): ICreateCommentThreadAction {
  return {
    type: NotebooksActionTypes.CREATE_COMMENT_THREAD,
    payload: {
      commentThread,
      comment,
    }
  }
}

export function updateCommentThread(
  commentThreadId: number,
  uid: string,
  commentThreadData: ICommentThreadForUpdate,
): IUpdateCommentThreadAction {
  return {
    type: NotebooksActionTypes.UPDATE_COMMENT_THREAD,
    payload: {
      id: commentThreadId,
      uid,
      commentThread: commentThreadData,
    }
  }
}

export function savedCommentThread(commentThread: ICommentThread): ISavedCommentThreadAction {
  return {
    type: NotebooksActionTypes.SAVED_COMMENT_THREAD,
    payload: {
      commentThread
    }
  }
}

export function savingCommentThread(id: number, uid: string, commentThread: ICommentThreadForUpdate): ISavingCommentThreadAction {
  return {
    type: NotebooksActionTypes.SAVING_COMMENT_THREAD,
    payload: {
      id,
      uid,
      commentThread
    }
  }
}

export function savingCommentThreadFailed(): ISavingCommentThreadFailedAction {
  return {
    type: NotebooksActionTypes.SAVING_COMMENT_THREAD_FAILED,
  }
}

export function createdCommentThread(commentThread: ICommentThread): ICreatedCommentThreadAction {
  return {
    type: NotebooksActionTypes.CREATED_COMMENT_THREAD,
    payload: commentThread
  }
}

export function creatingCommentThread(commentThread: ICommentThreadForCreation): ICreatingCommentThreadAction {
  return {
    type: NotebooksActionTypes.CREATING_COMMENT_THREAD,
    payload: commentThread
  }
}

export function creatingCommentThreadFailed(): ICreatingCommentThreadFailedAction {
  return {
    type: NotebooksActionTypes.CREATING_COMMENT_THREAD_FAILED,
  }
}

export function createComment(comment: ICommentForCreation): ICreateCommentAction {
  return {
    type: NotebooksActionTypes.CREATE_COMMENT,
    payload: {comment}
  }
}

export function createdComment(comment: IComment, user: any): ICreatedCommentAction {
  return {
    type: NotebooksActionTypes.CREATED_COMMENT,
    payload: {comment, user}
  }
}

export function creatingComment(comment: ICommentForCreation): ICreatingCommentAction {
  return {
    type: NotebooksActionTypes.CREATING_COMMENT,
    payload: comment
  }
}

export function creatingCommentFailed(): ICreatingCommentFailedAction {
  return {
    type: NotebooksActionTypes.CREATING_COMMENT_FAILED,
  }
}

export function deleteComment(commentUid: string,  commentThread: ICommentThread, blockUid: string, pageUid: string, notebookUid: string,): IDeleteCommentAction {
  return {
    type: NotebooksActionTypes.DELETE_COMMENT,
    payload: { commentUid, commentThread, blockUid, pageUid, notebookUid,  }
  }
}

export function deletedComment(commentUid: string, commentThread: ICommentThread, blockUid: string, pageUid: string, notebookUid:string,  ): IDeletedCommentAction {
  return {
    type: NotebooksActionTypes.DELETED_COMMENT,
    payload: { commentUid, commentThread, blockUid,  pageUid, notebookUid,  }
  }
}

export function deletingComment(commentUid: string): IDeletingCommentAction {
  return {
    type: NotebooksActionTypes.DELETING_COMMENT,
    payload: { commentUid }
  }
}

export function deletingCommentFailed(): IDeletingCommentFailedAction {
  return {
    type: NotebooksActionTypes.DELETING_COMMENT_FAILED,
  }
}

export function updateComment(comment: IComment,  commentThread: ICommentThread, blockUid: string, pageUid: string, notebookUid: string,): IUpdateCommentAction {
  return {
    type: NotebooksActionTypes.UPDATE_COMMENT,
    payload: { comment, commentThread, blockUid, pageUid, notebookUid,  }
  }
}

export function updatedComment(comment: IComment, commentThread: ICommentThread, blockUid: string, pageUid: string, notebookUid:string,  ): IUpdatedCommentAction {
  return {
    type: NotebooksActionTypes.UPDATED_COMMENT,
    payload: { comment, commentThread, blockUid,  pageUid, notebookUid,  }
  }
}

export function updatingComment(comment: IComment): IUpdatingCommentAction {
  return {
    type: NotebooksActionTypes.UPDATING_COMMENT,
    payload: { comment }
  }
}

export function updatingCommentFailed(): IUpdatingCommentFailedAction {
  return {
    type: NotebooksActionTypes.UPDATING_COMMENT_FAILED,
  }
}



export function creatingNotebook(notebook: INotebookForCreation): ICreatingNotebookAction {
  return {
    type: NotebooksActionTypes.CREATING_NOTEBOOK,
    payload: notebook
  }
}

export function createdNotebook(notebook: INotebook): ICreatedNotebookAction {
  return {
    type: NotebooksActionTypes.CREATED_NOTEBOOK,
    payload: notebook
  }
}

export function creatingNotebookFailed(): ICreatingNotebookFailedAction {
  return {
    type: NotebooksActionTypes.CREATING_NOTEBOOK_FAILED
  }
}


export function saveNotebook(id: string, notebook: Partial<INotebook>): ISaveNotebookAction {
  return {
    type: NotebooksActionTypes.SAVE_NOTEBOOK,
    payload: {
      id,
      notebook
    }
  }
}

export function savingNotebook(id: string, notebook: Partial<INotebook>): ISavingNotebookAction {
  return {
    type: NotebooksActionTypes.SAVING_NOTEBOOK,
    payload: {
      id,
      notebook
    }
  }
}

export function savedNotebook(notebook: INotebook): ISavedNotebookAction {
  return {
    type: NotebooksActionTypes.SAVED_NOTEBOOK,
    payload: {
      notebook
    }
  }
}

export function savingNotebookFailed(): ISavingNotebookFailedAction {
  return {
    type: NotebooksActionTypes.SAVING_NOTEBOOK_FAILED
  }
}

export function removeNotebook(id: string): IRemoveNotebookAction {
  return {
    type: NotebooksActionTypes.REMOVE_NOTEBOOK,
    payload: id
  }
}

export function removingNotebook(id: string): IRemovingNotebookAction {
  return {
    type: NotebooksActionTypes.REMOVING_NOTEBOOK,
    payload: id
  }
}

export function removedNotebook(id: string): IRemovedNotebookAction {
  return {
    type: NotebooksActionTypes.REMOVED_NOTEBOOK,
    payload: id
  }
}

export function removingNotebookFailed(): IRemovingNotebookFailedAction {
  return {
    type: NotebooksActionTypes.REMOVING_NOTEBOOK_FAILED
  }
}

export function duplicateNotebook(notebookId: string): IDuplicateNotebookAction {
  return {
    type: NotebooksActionTypes.DUPLICATE_NOTEBOOK,
    payload: notebookId
  }
}

export function duplicatingNotebook(uid: string): IDuplicatingNotebookAction {
  return {
    type: NotebooksActionTypes.DUPLICATING_NOTEBOOK,
    payload: uid
  }
}

export function duplicatedNotebook(notebook: INotebook): IDuplicatedNotebookAction {
  return {
    type: NotebooksActionTypes.DUPLICATED_NOTEBOOK,
    payload: notebook
  }
}

export function duplicatingNotebookFailed(): IDuplicatingNotebookFailedAction {
  return {
    type: NotebooksActionTypes.DUPLICATING_NOTEBOOK_FAILED
  }
}

export function unsetDuplicatedNotebook(): IUnsetDuplicatedNotebookAction {
  return {
    type: NotebooksActionTypes.UNSET_DUPLICATED_NOTEBOOK,
    payload: null,
  }
}

export function executeNotebook(notebookId: string): IExecuteNotebookAction {
  return {
    type: NotebooksActionTypes.EXECUTE_NOTEBOOK,
    payload: notebookId
  }
}

export function executingNotebook(): IExecutingNotebookAction {
  return {
    type: NotebooksActionTypes.EXECUTING_NOTEBOOK
  }
}

export function executedNotebook(response: any): IExecutedNotebookAction {
  return {
    type: NotebooksActionTypes.EXECUTED_NOTEBOOK,
    payload: response
  }
}

export function executingNotebookFailed(): IExecutingNotebookFailedAction {
  return {
    type: NotebooksActionTypes.EXECUTING_NOTEBOOK_FAILED
  }
}

export function toggleConfigView(): IToggleConfigView {
  return {
    type: NotebooksActionTypes.TOGGLE_CONFIG_VIEW,
  }
}

export function shareNotebookWithUser(
  notebookUid: string,
  userUid: string,
  permission: string
): IShareNotebookWithUser {
  return {
    type: NotebooksActionTypes.SHARE_NOTEBOOK_WITH_USER,
    payload: {
      notebookUid: notebookUid,
      userUid: userUid,
      permission
    }
  }
}

export function sharingNotebookWithUser(): ISharingNotebookWithUser {
  return {
    type: NotebooksActionTypes.SHARING_NOTEBOOK_WITH_USER,
  }
}

export function sharedNotebookWithUser(result: any): ISharedNotebookWithUser {
  return {
    type: NotebooksActionTypes.SHARED_NOTEBOOK_WITH_USER,
    payload: result
  }
}

export function sharingNotebookWithUserFailed(): ISharingNotebookWithUserFailed {
  return {
    type: NotebooksActionTypes.SHARING_NOTEBOOK_WITH_USER_FAILED,
  }
}

export function sharedNotebookWithPublic(isPublic: boolean) {
  return {
    type: NotebooksActionTypes.SHARED_NOTEBOOK_WITH_PUBLIC,
    payload: isPublic
  }
}

export function shareNotebookWithWorkspace(notebookUid: string, permission: string): IShareNotebookWithWorkspace {
  return {
    type: NotebooksActionTypes.SHARE_NOTEBOOK_WITH_WORKSPACE,
    payload: {
      uid: notebookUid,
      permission
    }
  }
}

export function sharingNotebookWithWorkspace(): ISharingNotebookWithWorkspace {
  return {
    type: NotebooksActionTypes.SHARING_NOTEBOOK_WITH_WORKSPACE,
  }
}

export function sharedNotebookWithWorkspace(result: any): ISharedNotebookWithWorkspace {
  return {
    type: NotebooksActionTypes.SHARED_NOTEBOOK_WITH_WORKSPACE,
    payload: result
  }
}

export function sharingNotebookWithWorkspaceFailed(): ISharingNotebookWithWorkspaceFailed {
  return {
    type: NotebooksActionTypes.SHARING_NOTEBOOK_WITH_WORKSPACE_FAILED,
  }
}

export function selectNotebookPage(notebookPage: INotebookPage | null): ISelectNotebookPageAction {
  return {
    type: NotebooksActionTypes.SELECT_NOTEBOOK_PAGE,
    payload: notebookPage
  }
}

export function createNotebookPage(notebookPage: INotebookPageForCreation): ICreateNotebookPageAction {
  return {
    type: NotebooksActionTypes.CREATE_NOTEBOOK_PAGE,
    payload: notebookPage
  }
}

export function creatingNotebookPage(notebookPage: INotebookPageForCreation): ICreatingNotebookPageAction {
  return {
    type: NotebooksActionTypes.CREATING_NOTEBOOK_PAGE,
    payload: notebookPage
  }
}

export function createdNotebookPage(notebookPage: INotebook): ICreatedNotebookPageAction {
  return {
    type: NotebooksActionTypes.CREATED_NOTEBOOK_PAGE,
    payload: notebookPage
  }
}

export function creatingNotebookPageFailed(): ICreatingNotebookPageFailedAction {
  return {
    type: NotebooksActionTypes.CREATING_NOTEBOOK_PAGE_FAILED
  }
}

export function saveNotebookPage(id: string, page: INotebookPage, downloadCoverImageUrl?: string): ISaveNotebookPageAction {
  return {
    type: NotebooksActionTypes.SAVE_NOTEBOOK_PAGE,
    payload: {
      id,
      page,
      downloadCoverImageUrl
    }
  }
}

export function savingNotebookPage(id: string, page: INotebookPage): ISavingNotebookPageAction {
  return {
    type: NotebooksActionTypes.SAVING_NOTEBOOK_PAGE,
    payload: {
      id,
      page
    }
  }
}

export function savedNotebookPage(page: INotebookPage): ISavedNotebookPageAction {
  return {
    type: NotebooksActionTypes.SAVED_NOTEBOOK_PAGE,
    payload: {
      page
    }
  }
}

export function savingNotebookPageFailed(): ISavingNotebookPageFailedAction {
  return {
    type: NotebooksActionTypes.SAVING_NOTEBOOK_PAGE_FAILED
  }
}

export function updateNotebookPageProperties(id: string, page: Partial<INotebookPage>): IUpdateNotebookPageAction {
  return {
    type: NotebooksActionTypes.UPDATE_NOTEBOOK_PAGE,
    payload: {
      id,
      page
    }
  }
}

export function removeNotebookPage(id: string): IRemoveNotebookPageAction {
  return {
    type: NotebooksActionTypes.REMOVE_NOTEBOOK_PAGE,
    payload: id
  }
}

export function removingNotebookPage(id: string): IRemovingNotebookPageAction {
  return {
    type: NotebooksActionTypes.REMOVING_NOTEBOOK_PAGE,
    payload: id
  }
}

export function removedNotebookPage(id: string): IRemovedNotebookPageAction {
  return {
    type: NotebooksActionTypes.REMOVED_NOTEBOOK_PAGE,
    payload: id
  }
}

export function removingNotebookPageFailed(): IRemovingNotebookPageFailedAction {
  return {
    type: NotebooksActionTypes.REMOVING_NOTEBOOK_PAGE_FAILED
  }
}

export function executeNotebookPage(pageId: string): IExecuteNotebookPageAction {
  return {
    type: NotebooksActionTypes.EXECUTE_NOTEBOOK_PAGE,
    payload: pageId
  }
}

export function executingNotebookPage(): IExecutingNotebookPageAction {
  return {
    type: NotebooksActionTypes.EXECUTING_NOTEBOOK_PAGE
  }
}

export function executedNotebookPage(response: any): IExecutedNotebookPageAction {
  return {
    type: NotebooksActionTypes.EXECUTED_NOTEBOOK_PAGE,
    payload: response
  }
}

export function executingNotebookPageFailed(): IExecutingNotebookPageFailedAction {
  return {
    type: NotebooksActionTypes.EXECUTING_NOTEBOOK_PAGE_FAILED
  }
}

export function selectNotebookPageBlock(pageUid: string, blockUid: string | null, blockId: any): ISelectNotebookPageBlockAction {
  return {
    type: NotebooksActionTypes.SELECT_NOTEBOOK_PAGE_BLOCK,
    payload: {
      pageUid,
      blockUid,
      blockId
    }
  }
}

export function saveNotebookPageBlocks(id: string, page: Partial<INotebookPage>, blockMoved?: boolean): ISaveNotebookPageBlocksAction {
  return {
    type: NotebooksActionTypes.SAVE_NOTEBOOK_PAGE_BLOCKS,
    payload: {
      id,
      page,
      blockMoved,
    },
  };
}

export function savingNotebookPageBlocks(id: string, page: Partial<INotebookPage>): ISavingNotebookPageBlocksAction {
  return {
    type: NotebooksActionTypes.SAVING_NOTEBOOK_PAGE_BLOCKS,
    payload: {
      id,
      page
    }
  }
}

export function savedNotebookPageBlocks(page: Partial<INotebookPage>): ISavedNotebookPageBlocksAction {
  return {
    type: NotebooksActionTypes.SAVED_NOTEBOOK_PAGE_BLOCKS,
    payload: {
      page
    }
  }
}

export function savingNotebookPageBlocksFailed(): ISavingNotebookPageBlocksFailedAction {
  return {
    type: NotebooksActionTypes.SAVING_NOTEBOOK_PAGE_BLOCKS_FAILED
  }
}

export function saveNotebookPageBlock(id: string, page: Partial<INotebookPage>, block: Partial<INotebookPageBlock>): ISaveNotebookPageBlockAction {
  return {
    type: NotebooksActionTypes.SAVE_NOTEBOOK_PAGE_BLOCK,
    payload: {
      id,
      page,
      block
    }
  }
}

export function savingNotebookPageBlock(id: string, page: Partial<INotebookPage>, block: Partial<INotebookPageBlock>): ISavingNotebookPageBlockAction {
  return {
    type: NotebooksActionTypes.SAVING_NOTEBOOK_PAGE_BLOCK,
    payload: {
      id,
      page,
      block
    }
  }
}

export function savedNotebookPageBlock(page: Partial<INotebookPage>, block: INotebookPageBlock): ISavedNotebookPageBlockAction {
  return {
    type: NotebooksActionTypes.SAVED_NOTEBOOK_PAGE_BLOCK,
    payload: {
      page,
      block
    }
  }
}

export function savingNotebookPageBlockFailed(): ISavingNotebookPageBlockFailedAction {
  return {
    type: NotebooksActionTypes.SAVING_NOTEBOOK_PAGE_BLOCK_FAILED
  }
}

export function executedNotebookPageBlock(id: string, page: Partial<INotebookPage>, block: Partial<INotebookPageBlock>, execution: INotebookPageBlockExecution): IExecutedNotebookPageBlockAction {
  return {
    type: NotebooksActionTypes.EXECUTED_NOTEBOOK_PAGE_BLOCK,
    payload: {
      id,
      page,
      block,
      execution
    }
  }
}

export function updatedNotebookPageBlockExecution(id: string, page: Partial<INotebookPage>, block: Partial<INotebookPageBlock>, execution: INotebookPageBlockExecution): IUpdatedNotebookPageBlockExecutionAction {
  return {
    type: NotebooksActionTypes.UPDATED_NOTEBOOK_PAGE_BLOCK_EXECUTION,
    payload: {
      id,
      page,
      block,
      execution
    }
  }
}


export function saveNotebookPagesPosition(
  notebookId:string,
  notebookPagesIds: string[]
): ISaveNotebookPagesPositionAction {
  return {
    type: NotebooksActionTypes.SAVE_NOTEBOOK_PAGES_POSITION,
    payload: {
      notebookId,
      notebookPagesIds
    }
  }
}

export function savingNotebookPagesPosition(): ISavingNotebookPagesPositionAction {
  return {
    type: NotebooksActionTypes.SAVING_NOTEBOOK_PAGES_POSITION,
  }
}

export function savedNotebookPagesPosition(pagesIds: string[]): ISavedNotebookPagesPositionAction {
  return {
    type: NotebooksActionTypes.SAVED_NOTEBOOK_PAGES_POSITION,
    payload: {
      pagesIds
    }
  }
}

export function savingNotebookPagesPositionFailed(): ISavingNotebookPagesPositionFailedAction {
  return {
    type: NotebooksActionTypes.SAVING_NOTEBOOK_PAGES_POSITION_FAILED
  }
}

export function movedNotebookPageBlockSuccess(status: boolean): IMovedNotebookPageBlockSuccessAction {
  return {
    type: NotebooksActionTypes.MOVED_NOTEBOOK_PAGE_BLOCK_SUCCESS,
    payload: status,
  };
}

export type NotebooksAction =
  ICreateCommentThreadAction |
  ICanLoadMoreNotebooksAction|
  ICreatedCommentThreadAction |
  ICreatingCommentThreadAction |
  ICreatingCommentThreadFailedAction |
  ICreateCommentAction |
  ICreatedCommentAction |
  ICreatingCommentAction |
  ICreatingCommentFailedAction |
  IDeleteCommentAction |
  IDeletedCommentAction |
  IDeletingCommentAction |
  IDeletingCommentFailedAction |
  IUpdateCommentAction |
  IUpdatedCommentAction |
  IUpdatingCommentAction |
  IUpdatingCommentFailedAction |
  IUpdateCommentThreadAction |
  ISavedCommentThreadAction |
  ISavingCommentThreadAction |
  ISavingCommentThreadFailedAction |
  ILoadNotebooksAction |
  ILoadingNotebooksAction |
  ILoadedNotebooksAction |
  ILoadingNotebooksFailedAction |
  ILoadNotebooksMetadataAction |
  ILoadingNotebooksMetadataAction |
  ILoadedNotebooksMetadataAction |
  ILoadingNotebooksMetadataFailedAction |
  ILoadNotebookAction |
  ILoadingNotebookAction |
  ILoadedNotebookAction |
  ILoadingNotebookFailedAction |
  IUnsetNotebookAction |
  ILoadNotebookAliasAction |
  ILoadingNotebookAliasAction |
  ILoadedNotebookAliasAction |
  ILoadingNotebookAliasFailedAction |
  ILoadNotebookSharingSettingsAction |
  ILoadingNotebookSharingSettingsAction |
  ILoadedNotebookSharingSettingsAction |
  ILoadingNotebookSharingSettingsFailedAction |
  ILoadCurrentUserPermissionsAction |
  ILoadingCurrentUserPermissionsAction |
  ILoadedCurrentUserPermissionsAction |
  ILoadingCurrentUserPermissionsFailedAction |
  ICreateNotebookAction |
  ICreatingNotebookAction |
  ICreatedNotebookAction |
  ICreatingNotebookFailedAction |
  ISaveNotebookAction |
  ISavingNotebookAction |
  ISavedNotebookAction |
  ISavingNotebookFailedAction |
  IRemoveNotebookAction |
  IRemovingNotebookAction |
  IRemovedNotebookAction |
  IRemovingNotebookFailedAction |
  IDuplicateNotebookAction |
  IDuplicatingNotebookAction |
  IDuplicatedNotebookAction |
  IDuplicatingNotebookFailedAction |
  IUnsetDuplicatedNotebookAction |
  IExecuteNotebookAction |
  IExecutingNotebookAction |
  IExecutedNotebookAction |
  IExecutingNotebookFailedAction |
  IToggleConfigView |
  IShareNotebookWithUser |
  ISharingNotebookWithUser |
  ISharedNotebookWithUser |
  ISharingNotebookWithUserFailed |
  ISharedNotebookWithPublic |
  IShareNotebookWithWorkspace |
  ISharingNotebookWithWorkspace |
  ISharedNotebookWithWorkspace |
  ISharingNotebookWithWorkspaceFailed |
  ISelectNotebookPageAction |
  ICreateNotebookPageAction |
  ICreatingNotebookPageAction |
  ICreatedNotebookPageAction |
  ICreatingNotebookPageFailedAction |
  ISaveNotebookPageAction |
  ISavingNotebookPageAction |
  ISavedNotebookPageAction |
  ISavingNotebookPageFailedAction |
  ISaveNotebookPageBlocksAction |
  ISavingNotebookPageBlocksAction |
  ISavedNotebookPageBlocksAction |
  ISavingNotebookPageBlocksFailedAction |
  IUpdateNotebookPageAction |
  IRemoveNotebookPageAction |
  IRemovingNotebookPageAction |
  IRemovedNotebookPageAction |
  IRemovingNotebookPageFailedAction |
  IExecuteNotebookPageAction |
  IExecutingNotebookPageAction |
  IExecutedNotebookPageAction |
  IExecutingNotebookPageFailedAction |
  ISelectNotebookPageBlockAction |
  ISaveNotebookPageBlockAction |
  ISavingNotebookPageBlockAction |
  ISavedNotebookPageBlockAction |
  ISavingNotebookPageBlockFailedAction |
  IExecutedNotebookPageBlockAction |
  IUpdatedNotebookPageBlockExecutionAction|
  ISaveNotebookPagesPositionAction |
  ISavingNotebookPagesPositionAction |
  ISavedNotebookPagesPositionAction |
  ISavingNotebookPagesPositionFailedAction|
  IMovedNotebookPageBlockSuccessAction;
