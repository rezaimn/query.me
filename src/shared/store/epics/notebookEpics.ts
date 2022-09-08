import {combineEpics, Epic} from 'redux-observable';
import {from, of} from 'rxjs';
import {
  switchMap,
  map,
  startWith,
  catchError,
  filter,
  tap
} from 'rxjs/operators';
import {isOfType} from 'typesafe-actions';
import {Position, Toaster, Intent} from '@blueprintjs/core';
import {routerActions} from 'connected-react-router';
import {IComment} from '../../models/';

import {
  NotebooksAction,
  NotebooksActionTypes,
  loadedNotebooks,
  loadingNotebooks,
  loadingNotebooksFailed,
  loadedNotebooksMetadata,
  loadingNotebooksMetadata,
  loadingNotebooksMetadataFailed,
  loadedNotebook,
  loadingNotebook,
  loadingNotebookFailed,
  loadedNotebookAlias,
  loadingNotebookAlias,
  loadingNotebookAliasFailed,
  loadedNotebookSharingSettings,
  loadingNotebookSharingSettings,
  loadingNotebookSharingSettingsFailed,
  loadedCurrentUserPermissions,
  loadingCurrentUserPermissions,
  loadingCurrentUserPermissionsFailed,
  createdNotebook,
  creatingNotebook,
  creatingNotebookFailed,
  createdCommentThread,
  creatingCommentThread,
  creatingCommentThreadFailed,
  createdComment,
  creatingComment,
  creatingCommentFailed,
  deletedComment,
  updatingComment,
  updatingCommentFailed,
  updatedComment,
  deletingComment,
  deletingCommentFailed,
  savedCommentThread,
  savingCommentThread,
  savingCommentThreadFailed,
  savedNotebook,
  savingNotebook,
  savingNotebookFailed,
  removedNotebook,
  removingNotebook,
  removingNotebookFailed,
  duplicatedNotebook,
  duplicatingNotebook,
  duplicatingNotebookFailed,
  executedNotebook,
  executingNotebook,
  executingNotebookFailed,
  sharedNotebookWithUser,
  sharingNotebookWithUser,
  sharingNotebookWithUserFailed,
  sharedNotebookWithPublic,
  sharedNotebookWithWorkspace,
  sharingNotebookWithWorkspace,
  sharingNotebookWithWorkspaceFailed,
  createdNotebookPage,
  creatingNotebookPage,
  creatingNotebookPageFailed,
  savedNotebookPage,
  savingNotebookPage,
  savingNotebookPageFailed,
  savedNotebookPageBlocks,
  savingNotebookPageBlocks,
  savingNotebookPageBlocksFailed,
  removedNotebookPage,
  removingNotebookPage,
  removingNotebookPageFailed,
  executedNotebookPage,
  executingNotebookPage,
  executingNotebookPageFailed,
  savedNotebookPageBlock,
  savingNotebookPageBlock,
  savingNotebookPageBlockFailed,
  canLoadMoreNotebooks,
  savingNotebookPagesPosition,
  savingNotebookPagesPositionFailed,
  savedNotebookPagesPosition,
  movedNotebookPageBlockSuccess
} from '../actions/notebookActions';

import {
  loadedView,
  clearView
} from '../actions/viewActions'
import {
  selectHeaderTitle
} from '../actions/uiActions';
import {IState} from '../reducers';
import {IParams} from '../../models';
import {
  getNotebooks,
  getNotebooksMetadata,
  getNotebook,
  getNotebookByAlias,
  getNotebookSharingSettings,
  getCurrentUserPermissions,
  createNotebook,
  createCommentThreadAndComment,
  updateCommentThread,
  createComment,
  updateComment,
  deleteComment,
  saveNotebook,
  removeNotebook,
  duplicateNotebook,
  executeNotebook,
  shareNotebookWithUser,
  shareNotebookWithWorkspace,
  createNotebookPage,
  saveNotebookPage,
  saveNotebookPageBlocks,
  removeNotebookPage,
  executeNotebookPage,
  saveNotebookPageBlock, saveNotebookPagesPosition,
} from '../../services/notebooksApi';

import {getView} from '../../services/viewsApi';
import {canLoadMoreDataForInfiniteScroll} from '../../utils/canLoadMoreDataForInfiniteScroll';
import { downloadImageFromUnsplash } from '../../services/unsplashApi';

const removeViewToaster = Toaster.create({
  className: 'recipe-toaster',
  position: Position.TOP
});

