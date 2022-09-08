import {
  ApiStatus,
  IComment,
  ICommentThread,
  ICurrentUserPermissions,
  INotebook,
  INotebookPage,
  INotebookPageBlock,
  INotebookPageBlockExecution,
  INotebookSharingSettings,
  INotebooksMetadata,
  IParams,
  ITagParent,
} from '../../models';

import { NotebooksAction, NotebooksActionTypes } from '../actions/notebookActions';
import { TagsAction, TagsActionTypes } from '../actions/tagActions';
import { removeElementFromList } from '../../utils/list';
import { updateElementInList } from '../../utils/reducers';
import { PROPERTIES_LINKED_TO_SQL_BLOCK } from '../../../libs/react-chart-editor';

const BLOCK_TYPE_PLOTLY = 'plotly';
const EXECUTION_STATUS_SUCCESS = 'success';

export const initialNotebookState: INotebookState = {
  loadingListStatus: ApiStatus.LOADING,
  loadingMetadataStatus: ApiStatus.LOADING,
  loadingStatus: ApiStatus.LOADING,
  addingStatus: ApiStatus.LOADED,
  removingStatus: ApiStatus.LOADED,
  duplicatingStatus: ApiStatus.LOADED,
  addingPageStatus: ApiStatus.LOADED,
  savingPageStatus: ApiStatus.LOADED,
  removingPageStatus: ApiStatus.LOADED,
  addingCommentStatus: ApiStatus.LOADED,
  savingCommentStatus: ApiStatus.LOADED,
  deletingCommentStatus: ApiStatus.LOADED,
  updatingCommentStatus: ApiStatus.LOADED,
  savingCommentThreadStatus: ApiStatus.LOADED,
  notebooks: [],
  canLoadMoreNotebooks: false,
  notebooksParams: {},
  notebooksMetadata: null,
  notebook: null,
  duplicatedNotebook: null,
  selectedNotebookPage: null,
  selectedNotebookPageBlock: null,
  selectedNotebookPageBlockId: null,
  showConfigs: false,
  currentSharingSettings: null, // @TODO - move it into notebook, maybe
  currentUserPermissions: null, // current user notebook permissions
  blockAddedToTheNewPage: null
}

export interface INotebookState {
  loadingStatus: ApiStatus;
  loadingListStatus: ApiStatus;
  loadingMetadataStatus: ApiStatus;
  addingStatus: ApiStatus;
  removingStatus: ApiStatus;
  duplicatingStatus: ApiStatus;
  addingPageStatus: ApiStatus;
  savingPageStatus: ApiStatus;
  removingPageStatus: ApiStatus;
  addingCommentStatus: ApiStatus;
  savingCommentStatus: ApiStatus;
  deletingCommentStatus: ApiStatus;
  updatingCommentStatus: ApiStatus;
  savingCommentThreadStatus: ApiStatus;
  notebooks: INotebook[];
  canLoadMoreNotebooks: boolean;
  notebooksParams: IParams | undefined;
  notebooksMetadata: INotebooksMetadata | null;
  duplicatedNotebook: INotebook | null;
  notebook: INotebook | null;
  selectedNotebookPage: INotebookPage | null;
  selectedNotebookPageBlock: string | null;
  selectedNotebookPageBlockId: any;
  showConfigs: boolean; // show right side drawer
  currentSharingSettings: INotebookSharingSettings | null;
  currentUserPermissions: ICurrentUserPermissions | null;
  blockAddedToTheNewPage: boolean | null;
}

function getNotebookFromTag(state: INotebookState, { parent }: { parent: ITagParent }) {
  if (parent.objectType !== 'notebook') {
    return null;
  }

  return state.notebooks.find(q => q.uid === parent.objectId);
}

