
import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CommentModalWrapper from './CommentModalWrapper';

import { useNotebookEditable } from "../../hooks/use-editable";
import { ICommentThread, ICommentThreadForUpdate } from '../../../../shared/models';
import { IState } from '../../../../shared/store/reducers';
import {
  createCommentThread,
  createComment,
  updateCommentThread,
} from '../../../../shared/store/actions/notebookActions';

type onContextMenuOpenChangeCallback = (opened: boolean) => void;
type handlePopoverInteractionCallback = (shouldOpen: boolean) => void;
type setStartNewThreadCallback = (startNewThread: boolean) => void;

export type CommentSubmitCallback = ( commentText: string, blockId: string, threadId: string | null) => boolean;

export type CommentModalWrapperContainerComponentProps = {
  blockUid: string;
  blockId: string;
  startNewThread: boolean;
  contextMenuOpened: boolean;
  onContextMenuOpenChange: onContextMenuOpenChangeCallback;
  type: string;
  commentPopoverIsOpen: boolean;
  handlePopoverInteraction: handlePopoverInteractionCallback;
  setStartNewThread: setStartNewThreadCallback;
};

const CommentModalWrapperContainer: FunctionComponent<CommentModalWrapperContainerComponentProps> = ({
  blockUid,
  blockId,
  startNewThread,
  contextMenuOpened,
  onContextMenuOpenChange,
  type,
  commentPopoverIsOpen,
  handlePopoverInteraction,
  setStartNewThread
}: CommentModalWrapperContainerComponentProps) => {
  const dispatch = useDispatch();
  const user = useSelector((state: IState) => state.users.user);
  const notebook = useSelector((state: IState) => state.notebooks.notebook);
  const selectedNotebookPage = useSelector((state: IState) => state.notebooks.selectedNotebookPage);
  const editable = useNotebookEditable();

  const currentPage = notebook && selectedNotebookPage && selectedNotebookPage.uid ?
    notebook.pages.filter((page:any) => (
      page.uid === selectedNotebookPage.uid
    ))[0] : null

  const block = currentPage ? currentPage.blocks.filter((block: any) => block.uid === blockUid )[0] : null;
  const commentThreads: ICommentThread[] = block && block.comment_threads ? block.comment_threads : []

  const onAddComment: CommentSubmitCallback = (commentText:string, blockId: string, threadId: string | null):boolean => {
    const commentData = {
      text: commentText
    }

    if(user && !threadId) {
      //create a thread and a comment immediately afterwards
      dispatch(createCommentThread(
        {
          blockId,
        },
        commentData,
      ))
      setStartNewThread(false)
    } else if(threadId) {
      dispatch(createComment({
          ...commentData,
          comment_thread_id: threadId,
        }
      ));
    }

    return true;
  };

  const onThreadUpdate = (threadId:number, uid: string, data: ICommentThreadForUpdate) => {
    dispatch(updateCommentThread(
      threadId,
      uid,
      data,
    ))
  }

  if (!editable) {
    return null;
  }

  return user && (
    <CommentModalWrapper
      blockId={blockId}
      blockUid={blockUid}
      startNewThread={startNewThread}
      commentThreads={commentThreads}
      contextMenuOpened={contextMenuOpened}
      onContextMenuOpenChange={onContextMenuOpenChange}
      type={type}
      commentPopoverIsOpen={commentPopoverIsOpen}
      handlePopoverInteraction={handlePopoverInteraction}
      onAddComment={onAddComment}
      onThreadUpdate={onThreadUpdate}
      user={user}
      />
  );
}

export default CommentModalWrapperContainer;
