import React, { FunctionComponent, useMemo, useState, useRef, useEffect } from 'react';
import {
  Button,
  Colors,
  Icon,
  Intent,
  Menu,
  MenuItem,
  Position,
  TextArea,
} from '@blueprintjs/core';

import { Popover2 } from "@blueprintjs/popover2";

import { IconNames } from '@blueprintjs/icons';
import TimeAgo from 'react-timeago';
import Avatar from '../../../../shared/components/image/Avatar';
import {
  IComment,
  IUser
} from '../../../../shared/models';
import './Comment.scss'

type editCommentCallback = (id: number, data: any ) => void;
type deleteCommentCallback = (comment: IComment ) => void;

type CommentComponentProps = {
  comment: IComment;
  editComment: editCommentCallback;
  deleteComment: deleteCommentCallback;
  user: IUser;
};

interface CommentContextMenuContentProps {
  comment: IComment;
  editComment: editCommentCallback;
  deleteComment: deleteCommentCallback;
}

const Comment: FunctionComponent<CommentComponentProps> = ({
  comment,
  editComment,
  deleteComment,
  user
}) => {
  const [editing, setEditing] = useState(false);
  const [commentPopoverIsOpen, setCommentPopoverIsOpen] = useState(false);

  useEffect(() => {
    commentEditInputRef?.current?.focus();
  }, [editing])

  const [newCommentText, setNewCommentText] = useState('');

  const isChanged = useMemo(() => comment.text !== newCommentText,
    [comment, newCommentText]
  );

  const commentEditInputRef = useRef<HTMLTextAreaElement>(null);

  const CommentContextMenuContent = React.memo(({comment, editComment, deleteComment}: CommentContextMenuContentProps) => {
    const commentData = {
      ...comment
    }

    return (
      <Menu>
          <MenuItem
            icon={IconNames.EDIT}
            text="Edit"
            onClick={() => editComment(comment.id, commentData)}
          ></MenuItem>

        <MenuItem
          icon={IconNames.REMOVE}
          text="Delete"
          onClick={() => deleteComment(comment)} />
      </Menu>
    )
  })

  const userName = useMemo(() => `${comment?.created_by?.first_name} ${comment?.created_by?.last_name}`, [comment])
  const avatar = useMemo(() => comment?.created_by?.avatar, [comment])

  const canEditOrDelete = useMemo(() => {
      return user?.email === comment?.created_by?.email;
    },
    [ user, comment ]
  );

  const handleCommentSave = (evt:any) => {
    const commentData = {
      ...comment,
      text: newCommentText
    }

    setNewCommentText('')
    setEditing(false)

    editComment(comment.id, commentData)
  }

  const onCommentEditBlur = (e: any) => {
    setEditing(false)
    setNewCommentText('')
  }

  const onCommentTextChange = (e: any) => {
    const val = e.target.value;
    setNewCommentText(val)
  }

  const numNewLines = useMemo(
    () => newCommentText.split('\n').length,
    [newCommentText]
  );

  const maxRowsTextArea = 4
  const numRowsTextArea =  numNewLines > maxRowsTextArea ? maxRowsTextArea : numNewLines

  const startEditingComment = () => {
    setNewCommentText(comment.text);
    setEditing(true)
    commentEditInputRef?.current?.focus();
  }

  return (
    <div
      className="comment"
    >
      <Avatar
        rounded={true}
        inline={false}
        image={avatar}
      />

      <div className="comment__content">
        <div className="comment__content__header">
          <div className="header-group">
            <div>{userName}</div>
            <div className="comment__content__header__time-ago">
              <TimeAgo
                minPeriod={5} // set to update every 5 seconds
                // live={false} // no updates
                date={comment?.created_on_utc}
                />
            </div>
          </div>
          { canEditOrDelete && (
          <Popover2
            targetTagName="div"
            captureDismiss={true}
            content={<CommentContextMenuContent
                comment={comment}
                editComment={startEditingComment}
                deleteComment={deleteComment}
              />}
            position={Position.BOTTOM_RIGHT}
            >
              <Icon
                className="more-icon"
                icon={IconNames.MORE}
                color={Colors.GRAY5}
                />
          </Popover2>
          )}
        </div>
        <div className="comment__content__text">
              {editing ? (<TextArea
                className="comment__content__text-input__editing"
                intent={Intent.PRIMARY}
                placeholder = "Add a comment..."
                rows={numRowsTextArea}
                onChange={onCommentTextChange}
                inputRef={commentEditInputRef}
                name="textValue"
                value={newCommentText}
              />) : (
                <div
                  style={{display: editing ? 'none' : 'initial'}}
                  className="bp3-running-text"
                >
                    {comment.text}
                </div>
              )}
          <div className="comment__edit-comment-buttons"> {editing && (<span>
            <Button
              onClick={handleCommentSave}>
              <Icon
                className=""
                icon={IconNames.TICK}
                color={Colors.GRAY1}
                />
            </Button>
          </span>)}</div>
        </div>

      </div>
    </div>
  )
}

export default Comment;