export default function notebooksReducer(state: INotebookState = initialNotebookState, action: NotebooksAction | TagsAction): INotebookState {
  switch (action.type) {
    case NotebooksActionTypes.CAN_LOAD_MORE_NOTEBOOKS:
      return {
        ...state,
        canLoadMoreNotebooks: action.payload.canLoadMore
      };
    case NotebooksActionTypes.LOAD_NOTEBOOKS:
    case NotebooksActionTypes.LOADING_NOTEBOOKS:
      return {
        ...state,
        loadingListStatus: ApiStatus.LOADING
      };

    case NotebooksActionTypes.LOADING_NOTEBOOKS_FAILED:
      return {
        ...state,
        loadingListStatus: ApiStatus.FAILED
      };

    case NotebooksActionTypes.LOADED_NOTEBOOKS:
      return {
        ...state,
        loadingListStatus: ApiStatus.LOADED,
        notebooks: action.payload.reload?action.payload.notebooks:[...state.notebooks,...action.payload.notebooks],
        notebooksParams: action.payload.params
      };

    case NotebooksActionTypes.LOAD_NOTEBOOKS_METADATA:
    case NotebooksActionTypes.LOADING_NOTEBOOKS_METADATA:
      return {
        ...state,
        loadingMetadataStatus: ApiStatus.LOADING
      };

    case NotebooksActionTypes.LOADING_NOTEBOOKS_METADATA_FAILED:
      return {
        ...state,
        loadingMetadataStatus: ApiStatus.FAILED
      };

    case NotebooksActionTypes.LOADED_NOTEBOOKS_METADATA:
      return {
        ...state,
        loadingMetadataStatus: ApiStatus.LOADED,
        notebooksMetadata: action.payload.notebooksMetadata
      };

    case NotebooksActionTypes.LOAD_NOTEBOOK:
    case NotebooksActionTypes.LOADING_NOTEBOOK:
      // In the case of a refresh, we have to keep the previous
      // value to avoid blink effect
      const shouldKeepNotebook = (state.notebook && state.notebook.uid === action.payload.notebookId);
      return {
        ...state,
        loadingStatus: ApiStatus.LOADING,
        notebook: shouldKeepNotebook ? state.notebook : null
      };

    case NotebooksActionTypes.LOAD_NOTEBOOK_ALIAS:
    case NotebooksActionTypes.LOADING_NOTEBOOK_ALIAS:
      return {
        ...state,
        loadingStatus: ApiStatus.LOADING
      };

    case NotebooksActionTypes.LOADING_NOTEBOOK_FAILED:
    case NotebooksActionTypes.LOADING_NOTEBOOK_ALIAS_FAILED:
      return {
        ...state,
        loadingStatus: ApiStatus.FAILED
      };

    case NotebooksActionTypes.LOADED_NOTEBOOK:
      const { notebook, pageId } = action.payload;
      let selectedNotebookPage = null;
      if (pageId) {
        selectedNotebookPage = notebook.pages.find((page: INotebookPage) => page.uid === pageId) || null;
      }
      return {
        ...state,
        loadingStatus: ApiStatus.LOADED,
        notebook,
        selectedNotebookPage,
      };

    case NotebooksActionTypes.UNSET_NOTEBOOK:
      return {
        ...state,
        notebook: action.payload,
        selectedNotebookPage: action.payload,
      }

    case NotebooksActionTypes.LOADED_NOTEBOOK_ALIAS:
      const alias = action.payload.length ? action.payload[0] : null;
      return {
        ...state,
        loadingStatus: ApiStatus.LOADED,
        notebook: alias
      };

    case NotebooksActionTypes.LOADED_NOTEBOOK_SHARING_SETTINGS:
      return {
        ...state,
        currentSharingSettings: action.payload
      };

    case NotebooksActionTypes.LOADED_CURRENT_USER_PERMISSIONS:
      return {
        ...state,
        currentUserPermissions: action.payload
      }

    case TagsActionTypes.CREATED_TAG:
      const notebookForTagCreation = getNotebookFromTag(state, action.payload);
      if (!notebookForTagCreation) {
        return state;
      }
      const { tag } = action.payload;
      return {
        ...state,
        notebooks: updateElementInList(state.notebooks, {
          ...notebookForTagCreation,
          tags: notebookForTagCreation.tags ? notebookForTagCreation.tags.concat([ tag ]) : [ tag ]
        })
      };

    case TagsActionTypes.REMOVED_TAG:
      const notebookForTagDeletion = getNotebookFromTag(state, action.payload);
      if (!notebookForTagDeletion) {
        return state;
      }
      const { uid } = action.payload;
      return {
        ...state,
        notebooks: updateElementInList(state.notebooks, {
          ...notebookForTagDeletion,
          tags: notebookForTagDeletion.tags ?
            removeElementFromList(notebookForTagDeletion.tags, { uid }, 'uid') :
            [ ]
        })
      };

    case NotebooksActionTypes.CREATE_NOTEBOOK:
    case NotebooksActionTypes.CREATING_NOTEBOOK:
      return {
        ...state,
        addingStatus: ApiStatus.LOADING
      };

    case NotebooksActionTypes.CREATING_NOTEBOOK_FAILED:
      return {
        ...state,
        addingStatus: ApiStatus.FAILED
      };

    case NotebooksActionTypes.CREATED_NOTEBOOK:
      return {
        ...state,
        addingStatus: ApiStatus.LOADED,
        notebooks: state.notebooks ?
          state.notebooks.concat(action.payload) :
          [ action.payload ]
      };

    /* comment threads */
    case NotebooksActionTypes.CREATED_COMMENT_THREAD:
      return {
        ...state,
        savingPageStatus: ApiStatus.LOADED,
        notebook: state.notebook ?
          {
            ...state.notebook,
            pages: state.notebook.pages ?
              state.notebook.pages.map(page => ({
                ...page,
                blocks: page.blocks ?
                   page.blocks.map(block => ({
                     ...block,
                     comment_threads: block.id === action.payload.block_id ?
                       block.comment_threads ? block.comment_threads.concat(action.payload) : [action.payload]
                       : block.comment_threads
                   }))
                  : page.blocks
              })) :
              state.notebook.pages
          } :
          state.notebook
      };
      case NotebooksActionTypes.CREATING_COMMENT:
        return {
          ...state,
          addingCommentStatus: ApiStatus.LOADING
        };
      case NotebooksActionTypes.CREATING_COMMENT_FAILED:
        return {
          ...state,
          addingCommentStatus: ApiStatus.FAILED
        };

      case NotebooksActionTypes.CREATED_COMMENT:
        const { comment, user } = action.payload
        const newComment = {
          ...comment,
          created_by: user
        }

        return {
          ...state,
          savingPageStatus: ApiStatus.LOADED,
          notebook: state.notebook ?
            {
              ...state.notebook,
              pages: state.notebook.pages ?
                state.notebook.pages.map(page => ({
                  ...page,
                  blocks: page.blocks ?
                     page.blocks.map(block => ({
                       ...block,
                       comment_threads: block.comment_threads ?
                         block.comment_threads.map(commentThread => ({
                             ...commentThread,
                             comments: commentThread.id.toString() == newComment.comment_thread_id ?
                               commentThread.comments ? commentThread.comments.concat(newComment)
                               : [newComment]
                               : commentThread.comments
                         })) : block.comment_threads
                     }))
                    : page.blocks
                })) :
                state.notebook.pages
            } :
            state.notebook
        };
    case NotebooksActionTypes.DELETING_COMMENT:
      return {
        ...state,
        deletingCommentStatus: ApiStatus.LOADING
      };

    case NotebooksActionTypes.DELETING_COMMENT_FAILED:
      return {
        ...state,
        deletingCommentStatus: ApiStatus.FAILED
      };

    case NotebooksActionTypes.DELETED_COMMENT:
      const commentThreadWithoutComment = {
        ...action.payload.commentThread,
        comments: action.payload.commentThread.comments.filter((comment: IComment) => comment.uid !== action.payload.commentUid)
      }

      return {
        ...state,
        deletingCommentStatus: ApiStatus.LOADED,
        notebook: handleNotebookUpdates(
          state.notebook,
          {
            notebookUid: action.payload.notebookUid,
            pageUid: action.payload.pageUid,
            blockUid: action.payload.blockUid,
            commentThreadUid: action.payload.commentThread.uid
          },
          commentThreadWithoutComment
        )
      };
    case NotebooksActionTypes.UPDATING_COMMENT:
      return {
        ...state,
        updatingCommentStatus: ApiStatus.LOADING
      };

    case NotebooksActionTypes.UPDATING_COMMENT_FAILED:
      return {
        ...state,
        updatingCommentStatus: ApiStatus.FAILED
      };

    case NotebooksActionTypes.UPDATED_COMMENT:
      const commentThreadWithUpdatedComment = {
        ...action.payload.commentThread,
        comments: action.payload.commentThread.comments.map((comment: IComment) => (
          comment.uid !== action.payload.comment.uid ? comment : action.payload.comment
        ))
      }

      return {
        ...state,
        updatingCommentStatus: ApiStatus.LOADED,
        notebook: handleNotebookUpdates(
          state.notebook,
          {
            notebookUid: action.payload.notebookUid,
            pageUid: action.payload.pageUid,
            blockUid: action.payload.blockUid,
            commentThreadUid: action.payload.commentThread.uid
          },
          commentThreadWithUpdatedComment
        )
      };

    case NotebooksActionTypes.SAVING_COMMENT_THREAD:
      return {
        ...state,
        savingCommentThreadStatus: ApiStatus.LOADING
      };

    case NotebooksActionTypes.SAVED_COMMENT_THREAD:
      const updatedCommentThread = action.payload.commentThread
      return {
        ...state,
        savingCommentThreadStatus: ApiStatus.LOADED,
        notebook: state.notebook ?
          {
            ...state.notebook,
            pages: state.notebook.pages ?
              state.notebook.pages.map(page => ({
                ...page,
                blocks: page.blocks ?
                   page.blocks.map(block => ({
                     ...block,
                     comment_threads: block.comment_threads ?
                       block.comment_threads.map(commentThread => (
                        commentThread.uid === updatedCommentThread.uid ?
                          {
                            ...commentThread,
                            status: updatedCommentThread.status // only updating the status
                          } : commentThread
                     )) : []
                   }))
                  : page.blocks
              })) :
              state.notebook.pages
          } :
          state.notebook
      };
    case NotebooksActionTypes.SAVING_COMMENT_THREAD_FAILED:
      return {
        ...state,
        savingCommentThreadStatus: ApiStatus.FAILED
      };
    /* /comment threads */

    case NotebooksActionTypes.SAVED_NOTEBOOK:
      const { name, is_public, params } = action.payload.notebook;

      return {
        ...state,
        notebook: state.notebook ? {
          ...state.notebook,
          name,
          is_public,
          params,
        } : state.notebook
      }

    case NotebooksActionTypes.REMOVE_NOTEBOOK:
    case NotebooksActionTypes.REMOVING_NOTEBOOK:
      return {
        ...state,
        removingStatus: ApiStatus.LOADING
      };

    case NotebooksActionTypes.REMOVING_NOTEBOOK_FAILED:
      return {
        ...state,
        removingStatus: ApiStatus.FAILED
      };

    case NotebooksActionTypes.REMOVED_NOTEBOOK:
      return {
        ...state,
        removingStatus: ApiStatus.LOADED,
        notebooks: state.notebooks ?
          removeElementFromList(state.notebooks, { uid: action.payload }, 'uid') :
          state.notebooks
      };

    case NotebooksActionTypes.DUPLICATE_NOTEBOOK:
    case NotebooksActionTypes.DUPLICATING_NOTEBOOK:
      return {
        ...state,
        duplicatingStatus: ApiStatus.LOADING
      };

    case NotebooksActionTypes.DUPLICATING_NOTEBOOK_FAILED:
      return {
        ...state,
        duplicatingStatus: ApiStatus.FAILED
      }

    case NotebooksActionTypes.DUPLICATED_NOTEBOOK:
      return {
        ...state,
        notebooks: state.notebooks ? [
          action.payload,
          ...state.notebooks
        ] : state.notebooks,
        duplicatedNotebook: action.payload,
        duplicatingStatus: ApiStatus.LOADED
      }

    case NotebooksActionTypes.UNSET_DUPLICATED_NOTEBOOK:
      return {
        ...state,
        duplicatedNotebook: action.payload,
      }

    case NotebooksActionTypes.TOGGLE_CONFIG_VIEW:
      return {
        ...state,
        showConfigs: !state.showConfigs
      }

    case NotebooksActionTypes.SHARED_NOTEBOOK_WITH_PUBLIC:
      return {
        ...state,
        currentSharingSettings: {
          ...state.currentSharingSettings as INotebookSharingSettings,
          is_public: action.payload
        }
      }

    case NotebooksActionTypes.SHARED_NOTEBOOK_WITH_WORKSPACE:
      return {
        ...state,
        currentSharingSettings: {
          ...state.currentSharingSettings as INotebookSharingSettings,
          shared_with_workspace: action.payload?.shared
        }
      }

    case NotebooksActionTypes.SELECT_NOTEBOOK_PAGE:
      return {
        ...state,
        selectedNotebookPage: action.payload,
        selectedNotebookPageBlock: null,
        selectedNotebookPageBlockId: null
    };

    case NotebooksActionTypes.CREATE_NOTEBOOK_PAGE:
    case NotebooksActionTypes.CREATING_NOTEBOOK_PAGE:
      return {
        ...state,
        addingPageStatus: ApiStatus.LOADING
      };

    case NotebooksActionTypes.CREATING_NOTEBOOK_PAGE_FAILED:
      return {
        ...state,
        addingPageStatus: ApiStatus.FAILED
      };

    case NotebooksActionTypes.CREATED_NOTEBOOK_PAGE:
      let createdNotebookPages: INotebookPage[] = [];
      if (state.notebook !== null) {
        const currentPagesUid = state.notebook.pages.map(page => page.uid);

        createdNotebookPages = action.payload.pages.filter(page =>
          currentPagesUid.indexOf(page.uid) < 0
        ); // new pages does not exist in the list of current pages
      }

      return {
        ...state,
        addingPageStatus: ApiStatus.LOADED,
        notebook: (
          state.notebook ? {
            ...state.notebook,
            pages: state.notebook.pages.concat(createdNotebookPages)
          } : state.notebook
        ),
        notebooks: state.notebooks ?
          state.notebooks.concat(action.payload) :
          [ action.payload ]
      };

    case NotebooksActionTypes.SAVE_NOTEBOOK_PAGE:
    case NotebooksActionTypes.SAVING_NOTEBOOK_PAGE:
      return {
        ...state,
        savingPageStatus: ApiStatus.LOADING
      };

    case NotebooksActionTypes.SAVING_NOTEBOOK_PAGE_FAILED:
      return {
        ...state,
        savingPageStatus: ApiStatus.FAILED
      };

    /*
      Called when a page saved. In this case, only the specified page data (excluded blocks)
      must be updated.
     */
    case NotebooksActionTypes.SAVED_NOTEBOOK_PAGE:
      const { page: updatedPage } = action.payload;
      return {
        ...state,
        savingPageStatus: ApiStatus.LOADED,
        notebook: handleNotebookUpdates(
          state.notebook,
          { notebookUid: state.notebook?.uid, pageUid: updatedPage.uid },
          updatedPage
        ),
        selectedNotebookPage: { ...updatedPage },
      };

    case NotebooksActionTypes.SAVE_NOTEBOOK_PAGE_BLOCKS:
    case NotebooksActionTypes.SAVING_NOTEBOOK_PAGE_BLOCKS:
      return {
        ...state,
        savingPageStatus: ApiStatus.LOADING
      };

    case NotebooksActionTypes.SAVING_NOTEBOOK_PAGE_BLOCKS_FAILED:
      return {
        ...state,
        savingPageStatus: ApiStatus.FAILED
      };

    /*
      Called when a page saved. In this case, only the specified blocks for the page
      must be updated.
      */
    case NotebooksActionTypes.SAVED_NOTEBOOK_PAGE_BLOCKS:
      const { page: updatedPageBlocks } = action.payload;
      return {
        ...state,
        savingPageStatus: ApiStatus.LOADED,
        notebook: handleNotebookUpdates(
          state.notebook,
          { notebookUid: state.notebook?.uid, pageUid: updatedPageBlocks.uid, updateBlocks: true },
          updatedPageBlocks
        )
      };

    /*
      Called when updating a page, i.e. data must be updated into the store before being
      saved on the server. In this case, only the specified page data (excluded blocks)
      must be updated.
     */
    case NotebooksActionTypes.UPDATE_NOTEBOOK_PAGE:
      const { page: updatedPageProperties } = action.payload;
      return {
        ...state,
        savingPageStatus: ApiStatus.LOADED,
        notebook: handleNotebookUpdates(
          state.notebook,
          {
            notebookUid: state.notebook?.uid,
            pageUid: updatedPageProperties.uid
          },
          updatedPageProperties
        )
      };

    case NotebooksActionTypes.REMOVE_NOTEBOOK_PAGE:
    case NotebooksActionTypes.REMOVING_NOTEBOOK_PAGE:
      return {
        ...state,
        removingPageStatus: ApiStatus.LOADING
      };

    case NotebooksActionTypes.REMOVING_NOTEBOOK_PAGE_FAILED:
      return {
        ...state,
        removingPageStatus: ApiStatus.FAILED
      };

    case NotebooksActionTypes.REMOVED_NOTEBOOK_PAGE:
      return {
        ...state,
        removingPageStatus: ApiStatus.LOADED,
        notebook: state.notebook ?
          {
            ...state.notebook,
            pages: state.notebook.pages ?
            removeElementFromList(state.notebook.pages, { uid: action.payload }, 'uid') :
            state.notebook.pages
          } :
          state.notebook
      };

    case NotebooksActionTypes.EXECUTED_NOTEBOOK: {
      return {
        ...state,
        // executingNotebookPage: false
      }
    }

    case NotebooksActionTypes.EXECUTED_NOTEBOOK_PAGE: {
      return {
        ...state,
        // executingNotebookPage: false
      }
    }

    case NotebooksActionTypes.SELECT_NOTEBOOK_PAGE_BLOCK:
    const { pageUid, blockUid, blockId } = action.payload;
      return {
        ...state,
        selectedNotebookPageBlock: blockUid,
        selectedNotebookPageBlockId: blockId,
    };
    case NotebooksActionTypes.SAVE_NOTEBOOK_PAGE_BLOCK:
    case NotebooksActionTypes.SAVING_NOTEBOOK_PAGE_BLOCK:
      return {
        ...state,
        savingPageStatus: ApiStatus.LOADING
      };

    case NotebooksActionTypes.SAVING_NOTEBOOK_PAGE_BLOCK_FAILED:
      return {
        ...state,
        savingPageStatus: ApiStatus.FAILED
      };

    /*
      Called when a block saved. In this case, only the specified block
      data (excluded results) must be updated.
     */
    case NotebooksActionTypes.SAVED_NOTEBOOK_PAGE_BLOCK:
      const { page: blockPage, block: updatedBlock } = action.payload;
      return {
        ...state,
        savingPageStatus: ApiStatus.LOADED,
        notebook: handleNotebookUpdates(
          state.notebook,
          {
            notebookUid: state.notebook?.uid,
            pageUid: blockPage.uid,
            blockUid: updatedBlock.uid
          },
          updatedBlock
        )
      };

    /*
      Called when the execution of a block started. In this case, only the specified result
      must be updated in most cases.

      If the status of the execution is successful, dependencies must be also updated
     */
    case NotebooksActionTypes.EXECUTED_NOTEBOOK_PAGE_BLOCK:
      const { id: executedBlockId, page: executedPage, block, execution } = action.payload;
      return {
        ...state,
        savingPageStatus: ApiStatus.LOADED,
        notebook: handleNotebookUpdates(
          state.notebook,
          {
            notebookUid: state.notebook?.uid,
            pageUid: executedPage.uid,
            blockUid: block.uid,
            resultUid: executedBlockId
          },
          execution
        )
      };

    /*
      Called when checking the execution of a block. In this case, only the specified result
      must be updated in most cases.

      If the status of the execution is successful, dependencies must be also updated
     */
    case NotebooksActionTypes.UPDATED_NOTEBOOK_PAGE_BLOCK_EXECUTION:
      const { id: checkExecutedBlockId, page: checkExecutedPage, execution: currentExecution } = action.payload;
      return {
        ...state,
        savingPageStatus: ApiStatus.LOADED,
        notebook: handleNotebookUpdates(
          state.notebook,
          {
            notebookUid: state.notebook?.uid,
            pageUid: checkExecutedPage.uid,
            blockUid: checkExecutedBlockId,
            resultUid: currentExecution.key
          },
          action.payload.execution
        )
      };
    case NotebooksActionTypes.SAVED_NOTEBOOK_PAGES_POSITION:
      return {
        ...state,
        savingPageStatus: ApiStatus.LOADED,
        notebook: handleChangePagesPosition(state.notebook, action.payload.pagesIds)
      }
    case NotebooksActionTypes.MOVED_NOTEBOOK_PAGE_BLOCK_SUCCESS:
      return {
        ...state,
        blockAddedToTheNewPage: action.payload,
      };
      default:
        return state;
  }
}

