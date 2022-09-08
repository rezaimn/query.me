import React, { FunctionComponent, useState } from 'react';
import {
  TextArea,
  Intent,
  Button,
} from '@blueprintjs/core';

import Avatar from '../../../../shared/components/image/Avatar';
import './CommentInput.scss'
import {
  IUser
} from '../../../../shared/models';

type commentSubmitCallback = ( commentText: string ) => boolean;
type CommentInputComponentProps = {
  user: IUser;
  text?: string;
  submitComment: commentSubmitCallback
};

const CommentInput: FunctionComponent<CommentInputComponentProps> = ({
  user,
  text,
  submitComment
}) => {
  const [commentText,setCommentText] = useState(text ? text : '');

  const handleChange = (evt:any) => {
    const { value } = evt.target
    const inputIsEmpty = !(value && value.length > 0);
    setCommentText(value);
    setInputEmpty(inputIsEmpty);
  }
  const [ inputEmpty, setInputEmpty ] = useState(true);

  const handleSubmit = () => {
    submitComment(commentText);
    setCommentText('');
    setInputEmpty(true);
  }

  const avatar = user?.avatar || ''
  const numNewLines = commentText.split('\n').length
  const maxRowsTextArea = 4
  const numRowsTextArea =  numNewLines > maxRowsTextArea ? maxRowsTextArea : numNewLines

  return (
    <div className="comment comment-input">
      <Avatar
        rounded={true}
        inline={false}
        image={avatar}
      />
      <div className="comment__content">
        <TextArea
          className="comment__content__text-input"
          intent={Intent.PRIMARY}
          onChange={handleChange}
          value={commentText}
          placeholder = "Add a comment..."
          rows={numRowsTextArea}
        />
      </div>
      <Button
        disabled={inputEmpty}
        className="comment__send-btn"
        onClick={handleSubmit}
        intent={Intent.PRIMARY}>Send</Button>
    </div>
  )
}

export default CommentInput;