const executeToaster = Toaster.create({
  className: 'execute-toaster',
  position: Position.TOP
});

const loadNotebooksEpic: Epic<NotebooksAction, NotebooksAction, IState> = (
  action$,
  state$,
  {dispatch}
) =>

  action$.pipe(
    filter(isOfType(NotebooksActionTypes.LOAD_NOTEBOOKS)),
    switchMap(action =>

      action.payload && action.payload.viewId ?
        // Get notebooks for a specific view
        from(getView(action.payload.viewId)).pipe(
          switchMap(view => {
            dispatch(loadedView(view.result));

            const viewResult = view.result;
            let params = {} as IParams;
            if (viewResult && viewResult.params) {
              params = JSON.parse(viewResult.params);
            }
            // If there are some filters, use them instead of
            // the ones from the view. It's typically for the case
            // when the filters are updated.
            if (action.payload.filters) {
              params.filters = action.payload.filters;
            }
            if (action.payload.page_size) {
              params.page = action.payload.page;
              params.page_size = action.payload.page_size;
            }
            return from(getNotebooks(params, action.payload.sort, action.payload.type)).pipe(
              map(response => ({
                response, params
              }))
            );
          }),
          map(({response, params}) =>{
            dispatch(canLoadMoreNotebooks(canLoadMoreDataForInfiniteScroll(response, action)));
            return loadedNotebooks(response.result, params, action.payload.reload, action.payload.sort);
          }),
          startWith(loadingNotebooks()),
          catchError((err) => {
            console.log('err = ', err);
            return of(loadingNotebooksFailed());
          })
        ) :
        // Get all notebooks
        from(getNotebooks({
          filters: action.payload.filters,
          page: action.payload.page,
          page_size: action.payload.page_size
        }, action.payload.sort, action.payload.type)).pipe(
          tap(() => {
            dispatch(clearView());
          }),
          map((response: any) => {
            dispatch(canLoadMoreNotebooks(canLoadMoreDataForInfiniteScroll(response, action)));
            return loadedNotebooks(response.result, action.payload.filters ? {
              filters: action.payload.filters
            } : undefined,action.payload.reload, action.payload.sort);
          }),
          startWith(loadingNotebooks()),
          catchError((err) => {
            console.log('err = ', err);
            return of(loadingNotebooksFailed());
          })
        )
    )
  );

const loadNotebooksMetadataEpic: Epic<NotebooksAction, NotebooksAction, IState, any> = (
  action$,
  state$,
  {dispatch}
) =>
  action$.pipe(
    filter(isOfType(NotebooksActionTypes.LOAD_NOTEBOOKS_METADATA)),
    switchMap(action =>
      from(getNotebooksMetadata()).pipe(
        map((response: any) => loadedNotebooksMetadata(response)),
        startWith(loadingNotebooksMetadata()),
        catchError(() => of(loadingNotebooksMetadataFailed()))
      )
    )
  );

const loadNotebookEpic: Epic<NotebooksAction, NotebooksAction, IState, any> = (
  action$,
  state$,
  {dispatch}
) =>
  action$.pipe(
    filter(isOfType(NotebooksActionTypes.LOAD_NOTEBOOK)),
    switchMap(action =>
      from(getNotebook(action.payload.notebookId)).pipe(
        tap((response: any) => {
          dispatch(selectHeaderTitle(
            response.result.name,
            action.payload.notebookId
          ));
        }),
        map((response: any) => loadedNotebook(response.result, action.payload.pageId)),
        startWith(loadingNotebook(action.payload.notebookId, action.payload.pageId)),
        catchError(() => of(loadingNotebookFailed()))
      )
    )
  );

const loadNotebookAliasEpic: Epic<NotebooksAction, NotebooksAction, IState, any> = (
  action$,
  state$,
  {dispatch}
) =>
  action$.pipe(
    filter(isOfType(NotebooksActionTypes.LOAD_NOTEBOOK_ALIAS)),
    switchMap(action =>
      from(getNotebookByAlias(action.payload)).pipe(
        map((response: any) => loadedNotebookAlias(response.result)),
        startWith(loadingNotebookAlias()),
        catchError(() => of(loadingNotebookAliasFailed()))
      )
    )
  );