function hasReferencesToBlock(data: any[], blockId: string) {
  for (const dataElement of data) {
    const { sqlBlock } = dataElement;
    if (!sqlBlock) continue;
    if (sqlBlock.uid === blockId) {
      return true;
    }
  }
  return false;
}

function formatValues(data: any[]) {
  return data.reduce((acc, d) => {
    const columns = Object.keys(d);
    for (const column of columns) {
      if (!acc[column]) {
        acc[column] = [];
      }
      acc[column].push(d[column]);
    }
    return acc;
  }, {});
}

/*
  Entry point function to update elements within a notebook. A notebook has the following
  structure:

    notebook
      uid
      (...)
      pages
        uid
        (...)
        blocks
          uid
          (...)
          results
            key
            (...)

  Actions are provided to update data at each level.

  The first parameter corresponds to the notebook from the current state.

  The second parameter targets the element to update. The corresponding path object
  must contain all uid to reach the element to update:

    {
      notebookUid: 'notebookUid',
      pageUid: 'pageUid',
      blockUid: 'blockUid',
      resultUid: 'executionKey'
    }

  The entries in this object correspond to the following levels:

    notebook
      uid -> path.notebookUid
      (...)
      pages
        uid -> path.pageUid
        (...)
        blocks
          uid -> path.blockUid
          (...)
          results
            key -> path.resultUid
            (...)

  The last parameter correspond to the values to update for a specific level.
 */
