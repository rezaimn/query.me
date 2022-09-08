import React, {
  Fragment,
  FunctionComponent
} from 'react';

import { IComment, ICommentThread } from '../../../../shared/models';
import CommentContainer from './CommentContainer';

type CommentListComponentProps = {
  comments: IComment[];
  commentThread: ICommentThread;
  blockUid: string;
};

const CommentList: FunctionComponent<CommentListComponentProps> = ({comments, commentThread, blockUid}) => {
  return (
    <Fragment>
      { comments.map((comment) => (
            <CommentContainer
              key={comment.id}
              comment={comment}
              blockUid={blockUid}
              commentThread={commentThread}
            />
        ))
      }
    </Fragment>
  )
}

export default CommentList;