const loadNotebookSharingSettingsEpic: Epic<NotebooksAction, NotebooksAction, IState, any> = (
  action$,
  state$,
  {dispatch}
) =>
  action$.pipe(
    filter(isOfType(NotebooksActionTypes.LOAD_NOTEBOOK_SHARING_SETTINGS)),
    switchMap(action =>
      from(getNotebookSharingSettings(action.payload)).pipe(
        map((response: any) => loadedNotebookSharingSettings(response.result)),
        startWith(loadingNotebookSharingSettings()),
        catchError(() => of(loadingNotebookSharingSettingsFailed()))
      )
    )
  );

const loadCurrentUserPermissionsEpic: Epic<NotebooksAction, NotebooksAction, IState, any> = (
  action$,
  state$,
  {dispatch}
) =>
  action$.pipe(
    filter(isOfType(NotebooksActionTypes.LOAD_CURRENT_USER_PERMISSIONS)),
    switchMap(action =>
      from(getCurrentUserPermissions(action.payload.uid, action.payload.userId)).pipe(
        map((response: any) => loadedCurrentUserPermissions(response.result)),
        startWith(loadingCurrentUserPermissions()),
        catchError(() => of(loadingCurrentUserPermissionsFailed()))
      )
    )
  );

const createNotebookEpic: Epic<NotebooksAction, NotebooksAction, IState, any> = (
  action$,
  state$,
  {dispatch}
) =>
  action$.pipe(
    filter(isOfType(NotebooksActionTypes.CREATE_NOTEBOOK)),
    switchMap(action =>
      from(createNotebook(action.payload)).pipe(
        tap((response: any) => {
          removeViewToaster.show({
            message: "Notebook successfully created.",
            intent: Intent.SUCCESS
          });
          /* const viewType = response.result.view_type.toLowerCase();
          dispatch(loadNotebooks(viewType)); */
          // dispatch(loadNotebooks({}));
          dispatch(routerActions.push(`/n/${response.uid}`));
        }),
        map((response: any) => createdNotebook(response)),
        startWith(creatingNotebook(action.payload)),
        catchError((err) => {
          console.log(err);
          removeViewToaster.show({
            message: "An error occurs when creating the notebook.",
            intent: Intent.DANGER
          });
          return of(creatingNotebookFailed());
        })
      )
    )
  );

const createCommentThreadEpic: Epic<NotebooksAction, NotebooksAction, IState, any> = (
  action$,
  state$,
  {dispatch}
) =>
  action$.pipe(
    filter(isOfType(NotebooksActionTypes.CREATE_COMMENT_THREAD)),
    switchMap(action =>
      from(createCommentThreadAndComment(
        action.payload.commentThread,
        action.payload.comment,
        )
      )
        .pipe(
          map((response: any) => {
            const commentThread = {
              ...response,
              comments: response.comments.map((comment: IComment) => {
                return {
                  ...comment,
                  created_by: state$.value.users.user
                }
              })
            }

            return createdCommentThread(commentThread)
          }),
          startWith(creatingCommentThread(action.payload.commentThread)),
          catchError((err) => {
            console.log(err);
            removeViewToaster.show({
              message: "An error occurs when creating the CommentThread.",
              intent: Intent.DANGER
            });
            return of(creatingCommentThreadFailed());
          })
        )
    )
  );

const updateCommentThreadEpic: Epic<NotebooksAction, NotebooksAction, IState, any> = (
  action$,
  state$,
  {dispatch}
) =>
  action$.pipe(
    filter(isOfType(NotebooksActionTypes.UPDATE_COMMENT_THREAD)),
    switchMap(action =>
      from(updateCommentThread(action.payload.id, action.payload.uid, action.payload.commentThread)).pipe(
        map((response: any) => savedCommentThread(response)),
        startWith(savingCommentThread(action.payload.id, action.payload.uid, action.payload.commentThread)),
        catchError(() => {
          removeViewToaster.show({
            message: "An error occured when updating this thread.",
            intent: Intent.DANGER
          });
          return of(savingCommentThreadFailed());
        })
      )
    )
  );