function handleNotebookUpdates(notebook: INotebook | null, path: any, updates: any) {
  if (!notebook) return notebook;
  const notebookUpdates = getNotebookUpdates(notebook, path, updates);
  return {
    ...notebookUpdates,
    pages: notebook.pages ?
      notebook.pages.map((page: INotebookPage) => handlePageUpdates(page, path, updates)) :
      notebook.pages
  };
}

/*
  Handle the updates on the notebook object if necessary. Otherwise, returns
  the object itself.
 */
function getNotebookUpdates(notebook: INotebook, path: any, updates: any) {
  const shouldUpdateNotebook = shouldUpdateContent(path, 'notebook', notebook.uid);
  const { pages, ...remainingUpdates } = updates;
  return shouldUpdateNotebook ?
    {
      ...notebook,
      ...remainingUpdates
    } :
    notebook;
}

/*
  Handle updates for the page level and delegate to handleBlockUpdates for the
  block level
 */
function handlePageUpdates(page: INotebookPage, path: any, updates: any) {
  if (!page) return page;
  const pageUpdates = getPageUpdates(page, path, updates);
  const shouldUpdateBlocks = shouldUpdateList(path, 'blocks', page.uid);
  const blocksWithNewOnes = addNewBlocks(page.blocks, updates.blocks);

  return {
    ...pageUpdates,
    blocks: shouldUpdateBlocks ? (
      blocksWithNewOnes ?
        blocksWithNewOnes.map((block: INotebookPageBlock) => {
          // path.blockUid = block.uid;
          return handleBlockUpdates(block, path, updates, page)
        }) :
        blocksWithNewOnes
    ): handleResultsOrThreadsOnlyInBlocks(page, path, updates)
  };
}

