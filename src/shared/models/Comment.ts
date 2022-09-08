import { IUser } from './Admin';

export interface IComment {
  id: number;
  uid: string;
  created_on: string;
  created_on_utc: string;
  text: string;
  created_by: IUser;
  userImage: string;
  comment_thread_id: string | null;
}

export interface ICommentForCreation {
  text: string;
  comment_thread_id: string | null;

}

export interface ICommentForCreationWithoutCommentThreadId {
  text: string;
}

export interface ICommentThread {
  id: number;
  uid: string;
  status: string;
  block_id: number;
  comments: IComment[]
}

export interface ICommentThreadForCreation {
  blockId: string;
}

export interface ICommentThreadForUpdate {
  status: string;
}

export const COMMENT_THREAD_OPEN = 'OPEN';
export const COMMENT_THREAD_CLOSED = 'CLOSED';