const createCommentEpic: Epic<NotebooksAction, NotebooksAction, IState, any> = (
  action$,
  state$,
  {dispatch}
) =>
  action$.pipe(
    filter(isOfType(NotebooksActionTypes.CREATE_COMMENT)),
    switchMap(action =>
      from(createComment(action.payload.comment)).pipe(
        map((response: any) => createdComment(response, state$.value.users.user)),
        startWith(creatingComment(action.payload.comment)),
        catchError((err) => {
          console.log(err);
          removeViewToaster.show({
            message: "An error occurs when creating the Comment.",
            intent: Intent.DANGER
          });
          return of(creatingCommentFailed());
        })
      )
    )
  );

  const updateCommentEpic: Epic<NotebooksAction, NotebooksAction, IState, any> = (
    action$,
    state$,
    { dispatch }
  ) =>
    action$.pipe(
      filter(isOfType(NotebooksActionTypes.UPDATE_COMMENT)),
      switchMap(action =>
        from(updateComment(action.payload.comment)).pipe(
          map((response: any) => updatedComment(action.payload.comment, action.payload.commentThread, action.payload.blockUid,  action.payload.pageUid, action.payload.notebookUid)),
          startWith(updatingComment(action.payload.comment)),
          catchError((err) => {
            console.log(err);
            removeViewToaster.show({
              message: "An error occurred when updating the comment.",
              intent: Intent.DANGER
            });
            return of(updatingCommentFailed());
          })
        )
      )
    );

  const deleteCommentEpic: Epic<NotebooksAction, NotebooksAction, IState, any> = (
    action$,
    state$,
    { dispatch }
  ) =>
    action$.pipe(
      filter(isOfType(NotebooksActionTypes.DELETE_COMMENT)),
      switchMap(action =>
        from(deleteComment(action.payload.commentUid)).pipe(
          map((response: any) => deletedComment(action.payload.commentUid, action.payload.commentThread, action.payload.blockUid,  action.payload.pageUid, action.payload.notebookUid)),
          startWith(deletingComment(action.payload.commentUid)),
          catchError((err) => {
            console.log(err);
            removeViewToaster.show({
              message: "An error occurred when deleting the comment.",
              intent: Intent.DANGER
            });
            return of(deletingCommentFailed());
          })
        )
      )
    );

const saveNotebookEpic: Epic<NotebooksAction, NotebooksAction, IState, any> = (
  action$,
  state$,
  {dispatch}
) =>
  action$.pipe(
    filter(isOfType(NotebooksActionTypes.SAVE_NOTEBOOK)),
    switchMap(action =>
      from(saveNotebook(action.payload.id, action.payload.notebook)).pipe(
        tap((response) => {
          dispatch(selectHeaderTitle(
            response.result.name,
            action.payload.id
          ));
          removeViewToaster.show({
            message: "Notebook successfully saved.",
            intent: Intent.SUCCESS
          });
        }),
        map((response: any) => {
          if (action.payload.notebook.hasOwnProperty('is_public')) {
            dispatch(sharedNotebookWithPublic(action.payload.notebook.is_public as boolean));
          }
          return savedNotebook(response.result);
        }),
        startWith(savingNotebook(action.payload.id, action.payload.notebook)),
        catchError(() => {
          removeViewToaster.show({
            message: "An error occurs when saving the notebook.",
            intent: Intent.DANGER
          });
          return of(savingNotebookFailed());
        })
      )
    )
  );

const removeNotebookEpic: Epic<NotebooksAction, NotebooksAction, IState, any> = (
  action$,
  state$,
  {dispatch}
) =>
  action$.pipe(
    filter(isOfType(NotebooksActionTypes.REMOVE_NOTEBOOK)),
    switchMap(action =>
      from(removeNotebook(action.payload)).pipe(
        tap(() => {
          removeViewToaster.show({
            message: "Notebook successfully removed.",
            intent: Intent.SUCCESS
          });
        }),
        map((response: any) => removedNotebook(action.payload)),
        startWith(removingNotebook(action.payload)),
        catchError(() => {
          removeViewToaster.show({
            message: "An error occurs when removing the notebook.",
            intent: Intent.DANGER
          });
          return of(removingNotebookFailed());
        })
      )
    )
  );

const duplicateNotebookEpic: Epic<NotebooksAction, NotebooksAction, IState, any> = (
  action$,
  state$,
  {dispatch}
) =>
  action$.pipe(
    filter(isOfType(NotebooksActionTypes.DUPLICATE_NOTEBOOK)),
    switchMap(action =>
      from(duplicateNotebook(action.payload)).pipe(
        tap(() => {
          removeViewToaster.show({
            message: "Copy successfully created.",
            intent: Intent.SUCCESS
          });
        }),
        map((response: any) => duplicatedNotebook(response.result)),
        startWith(duplicatingNotebook(action.payload)),
        catchError(() => {
          removeViewToaster.show({
            message: "An error occurred while creating a copy of your notebook.",
            intent: Intent.DANGER
          });
          return of(duplicatingNotebookFailed());
        })
      )
    )
  );