function addNewBlocks(oldBlocks: INotebookPageBlock[], newBlocks: INotebookPageBlock[]) {
  if (!oldBlocks && !newBlocks) {
    return null;
  }
  if (!newBlocks) {
    return oldBlocks;
  }
  return newBlocks.map(block => {
    if (!block.uid) {
      return block;
    }
    const oldBlock = oldBlocks.find(ob => ob.uid === block.uid);
    return oldBlock ? oldBlock : block;
  });
}

/*
  Handle the updates on the page object if necessary. Otherwise, returns
  the object itself.
 */
function getPageUpdates(page: INotebookPage, path: any, updates: any) {
  const shouldUpdatePage = shouldUpdateContent(path, 'page', page.uid);
  const { blocks, ...remainingUpdates } = updates;
  return shouldUpdatePage ?
    {
      ...page,
      ...remainingUpdates
    } :
    page;
}

/*
  Handle updates for the block level and delegate to handleResultsUpdates for the
  results level
 */
function handleBlockUpdates(block: INotebookPageBlock, path: any, updates: any, page: INotebookPage) {
  if (!block) return block;
  const blockUpdates = getBlockUpdates(block, path, updates, page);
  const shouldUpdateResults = shouldUpdateList(path, 'results', block.uid);

  const shouldUpdateCommentThreads = shouldUpdateList(path, 'comment_threads', block.uid);

  return {
    ...blockUpdates,
    results: shouldUpdateResults ?
      handleResultsUpdates(block.results, path, updates) :
      block.results,
    comment_threads: (shouldUpdateCommentThreads && block.comment_threads) ?
      handleCommentThreadsUpdates(block.comment_threads, path, updates) :
      block.comment_threads
  };
}

