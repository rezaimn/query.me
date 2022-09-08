import React, { FunctionComponent } from 'react';
import {
  Button,
  Icon,
  Divider
} from '@blueprintjs/core';

import {
  ICommentThread,
  IUser,
  COMMENT_THREAD_OPEN
} from '../../../../shared/models';
import CommentInput from './CommentInput'
import CommentList from './CommentList';
import { IconNames } from '@blueprintjs/icons';

type ThreadButtonClickCallback = (commentThreadId: number, uid: string) => void;
type CommentSubmitCallback = ( commentText: string, threadId: string | null ) => boolean;

type CommentThreadListComponentProps = {
  commentThreads: ICommentThread[];
  user: IUser;
  handleThreadButtonClick: ThreadButtonClickCallback;
  startNewThread: boolean;
  submitComment: CommentSubmitCallback;
  blockUid: string;
};

const CommentThreadList: FunctionComponent<CommentThreadListComponentProps> =
({commentThreads, user, handleThreadButtonClick, startNewThread, submitComment, blockUid}) => {
  return (
    <>
      { commentThreads.map((commentThread, i) => {
          return (
            <div key={commentThread.id}>
              <div className="comment-thread__list__btn-container">
                <Button onClick={() => handleThreadButtonClick(commentThread.id, commentThread.uid)} >
                  <Icon icon={IconNames.TICK} />
                  <span className="button-text">
                    { commentThread.status.toUpperCase() === COMMENT_THREAD_OPEN ? 'Resolve' : 'Reopen' }
                  </span>
                </Button>
              </div>
              <CommentList
                commentThread={commentThread}
                blockUid={blockUid}
                comments={commentThread.comments}
                />
              { commentThread.status.toUpperCase() === COMMENT_THREAD_OPEN && (
                <CommentInput
                  user={user}
                  submitComment={(commentText: string):boolean => {
                    return submitComment(commentText, `${commentThread.id}`);
                  }}
                />
               )}
              {(i < commentThreads.length - 1) && (
                <div className="comment-thread__divider"><Divider /></div>
              )}
            </div>
          )
        })
      }
      {startNewThread && (
        <div className="comment-thread__list__new-comment-thread-container">
          <div className="comment-thread__divider">
            <Divider />
          </div>
          <CommentInput
            user={user}
            submitComment={(commentText: string):boolean => {
              return submitComment(commentText, null);
            }}
          />
        </div>
      )}
    </>
  )
}

export default CommentThreadList;