const executeNotebookEpic: Epic<NotebooksAction, NotebooksAction, IState, any> = (
  action$,
  state$,
  {dispatch}
) =>
  action$.pipe(
    filter(isOfType(NotebooksActionTypes.EXECUTE_NOTEBOOK)),
    switchMap(action =>
      from(executeNotebook(action.payload)).pipe(
        tap(() => {
          executeToaster.show({
            message: "Executing notebook blocks.",
            intent: Intent.SUCCESS
          });
        }),
        map((response: any) => executedNotebook(response)),
        startWith(executingNotebook()),
        catchError(() => of(executingNotebookFailed()))
      )
    )
  );

const shareNotebookWithUserEpic: Epic<NotebooksAction, NotebooksAction, IState, any> = (
  action$,
  state$,
  {dispatch}
) =>
  action$.pipe(
    filter(isOfType(NotebooksActionTypes.SHARE_NOTEBOOK_WITH_USER)),
    switchMap(action =>
      from(shareNotebookWithUser(
        action.payload.notebookUid,
        action.payload.userUid,
        action.payload.permission)
      ).pipe(
        map((response: any) => sharedNotebookWithUser(response.result)),
        startWith(sharingNotebookWithUser()),
        catchError(() => of(sharingNotebookWithUserFailed()))
      )
    )
  );

const shareNotebookWithWorkspaceEpic: Epic<NotebooksAction, NotebooksAction, IState, any> = (
  action$,
  state$,
  {dispatch}
) =>
  action$.pipe(
    filter(isOfType(NotebooksActionTypes.SHARE_NOTEBOOK_WITH_WORKSPACE)),
    switchMap(action =>
      from(shareNotebookWithWorkspace(action.payload.uid, action.payload.permission)).pipe(
        map((response: any) => sharedNotebookWithWorkspace(response.result)),
        startWith(sharingNotebookWithWorkspace()),
        catchError(() => of(sharingNotebookWithWorkspaceFailed()))
      )
    )
  );

const createNotebookPageEpic: Epic<NotebooksAction, NotebooksAction, IState, any> = (
  action$,
  state$,
  {dispatch}
) =>
  action$.pipe(
    filter(isOfType(NotebooksActionTypes.CREATE_NOTEBOOK_PAGE)),
    switchMap(action =>
      from(createNotebookPage(action.payload)).pipe(
        tap((response: any) => {
          removeViewToaster.show({
            message: "Notebook page successfully created.",
            intent: Intent.SUCCESS
          });
          if (action.payload.blocks && action.payload.blocks.length > 0) {
            dispatch(movedNotebookPageBlockSuccess(true));
          }
          /* const viewType = response.result.view_type.toLowerCase();
          dispatch(loadNotebooks(viewType)); */
        }),
        map((response: any) => createdNotebookPage(response.result)),
        startWith(creatingNotebookPage(action.payload)),
        catchError((err) => {
          console.log(err);
          removeViewToaster.show({
            message: "An error occurs when creating the notebook page.",
            intent: Intent.DANGER
          });
          return of(creatingNotebookPageFailed());
        })
      )
    )
  );

const saveNotebookPageEpic: Epic<NotebooksAction, NotebooksAction, IState, any> = (
  action$,
  state$,
  {dispatch}
) =>
  action$.pipe(
    filter(isOfType(NotebooksActionTypes.SAVE_NOTEBOOK_PAGE)),
    switchMap(action =>
      from(saveNotebookPage(action.payload.id, action.payload.page)).pipe(
        map((response: any) => {
          if (action.payload.downloadCoverImageUrl) {
            downloadImageFromUnsplash(action.payload.downloadCoverImageUrl).then((res: any) => {
            });
          }
          return savedNotebookPage(response);
        }),
        startWith(savingNotebookPage(action.payload.id, action.payload.page)),
        catchError(() => {
          removeViewToaster.show({
            message: "An error occurs when saving the page.",
            intent: Intent.DANGER
          });
          return of(savingNotebookPageFailed());
        })
      )
    )
  );

const saveNotebookPageBlocksEpic: Epic<NotebooksAction, NotebooksAction, IState, any> = (
  action$,
  state$,
  {dispatch}
) =>
  action$.pipe(
    filter(isOfType(NotebooksActionTypes.SAVE_NOTEBOOK_PAGE_BLOCKS)),
    switchMap(action =>
      from(saveNotebookPageBlocks(action.payload.id, action.payload.page)).pipe(
        tap((response: any) => {
          if (action.payload.blockMoved) {
            dispatch(movedNotebookPageBlockSuccess(true));
          }
        }),
        map((response: any) =>savedNotebookPageBlocks(response)),
        startWith(savingNotebookPageBlocks(action.payload.id, action.payload.page)),
        catchError(() => {
          removeViewToaster.show({
            message: "An error occurs when saving the page blocks.",
            intent: Intent.DANGER
          });
          return of(savingNotebookPageBlocksFailed());
        })
      )
    )
  );