function handleResultsOrThreadsOnlyInBlocks(page: INotebookPage, path: any, updates: any) {
  const shouldUpdateResultsInBlocks = !!(path.pageUid === page.uid && path.blockUid && path.resultUid);
  const shouldUpdateThreadsInBlocks = !!(path.pageUid === page.uid && path.blockUid && path.threadUid);

  return shouldUpdateResultsInBlocks || shouldUpdateThreadsInBlocks ?
    page.blocks.map(block => handleBlockUpdates(block, path, updates, page)) :
    page.blocks;
}

function addNewResults(oldResults: INotebookPageBlockExecution[] | undefined, newResults: INotebookPageBlockExecution[] | undefined) {
  if (!oldResults && !newResults) {
    return null;
  }
  if (!newResults) {
    return oldResults;
  }
  return newResults.map(block => {
    if (!block.key) {
      return block;
    }
    const oldBlock = (oldResults || []).find(r => r.key === block.key);
    return oldBlock ? oldBlock : block;
  });
}

function getSubItemForList(item: any) {
  if (item.type === 'ul' || item.type === 'ol' || item.type === 'li') {
    return {
      ...item,
      children: item.children.map((child: any) => getSubItemForList(child))
    };
  }
  return {
    ...item,
    children: [
      {
        ...item.children[0]
      }
    ]
  };
}

