import React, { FunctionComponent } from 'react';
import {
  Icon,
  Tooltip,
  Position,
  Colors, Button,
} from '@blueprintjs/core';
import { Popover2 } from "@blueprintjs/popover2";

import { mergeStyles } from '@uifabric/styling';
import { IconNames } from '@blueprintjs/icons';

import CommentModal from './CommentModal';

import {
  ICommentThread,
  IUser,
  ICommentThreadForUpdate,
  COMMENT_THREAD_OPEN
} from '../../../../shared/models';

import './CommentModalWrapper.scss'

import { CommentSubmitCallback } from './CommentModalWrapperContainer'

type editCommentCallback = (id: number, data: {} ) => boolean;
type removeCommentCallback = (id: number ) => boolean;
type onThreadUpdateCallback = (threadId: number, uid: string, data: ICommentThreadForUpdate) => void;
type onContextMenuOpenChangeCallback = (opened: boolean) => void;
type handlePopoverInteractionCallback = (shouldOpen: boolean) => void;

type CommentModalWrapperComponentProps = {
  blockId: string;
  blockUid: string;
  startNewThread: boolean;
  commentThreads: ICommentThread[];
  contextMenuOpened: boolean;
  onContextMenuOpenChange: onContextMenuOpenChangeCallback;
  type: string;
  commentPopoverIsOpen: boolean;
  handlePopoverInteraction: handlePopoverInteractionCallback;
  onAddComment: CommentSubmitCallback;
  onThreadUpdate: onThreadUpdateCallback;
  user: IUser;
};

const CommentModalWrapper: FunctionComponent<CommentModalWrapperComponentProps> = ({
  blockId,
  blockUid,
  startNewThread,
  commentThreads,
  contextMenuOpened,
  onContextMenuOpenChange,
  type,
  commentPopoverIsOpen,
  handlePopoverInteraction,
  onAddComment,
  onThreadUpdate,
  user
}) => {
  const numOpenComments = commentThreads.filter((thread) => thread.status === COMMENT_THREAD_OPEN).reduce((accumulator, commentThread) => accumulator + commentThread.comments.length, 0)

  const hasCommentThreads = numOpenComments > 0;

  return (

        <Popover2
          content={user && (
              <CommentModal
                onCommentSubmit={onAddComment}
                onThreadUpdate={onThreadUpdate}
                startNewThread={startNewThread}
                threads={commentThreads}
                blockId={blockId}
                blockUid={blockUid}
                user={user}
              ></CommentModal>
              )
            }
            /*
              todo:  the default placement ("auto") is working best at the moment
              with "bottom-end" it is scrolling the page, when
              some combination of modifiers 'flip' and 'preventOverflow'
              With "bottom-end" it is scrolling the page, when
              might make this work.
            */
          // placement="bottom-end"
          onOpened={() => onContextMenuOpenChange(true)}
          onClosed={() => onContextMenuOpenChange(false)}
          targetTagName="div"
          isOpen={commentPopoverIsOpen}
          onInteraction={handlePopoverInteraction}
          >
            {  ( hasCommentThreads || commentPopoverIsOpen ) &&
              <Tooltip
                hoverOpenDelay={1000}
                content={<><b>Click</b> to add a comment</>}
                position={Position.BOTTOM}
              >
                <span
                  className='icon-container'
                  style={{
                    opacity: hasCommentThreads  || commentPopoverIsOpen ? 1 : 0
                  }}>
                  <Button
                    color={Colors.GRAY5}
                    icon={IconNames.COMMENT}
                    className='bp3-button bp3-minimal'
                    />
                  <span className='comment-count'> { numOpenComments  > 0 ? `${numOpenComments}`: ' ' } </span>
                </span>
              </Tooltip>
            }
        </Popover2>
  )
}

export default CommentModalWrapper;