const removeNotebookPageEpic: Epic<NotebooksAction, NotebooksAction, IState, any> = (
  action$,
  state$,
  {dispatch}
) =>
  action$.pipe(
    filter(isOfType(NotebooksActionTypes.REMOVE_NOTEBOOK_PAGE)),
    switchMap(action =>
      from(removeNotebookPage(action.payload)).pipe(
        tap(() => {
          removeViewToaster.show({
            message: "Page successfully removed.",
            intent: Intent.SUCCESS
          });
        }),
        map((response: any) => removedNotebookPage(action.payload)),
        startWith(removingNotebookPage(action.payload)),
        catchError(() => {
          removeViewToaster.show({
            message: "An error occurs when removing the page.",
            intent: Intent.DANGER
          });
          return of(removingNotebookPageFailed());
        })
      )
    )
  );

const executeNotebookPageEpic: Epic<NotebooksAction, NotebooksAction, IState, any> = (
  action$,
  state$,
  {dispatch}
) =>
  action$.pipe(
    filter(isOfType(NotebooksActionTypes.EXECUTE_NOTEBOOK_PAGE)),
    switchMap(action =>
      from(executeNotebookPage(action.payload)).pipe(
        tap(() => {
          executeToaster.show({
            message: "Executing current page blocks.",
            intent: Intent.SUCCESS
          });
        }),
        map((response: any) => executedNotebookPage(response)),
        startWith(executingNotebookPage()),
        catchError(() => of(executingNotebookPageFailed()))
      )
    )
  );

const saveNotebookPageBlockEpic: Epic<NotebooksAction, NotebooksAction, IState, any> = (
  action$,
  state$,
  {dispatch}
) =>
  action$.pipe(
    filter(isOfType(NotebooksActionTypes.SAVE_NOTEBOOK_PAGE_BLOCK)),
    switchMap(action =>
      from(saveNotebookPageBlock(action.payload.id, action.payload.block)).pipe(
        map((response: any) => savedNotebookPageBlock(action.payload.page, response)),
        startWith(savingNotebookPageBlock(action.payload.id, action.payload.page, action.payload.block)),
        catchError(() => {
          removeViewToaster.show({
            message: "An error occurs when saving the notebook page block.",
            intent: Intent.DANGER
          });
          return of(savingNotebookPageBlockFailed());
        })
      )
    )
  );

const saveNotebookPagesPositionEpic: Epic<NotebooksAction, NotebooksAction, IState, any> = (
  action$,
  state$,
  {dispatch}
) =>
  action$.pipe(
    filter(isOfType(NotebooksActionTypes.SAVE_NOTEBOOK_PAGES_POSITION)),
    switchMap(action =>
      from(saveNotebookPagesPosition(action.payload.notebookId, action.payload.notebookPagesIds)).pipe(
        map((response: any) => {
          return savedNotebookPagesPosition( action.payload.notebookPagesIds);
        }),
        startWith(savingNotebookPagesPosition()),
        catchError(() => {
          return of(savingNotebookPagesPositionFailed());
        })
      )
    )
  );

export default combineEpics(
  loadNotebooksEpic,
  loadNotebooksMetadataEpic,
  loadNotebookEpic,
  loadNotebookAliasEpic,
  loadNotebookSharingSettingsEpic,
  loadCurrentUserPermissionsEpic,
  createNotebookEpic,
  createCommentThreadEpic,
  updateCommentThreadEpic,
  createCommentEpic,
  updateCommentEpic,
  deleteCommentEpic,
  saveNotebookEpic,
  removeNotebookEpic,
  duplicateNotebookEpic,
  executeNotebookEpic,
  shareNotebookWithUserEpic,
  shareNotebookWithWorkspaceEpic,
  createNotebookPageEpic,
  saveNotebookPageEpic,
  saveNotebookPageBlocksEpic,
  removeNotebookPageEpic,
  executeNotebookPageEpic,
  saveNotebookPageBlockEpic,
  saveNotebookPagesPositionEpic
);