/*
  Handle the updates on the block object if necessary. Otherwise, returns
  the object itself.

  Two use cases are handled regarding the build of a new block object:

  * The provided block is targetted by the path object
  * The provided block is of type 'plotly', the targetted element is an execution
    and the execution status is 'success'
 */
function getBlockUpdates(block: INotebookPageBlock, path: any, updates: any, page: INotebookPage) {
  // Update because the block is targetted
  const shouldUpdateBlock = shouldUpdateContent(path, 'block', block.uid);

  // Update because "updateBlocks" is enabled for this page. Only update text or sql in this case
  const shouldUpdateBlockFromList = (path.updateBlocks && path.pageUid === page.uid);

  if (shouldUpdateBlock) {
    return {
      ...block,
      ...updates
    };
  } else if (shouldUpdateBlockFromList) {
    const textBlockUpdates = updates.blocks.find((b: INotebookPageBlock) => b.uid === block.uid);
    if (block.type === 'sql') {
      return {
        ...block,
        name: textBlockUpdates.name,
        content_json: {
          ...block.content_json,
          sql: textBlockUpdates.content_json.sql,
          database_id: textBlockUpdates.content_json.database_id,
          limit: textBlockUpdates.content_json.limit,
        }
      }
    }
    if (block.type === 'plotly') {
      return {
        ...block,
        name: textBlockUpdates.name
      };
    }
    if (block.type === 'layout') {
      return {
        ...block,
        content_json: {
          ...block.content_json,
          width: textBlockUpdates.content_json.width,
        }
      };
    }
    if (block.type === 'ul' || block.type === 'ol') {
      return {
        ...block,
        content_json: getSubItemForList(block.content_json)
      };
    }
    if (block.type !== 'sql' && block.type !== 'plotly' && block.type !== 'parameter') {
      return {
        ...block,
        content_json: {
          ...block.content_json,
          children: block.content_json.children.map((child: any) => ({ ...child }))
        }
      };
    }
  }

  // Update dependent blocks if an execution with status "success" is targetted
  const shouldUpdateDependentBlock = (
    shouldUpdateContent(path, 'result', null) &&
    updates.status === EXECUTION_STATUS_SUCCESS &&
    block.type === BLOCK_TYPE_PLOTLY
  );
  if (shouldUpdateDependentBlock) {
    const { properties } = block.content_json;
    if (!properties) return block;
    const { data } = properties;
    if (!data) return block;

    const updatedBlockId = path.blockUid;
    const updatedExecution = updates;

    if (!hasReferencesToBlock(data, updatedBlockId)) return block;

    const updatedData = [];
    for (const dataElement of data) {
      const { sqlBlock } = dataElement;
      if (!sqlBlock) return block;

      if (sqlBlock.uid === updatedBlockId) {
        let newDataElement = {
          ...dataElement,
          possibleValues: formatValues(updatedExecution.value.data),
          options: updatedExecution.value.columns.map((column: any) => ({ value: column.name, label: column.name }))
        };
        for (const propertyKey of PROPERTIES_LINKED_TO_SQL_BLOCK) {
          if (newDataElement[propertyKey]) {
            const columnNameProperty = `${propertyKey}src`;
            const columnName = newDataElement[columnNameProperty];
            newDataElement = {
              ...newDataElement,
              [propertyKey]: updatedExecution.value.data.map((d: any) => d[columnName])
            };
          }
        }
        updatedData.push(newDataElement);
      } else {
        updatedData.push(dataElement);
      }
    }

    return {
      ...block,
      content_json: {
        ...block.content_json,
        properties: {
          ...block.content_json.properties,
          data: updatedData
        }
      }
    };
  }

  return block;
}

