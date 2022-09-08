import React, { FunctionComponent } from 'react';

import {
  ICommentThread,
  IUser,
  COMMENT_THREAD_OPEN,
  COMMENT_THREAD_CLOSED
} from '../../../../shared/models';
import CommentThreadList from './CommentThreadList'
import { UnderlinedTabs, UnderlinedTab } from '../../../../shared/components/layout/UnderlinedTabs';
import { ICommentThreadForUpdate } from '../../../../shared/models';
import './CommentModal.scss'
import { CommentSubmitCallback } from './CommentModalWrapperContainer'

type onThreadUpdateCallback = (threadId: number, uid: string, data: ICommentThreadForUpdate) => void;

type CommentModalComponentProps = {
  onCommentSubmit: CommentSubmitCallback;
  onThreadUpdate: onThreadUpdateCallback;
  startNewThread: boolean;
  threads: ICommentThread[];
  blockId: string;
  blockUid: string;
  user: IUser;
};

const CommentModal: FunctionComponent<CommentModalComponentProps> = ({
  onCommentSubmit,
  startNewThread,
  threads,
  blockId,
  user,
  onThreadUpdate,
  blockUid
}) => {
  const onSubmit = (commentText: string, threadId: string | null ):boolean => {
    return onCommentSubmit(commentText, blockId, threadId)
  };

  const handleThreadButtonClick = ( commentThreadId: number, uid: string, isOpen: boolean ) => {
    return onThreadUpdate(
      commentThreadId,
      uid,
      {
        status: isOpen ? COMMENT_THREAD_OPEN : COMMENT_THREAD_CLOSED
      }
    )
  }

  const commentThreads = threads.filter((x:any) => x.comments.length > 0)
  const openThreads = commentThreads.filter(x => x.status === COMMENT_THREAD_OPEN )
  const closedThreads = commentThreads.filter(x => x.status !== COMMENT_THREAD_OPEN )
  const numOpenComments = openThreads.length;
  const openCommentsTabTitle = `OPEN (${numOpenComments})`;
  const numResolvedComments = commentThreads.length - numOpenComments;
  const resolvedCommentsTabTitle = `RESOLVED (${numResolvedComments})`;

  return (
    <div className="comment-modal">
      <UnderlinedTabs
        defaultActiveTab="open-comment-threads"
        noTopBorder={true}
        tabSelectorHeight="3px"
        tabsMargin="0"
      >
        <UnderlinedTab id="open-comment-threads" title={openCommentsTabTitle}>
          <CommentThreadList
            handleThreadButtonClick={(id: number, uid: string) => handleThreadButtonClick(id, uid, false)}
            commentThreads={openThreads}
            user={user}
            startNewThread={startNewThread}
            submitComment={onSubmit}
            blockUid={blockUid}
          />
        </UnderlinedTab>
        <UnderlinedTab id="closed-comment-threads" title={resolvedCommentsTabTitle}>
          <CommentThreadList
            handleThreadButtonClick={(id: number, uid: string) => handleThreadButtonClick(id, uid, true)}
            commentThreads={closedThreads}
            user={user}
            startNewThread={false}
            submitComment={onSubmit}
            blockUid={blockUid}
          />
        </UnderlinedTab>
      </UnderlinedTabs>
    </div>
  )
}

export default CommentModal;
