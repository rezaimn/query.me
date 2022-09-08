import { ITag } from './Tag';
import { ICommentThread } from './Comment';
import { UserNames, ISharedOption, ISharedWithUser } from './User';

export interface INotebook {
  id: number;
  uid: string;
  name: string;
  tags: ITag[];
  changed_on_utc: string;
  changed_by: UserNames;
  created_on_utc: string;
  created_by: UserNames;
  last_run?: string;
  pages: INotebookPage[];
  params?: string | null;
  is_public?: boolean;
  workspace_id?: number;
}

export interface INotebookColumn {
  description: string;
  label: string;
  name: string;
  required: boolean;
  type: string;
  unique: boolean;
  validate: string[];
}

export interface INotebookFilter {
  name: string;
  operator: string;
  fillValue: boolean;
}

export interface INotebooksMetadata {
  add_columns: INotebookColumn[];
  add_title: string;
  edit_columns: INotebookColumn[];
  edit_title: string;
  filters:{
    [id: string]: INotebookFilter[];
  };
}

export interface INotebookForCreation {
  name: string;
}

export interface INotebookPageCoverImage {
  url: string,
  position: { x: number, y: number },
  created_by?: string,
  created_by_profile_url?: string,
}

export interface INotebookSharingSettings {
  is_public: boolean;
  shared_with_workspace: ISharedOption;
  shared_with_users: ISharedWithUser[];
}

export interface INotebookPage {
  uid: string;
  name: string;
  cover_image?: INotebookPageCoverImage;
  position?: number;
  blocks: INotebookPageBlock[];
}

export interface INotebookPageForCreation {
  name: string;
  notebookId: string;
  position: number;
  blocks?: INotebookPageBlock[];
  updatedCurrentPage?: INotebookPage;
}

export interface INotebookPageBlock {
  id: number;
  uid: string;
  name?: string;
  database_id?: string;
  schema?: string;
  position?: number;
  status?: string | null;
  content_json: any;
  comment_threads?: ICommentThread[];
  type?: string;
  results?: INotebookPageBlockExecution[];
}

export interface INotebookPageBlockExecution {
  key: string;
  start_time: number | null;
  status: string;
  value?: {
    columns?: {
      is_date: boolean;
      name: string;
      type: string | null;
    }[] | null;
    data?: any[] | null;
    query?: {
      block_id: number;
      changedOn: string;
      changed_on: string;
      ctas: boolean;
      db: string;
      dbId: number;
      endDttm: number | null;
      errorMessage: any;
      executedSql: string;
      extra?: {progress: any}
      id?: string;
      limit?: number;
      progress?: number;
      queryId?: number;
      resultsKey?: string | null;
      rows?: number
      savedQueryId?: number | null;
      schema?: string | null;
      serverId?: number;
      sql?: string;
      sqlEditorId?: string;
      startDttm?: number
      state?: string;
      tab?: string;
      tempSchema?: string;
      tempTable?: string;
      trackingUrl?: string | null;
      uid?: string;
      user?: string;
      userId?: number;
      // start_time: number;
    };
    extra?: any;
    expanded_columns?: {
      is_date: boolean;
      name: string;
      type: string | null;
    }[];
    selected_columns?: {
      is_date: boolean;
      name: string;
      type: string | null;
    }[];
    query_id?: number;
    status?: string;
  }
}

export interface IBlockCtrlPlusDotSelected {
  status: boolean;
  blockIndex: number;
}
