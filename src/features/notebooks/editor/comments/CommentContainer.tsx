
import React, { FunctionComponent, useCallback } from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';

import Comment from './Comment';

import { IComment, ICommentThread } from '../../../../shared/models';
import { IState } from '../../../../shared/store/reducers';


import {
  deleteComment,
  updateComment,
} from '../../../../shared/store/actions/notebookActions';

export type CommentContainerComponentProps = {
  comment: IComment;
  blockUid: string;
  commentThread: ICommentThread;
};

const CommentContainer: FunctionComponent<CommentContainerComponentProps> = ({
  comment,
  blockUid,
  commentThread
}: CommentContainerComponentProps) => {
  const user = useSelector((state: IState) => state.users.user);
  const notebook = useSelector((state: IState) => state.notebooks.notebook);
  const page = useSelector((state: IState) => state.notebooks.selectedNotebookPage);

  const dispatch = useDispatch();

  const dispatchEditComment = useCallback((id:number, commentData: IComment) => {
    if(!notebook || !page) {
      return;
    }

    const notebookUid = notebook?.uid;
    const pageUid = page?.uid;

    dispatch(updateComment(
      commentData, commentThread,  blockUid, pageUid, notebookUid,
    ))

  }, [ notebook, page, blockUid ]);

  const dispatchDeleteComment = useCallback((comment: IComment) => {
    if(!notebook || !page) {
      return;
    }

    const notebookUid = notebook?.uid;
    const pageUid = page?.uid;

    dispatch(deleteComment(
      comment.uid, commentThread,  blockUid, pageUid, notebookUid,
    ))
  }, [ notebook, page, blockUid ]);

  return user && (
      <Comment
        comment={comment}
        deleteComment={dispatchDeleteComment}
        editComment={dispatchEditComment}
        user={user}
      />
    )
}

export default CommentContainer;