/*
  Handle updates for the result level and delegate to handleResultUpdates for
  result elements.

  This function is responsible of detecting if an execution must be added or
  updated.
 */
function handleResultsUpdates(results: INotebookPageBlockExecution[] | undefined, path: any, updates: any) {
  if (results) {
    const existingExecution = results.find(result => result.key === updates.key);
    if (existingExecution) {
      return results.map(result => handleResultUpdates(result, path, updates))
    }
    return [ updates ].concat(results);
  }
  return [ updates ];
}

/*
  Handle updates for the result element. Updates are done only if the current
  result oif the targetting element.
 */
function handleResultUpdates(result: INotebookPageBlockExecution, path: any, updates: any) {
  const shouldUpdateResult = shouldUpdateContent(path, 'result', result.key);
  return shouldUpdateResult ?
    {
      ...result,
      ...updates
    } :
    result;
}

/*
  Handle updates for the comment_thread level
 */
function handleCommentThreadsUpdates(commentThreads: ICommentThread[], path: any, updates: any) {
  const commentThreadUid = path.commentThreadUid as string;

  if (commentThreads) {
    const commentThread = commentThreads.find(ct => ct.uid === commentThreadUid);
    if (commentThread) {
      return commentThreads.map(ct => handleCommentThreadUpdates(ct, path, updates))
    }
  }

  return commentThreads;
}

function handleCommentThreadUpdates(commentThread: ICommentThread, path: any, updates: any) {
  const shouldUpdateCommentThread = shouldUpdateContent(path, 'comment_thread', commentThread.uid);

  return shouldUpdateCommentThread ?
    {
      ...commentThread,
      ...updates
    } :
    commentThread;
}




function shouldUpdateList(path: any, type: string, typeUid: string | null) {
  const { notebookUid, pageUid, blockUid, resultUid, commentThreadUid } = path;
  switch (type) {
    case 'blocks':
      return notebookUid &&
        pageUid &&
        pageUid === typeUid &&
        /*
          Two cases here:
          * either there is no blockUid but updateBlocks to true
          * blockUid is specified
         */
        (
          (!blockUid &&
          path.updateBlocks) ||
          blockUid
        )
    case 'results':
      return (notebookUid &&
        pageUid &&
        blockUid &&
        blockUid === typeUid &&
        resultUid
      )
    case 'comment_threads':
      return ( notebookUid &&
        pageUid &&
        blockUid &&
        blockUid === typeUid &&
        commentThreadUid
      )
    default:
      return false;
  }
}

function shouldUpdateContent(path: any, type: string, typeUid: string | null) {
  const { notebookUid, pageUid, blockUid, resultUid, commentThreadUid } = path;
  switch (type) {
    case 'notebook':
      return notebookUid &&
        !pageUid &&
        (typeUid ? notebookUid === typeUid : true);
    case 'page':
      return notebookUid &&
        pageUid &&
        !blockUid &&
        (typeUid ? pageUid === typeUid : true);
    case 'block':
      return notebookUid &&
        pageUid &&
        blockUid &&
        !resultUid &&
        !commentThreadUid &&
        (typeUid ? blockUid === typeUid : true);
    case 'result':
      return notebookUid &&
        pageUid &&
        blockUid &&
        resultUid &&
        (typeUid ? resultUid === typeUid : true);
    case 'comment_thread':
      return notebookUid &&
        pageUid &&
        blockUid &&
        commentThreadUid &&
        (typeUid ? commentThreadUid === typeUid : true);
    default:
      return false;
  }
}

function handleChangePagesPosition(notebook: INotebook | null, pagesIds: string[]) {
  if (!notebook) return notebook;
  const newPositionedPages:any = pagesIds.map(id => {
    for (let page of notebook.pages) {
      if (page.uid === id) {
        return page;
      }
    }
  });
  return {
    ...notebook,
    pages: newPositionedPages,
  };
}
