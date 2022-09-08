import { INotebookPageBlockExecution } from './../../models/Notebook';
import { ApiStatus, INotebookPageBlock, IComment, ICommentThread, IUser } from '../../models';
import { NotebooksActionTypes } from '../actions/notebookActions';
import notebooksReducer from './notebookReducer';

function createTextBlock({ id, uid, type, text, position }: { id: number; uid: string; type: string; text: string; position: number }) {
  return {
    comment_threads: [],
    content_json: {
      block_id: id,
      children: [
        {
          bold: true,
          text
        }
      ],
      id: 1627389406696,
      type,
      uid
    },
    id,
    position,
    results: [],
    status: null,
    type,
    uid
  };
}

function getTextFromTextBlock(block: any) {
  if (!block && !block.content_json && !block.content_json.children && block.content_json.children != 1) {
    return null;
  }
  return block.content_json.children[0].text;
}

function createComment(uid: string, commentThreadId: string, text: string, user: IUser):IComment {
  return {
    created_by: user,
    userImage: '',
    created_on: '2021-08-11T09:04:57.440762',
    created_on_utc: '2021-08-11T09:04:57Z',
    text: text,
    uid,
    comment_thread_id: commentThreadId,
    id: 1231231,
  }
}

function createCommentThread(commentThreadId: number, blockId: number) {
  return {
    block_id: blockId,
    comments: [],
    created_by_fk: 63,
    created_on: '2021-08-11T09:04:57.184704',
    id: commentThreadId,
    status: 'OPEN',
    uid: '7KYvDxv9XW'
  }
}

const SUCCESSFUL_EXECUTION = {
  key: 'do5X8dBXge',
  start_time: 1627401126103.139,
  status: 'success',
  value: {
    columns: [
      {
        is_date: false,
        name: 'pg_sleep',
        type: 'STRING'
      }
    ],
    data: [
      {
        pg_sleep: ''
      }
    ],
    expanded_columns: [],
    query: {
      block_id: 7897,
      changedOn: '2021-07-27T15:52:06.270666',
      changed_on: '2021-07-27T15:52:06.270666',
      ctas: false,
      db: 'test tte1',
      dbId: 16,
      endDttm: 1627401136355.771,
      errorMessage: null,
      executedSql: 'select pg_sleep(10)\nLIMIT 1000',
      extra: {
        progress: null
      },
      id: '9f8e9bbd39',
      limit: 1000,
      progress: 100,
      queryId: 1894,
      resultsKey: null,
      rows: 1,
      savedQueryId: null,
      schema: null,
      serverId: 1894,
      sql: 'select pg_sleep(10)',
      sqlEditorId: 'BlockTypeSql',
      startDttm: 1627401126103.139,
      state: 'success',
      tab: 'query_123443',
      tempSchema: '',
      tempTable: '',
      trackingUrl: null,
      uid: 'do5X8dBXge',
      user: 'Thierry Templier',
      userId: 36
    },
    query_id: 1894,
    selected_columns: [
      {
        is_date: false,
        name: 'pg_sleep',
        type: 'STRING'
      }
    ],
    status: 'success'
  }
};


const USER1 = {
  avatar: 'https://s.gravatar.com/avatar/998f29995d02cfb6757c3dcc357be2d9?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fju.png',
  created_on: '2021-04-08T22:11:24.676308',
  created_on_utc: '2021-04-08T22:11:24Z',
  current_organization_created_at: 'Thu, 08 Apr 2021 22:11:24 GMT',
  current_organization_name: 'blablooblee',
  current_organization_uid: 'e98j1zEk45',
  current_workspace_id: 30,
  email: 'hermano_dublianskolo@blablooblee.com',
  first_name: 'hermano',
  last_name: 'dublianskolo',
  logged_in: true,
  roles: [
    {
      name: 'Admin',
      uid: 'zyGRxV4Llv',
      id: '165',
    }
  ],
  uid: '06eNXnDqjO',
  username: 'hermano_dublianskolo',
  id: 1241324,
  current_organization_id: "25",
  last_login: "2021-10-15T17:33:00Z",
  login_count: 1,
};

const RUNNING_EXECUTION: INotebookPageBlockExecution = {
  key: "do5X8dBXge",
  start_time: 1627557766721.571,
  status: "running",
  value: {
    columns: [
      {
        is_date: false,
        name: "pg_sleep",
        type:"STRING"
      }
    ],
    expanded_columns: [],
    data: [
    ],
    query: {
      block_id:8311,
      changedOn:"Thu, 29 Jul 2021 11:22:47 GMT",
      changed_on:"2021-07-29T11:22:47.091120",
      ctas:false,
      db:"test tte1",
      dbId:16,
      endDttm:null,
      errorMessage:null,
      executedSql:"select pg_sleep(100) LIMIT 100"
    },
    extra: {
      id:"66653b8ddc",
      limit:100,
      progress:0,
      queryId:1972,
      resultsKey:null,
      rows:null,
      savedQueryId:null,
      schema:null,
      serverId:1972,
      sql:"select pg_sleep({{ test }})",
      sqlEditorId:"BlockTypeSql",
      startDttm:1627557766721.571,
      state:"running",
      tab:"query_23davbf",
      tempSchema:"",
      tempTable:"",
      trackingUrl:null,
      uid:"rdX27PWJkj",
      user:"Thierry Templier",
      userId:36
    },
    query_id: 1972,
    status: "running"
  }
};

function createSqlBlock({ id, uid, name, sql, position, execution = 'running' }: { id: number; uid: string; name: string; sql: string; position: number; execution?: string }) {
  return {
    comment_threads: [],
    content_json: {
      block_id: id,
      children: [
        {
          text: ' '
        }
      ],
      database_id: 'wN34Xr05Ap',
      id: 1627393093047,
      newBlock: true,
      sql,
      type: 'sql',
      uid
    },
    id,
    name,
    position,
    results: [
      execution === 'running' ? RUNNING_EXECUTION : SUCCESSFUL_EXECUTION,
      {
        key: 'njrJvG8Dzv',
        start_time: 1627401109132.7878,
        status: 'success',
        value: {}
      },
      {
        key: '8npXrbMXjk',
        start_time: 1627401087112.685,
        status: 'success',
        value: {}
      },
      {
        key: '8ywDyQ3D35',
        start_time: 1627401052947.0989,
        status: 'success',
        value: {}
      },
      {
        key: '152JEEEJdg',
        start_time: 1627401038148.125,
        status: 'success',
        value: {}
      },
      {
        key: '42l0PbpJP6',
        start_time: 1627400958476.27,
        status: 'success',
        value: {}
      },
      {
        key: 'AKqXVpPDaN',
        start_time: 1627400819027.7659,
        status: 'success',
        value: {}
      },
      {
        key: 'ezwD1n30a3',
        start_time: 1627400710778.2441,
        status: 'success',
        value: {}
      },
      {
        key: '531XLwx0pe',
        start_time: 1627400654191.094,
        status: 'success',
        value: {}
      },
      {
        key: 'dLaDOQwXz9',
        start_time: 1627400586018.923,
        status: 'success',
        value: {}
      }
    ],
    status: null,
    type: 'sql',
    uid: 'GM7v8GJQv4'
  };
}

function createChartBlock({ id, uid, name, position }: { id: number; uid: string; name: string; position: number }) {
  return             {
    comment_threads: [],
    content_json: {
      block_id: id,
      children: [
        {
          text: ' '
        }
      ],
      id,
      newBlock: true,
      properties: {
        data: [
          {
            meta: {
              columnNames: {
                x: '',
                y: ''
              }
            },
            mode: 'markers',
            options: [
              {
                label: 'category',
                value: 'category'
              },
              {
                label: 'sales',
                value: 'sales'
              }
            ],
            possibleValues: {
              category: [
                'Furniture',
                'Furniture',
                'Office Supplies',
                'Furniture'
              ],
              sales: [
                262,
                732,
                15,
                958
              ]
            },
            sqlBlock: {
              name: 'query_24',
              uid: 'nZ7YYD073B'
            },
            type: 'scatter',
            x: [
              262,
              732,
              15,
              958
            ],
            xsrc: 'sales'
          }
        ],
        frames: [],
        layout: {
          autosize: true,
          mapbox: {
            style: 'open-street-map'
          },
          xaxis: {
            autorange: true,
            range: [
              -50.79327825760421,
              1015.7932782576042
            ],
            type: 'linear'
          },
          yaxis: {
            autorange: true,
            range: [
              -0.6592356687898089,
              9.659235668789808
            ]
          }
        }
      },
      type: 'plotly',
      uid: 'p07xv48Qjr'
    },
    id,
    name,
    position,
    results: [],
    status: null,
    type: 'plotly',
    uid
  };
}

function expectPageBlocksUnchanged(newBlocks: INotebookPageBlock[], oldBlocks: INotebookPageBlock[], excepts?: string[]) {
  for (const oldBlock of oldBlocks) {
    const newBlock = newBlocks.find(nb => nb.uid === oldBlock.uid);
    if (!excepts || !excepts.includes(oldBlock.uid)) {
      expect(JSON.stringify(oldBlock)).toEqual(JSON.stringify(newBlock));
    }
  }
}

const DEFAULT_NOTEBOOK_STATE = {
  loadingListStatus: ApiStatus.LOADING,
  loadingMetadataStatus: ApiStatus.LOADING,
  loadingStatus: ApiStatus.LOADED,
  addingStatus: ApiStatus.LOADED,
  removingStatus: ApiStatus.LOADED,
  duplicatingStatus: ApiStatus.LOADED,
  addingPageStatus: ApiStatus.LOADED,
  savingPageStatus: ApiStatus.LOADED,
  removingPageStatus: ApiStatus.LOADED,
  addingCommentStatus: ApiStatus.LOADED,
  savingCommentStatus: ApiStatus.LOADED,
  deletingCommentStatus: ApiStatus.LOADED,
  updatingCommentStatus: ApiStatus.LOADED,
  savingCommentThreadStatus: ApiStatus.LOADED,
  notebooks: [],
  duplicatedNotebook: null,
  canLoadMoreNotebooks: false,
  notebooksParams: {},
  notebooksMetadata: null,
  currentSharingSettings: null,
  currentUserPermissions: null,
  blockAddedToTheNewPage: null,
};

const NOTEBOOK_PAGE1_UID = 'DGm02r70zx';
const NOTEBOOK_PAGE1_BLOCKS = [
  createTextBlock({ id: 7827, uid: 'WKQJY69X1L', text: 'Page title', type: 'h1', position: 1 }),
  createTextBlock({ id: 7828, uid: 'pzQ58dlXY9', text: 'Some text', type: 'p', position: 2 }),
  createTextBlock({ id: 7834, uid: 'OL7yjEEXAw', text: 'Some other text', type: 'p', position: 3 })
];

const NOTEBOOK_PAGE2_UID = '86R9dbGNko';
const NOTEBOOK_PAGE2_BLOCKS = [
  createTextBlock({ id: 7829, uid: 'l9QPyRJodM', text: 'Page title', type: 'h1', position: 1 }),
  createTextBlock({ id: 7831, uid: 'MOokVz2QbJc', text: 'test123', type: 'p', position: 2 }),
  createSqlBlock({ id: 7832, uid: 'MOokVz2QbJd', name: 'query_1', sql: 'select pg_sleep(10)', position: 3 }),
  createTextBlock({ id: 7937, uid: 'J37zEEroVP', text: 'trest', type: 'p', position: 4 }),
  createChartBlock({ id: 7835, uid: 'MOokVz2QbJa', name: 'chart_1', position: 5 }),
];

const NOTEBOOK_PAGE1 = {
  blocks: NOTEBOOK_PAGE1_BLOCKS,
  cover_image: undefined,
  id: 905,
  name: 'Page 1',
  uid: NOTEBOOK_PAGE1_UID
};

const NOTEBOOK1 = {
  active: null,
  id: 256,
  is_public: false,
  name: 'Untitled - 2021-07-27',
  tags: [],
  changed_on_utc: '',
  created_by: {
    id: '',
    first_name: '',
    last_name: '',
    email: '',
  },
  changed_by: {
    id: '',
    first_name: '',
    last_name: '',
    email: ''
  },
  last_run: '',
  pages: [
    NOTEBOOK_PAGE1,
    {
      blocks: NOTEBOOK_PAGE2_BLOCKS,
      cover_image: undefined,
      id: 906,
      name: 'Page 2',
      uid: NOTEBOOK_PAGE2_UID
    }
  ],
  params: null,
  uid: '4pvbkMXLeX',
  workspace_id: 20,
  created_on_utc: '2021-10-07T00:00:00Z'
};

const NOTEBOOKS_STATE = {
  ...DEFAULT_NOTEBOOK_STATE,
  notebook: NOTEBOOK1,
  selectedNotebookPage: null,
  selectedNotebookPageBlockId: null,
  selectedNotebookPageBlock: null,
  showConfigs: false,
};

describe('notebookReducer', () => {

  describe('blocks level', () => {
    /*
      Add a new text block and the corresponding block was added (and only
      in the current page).
     */
    it('add a new block', () => {
      const newBlock = createTextBlock({ id: 7938, uid: 'J37zEEroVYa', text: 'trest', type: 'p', position: 6 });
      const newState = notebooksReducer(NOTEBOOKS_STATE, {
        type: NotebooksActionTypes.SAVED_NOTEBOOK_PAGE_BLOCKS,
        payload: {
          page: {
            blocks: [
              ...NOTEBOOK_PAGE2_BLOCKS,
              newBlock,
            ],
            cover_image: undefined,
            name: 'Page 23',
            uid: NOTEBOOK_PAGE2_UID
          }
        }
      });

      const currentPage = newState.notebook?.pages.find(page => page.uid === NOTEBOOK_PAGE2_UID);
      // expect(currentPage?.name).toEqual('Page 2');
      expect(currentPage?.cover_image).toEqual(undefined);
      expect(currentPage?.blocks.length).toEqual(6);
      expect(JSON.stringify(currentPage?.blocks[5])).toEqual(JSON.stringify(newBlock));
      expectPageBlocksUnchanged(currentPage?.blocks || [], NOTEBOOK_PAGE2_BLOCKS, [newBlock.uid]);

      const otherPage = newState.notebook?.pages.find(page => page.uid === NOTEBOOK_PAGE1_UID);
      expectPageBlocksUnchanged(otherPage?.blocks || [], NOTEBOOK_PAGE1_BLOCKS);
    });

    /*
      Update the content of a text block and check the corresponding block was updated (and only
      this one).
     */
    /* it('update a text block', () => {
      const updatedBlock = createTextBlock({ id: 7937, uid: 'J37zEEroVP', text: 'another test', type: 'p', position: 4 });
      const newState = notebooksReducer(NOTEBOOKS_STATE, {
        type: NotebooksActionTypes.SAVED_NOTEBOOK_PAGE_BLOCKS,
        payload: {
          page: {
            blocks: [
              NOTEBOOK_PAGE2_BLOCKS[0],
              NOTEBOOK_PAGE2_BLOCKS[1],
              NOTEBOOK_PAGE2_BLOCKS[2],
              updatedBlock,
              NOTEBOOK_PAGE2_BLOCKS[4]
            ],
            cover_image: undefined,
            name: 'Page 2',
            uid: NOTEBOOK_PAGE2_UID
          }
        }
      });

      const currentPage = newState.notebook?.pages.find(page => page.uid === NOTEBOOK_PAGE2_UID);
      expect(currentPage?.blocks.length).toEqual(5);
      expect(getTextFromTextBlock(currentPage?.blocks[3])).toEqual('another test');
      expect(JSON.stringify(currentPage?.blocks[3])).toEqual(JSON.stringify(updatedBlock));
      expectPageBlocksUnchanged(currentPage?.blocks || [], NOTEBOOK_PAGE2_BLOCKS, [updatedBlock.uid]);

      const otherPage = newState.notebook?.pages.find(page => page.uid === NOTEBOOK_PAGE1_UID);
      expectPageBlocksUnchanged(otherPage?.blocks || [], NOTEBOOK_PAGE1_BLOCKS);
    });

    /*
      Remove a text block and check the corresponding block was removed (and only
      in the current page).
     */
    it('remove a block', () => {
      const removedBlockUid = NOTEBOOK_PAGE2_BLOCKS[3].uid;
      const newState = notebooksReducer(NOTEBOOKS_STATE, {
        type: NotebooksActionTypes.SAVED_NOTEBOOK_PAGE_BLOCKS,
        payload: {
          page: {
            blocks: NOTEBOOK_PAGE2_BLOCKS.filter(block => block.uid !== NOTEBOOK_PAGE2_BLOCKS[3].uid),
            cover_image: undefined,
            name: 'Page 2',
            uid: NOTEBOOK_PAGE2_UID
          }
        }
      });

      const currentPage = newState.notebook?.pages.find(page => page.uid === NOTEBOOK_PAGE2_UID);
      expect(currentPage?.blocks.length).toEqual(4);
      expectPageBlocksUnchanged(currentPage?.blocks || [], NOTEBOOK_PAGE2_BLOCKS, [removedBlockUid]);

      const otherPage = newState.notebook?.pages.find(page => page.uid === NOTEBOOK_PAGE1_UID);
      expectPageBlocksUnchanged(otherPage?.blocks || [], NOTEBOOK_PAGE1_BLOCKS);
    });
  });

  describe('block level', () => {
    /*
      Rename the name of a sql block and check the corresponding block was updated (and only
      in this block).
     */
    it('update name (sql)', () => {
      const updatedBlock = {
        ...NOTEBOOK_PAGE2_BLOCKS[2],
        name: 'query_0'
      };
      const newState = notebooksReducer(NOTEBOOKS_STATE, {
        type: NotebooksActionTypes.SAVED_NOTEBOOK_PAGE_BLOCKS,
        payload: {
          page: {
            blocks: [
              NOTEBOOK_PAGE2_BLOCKS[0],
              NOTEBOOK_PAGE2_BLOCKS[1],
              updatedBlock,
              NOTEBOOK_PAGE2_BLOCKS[3],
              NOTEBOOK_PAGE2_BLOCKS[4],
            ],
            cover_image: undefined,
            name: 'Page 2',
            uid: NOTEBOOK_PAGE2_UID
          }
        }
      });

      const currentPage = newState.notebook?.pages.find(page => page.uid === NOTEBOOK_PAGE2_UID);
      expect(currentPage?.blocks.length).toEqual(5);
      expect(currentPage?.blocks[2].name).toEqual('query_0');
      expect(JSON.stringify(currentPage?.blocks[2])).toEqual(JSON.stringify(updatedBlock));
      expectPageBlocksUnchanged(currentPage?.blocks || [], NOTEBOOK_PAGE2_BLOCKS, [updatedBlock.uid]);

      const otherPage = newState.notebook?.pages.find(page => page.uid === NOTEBOOK_PAGE1_UID);
      expectPageBlocksUnchanged(otherPage?.blocks || [], NOTEBOOK_PAGE1_BLOCKS);
    });

    /*
      Rename the name of a plotly block and check the corresponding block was updated (and only
      in this block).
     */
    it('update name (plotly)', () => {
      const updatedBlock = {
        ...NOTEBOOK_PAGE2_BLOCKS[4],
        name: 'chart_0'
      };
      const newState = notebooksReducer(NOTEBOOKS_STATE, {
        type: NotebooksActionTypes.SAVED_NOTEBOOK_PAGE_BLOCKS,
        payload: {
          page: {
            blocks: [
              NOTEBOOK_PAGE2_BLOCKS[0],
              NOTEBOOK_PAGE2_BLOCKS[1],
              NOTEBOOK_PAGE2_BLOCKS[2],
              NOTEBOOK_PAGE2_BLOCKS[3],
              updatedBlock,
            ],
            cover_image: undefined,
            name: 'Page 2',
            uid: NOTEBOOK_PAGE2_UID
          }
        }
      });

      const currentPage = newState.notebook?.pages.find(page => page.uid === NOTEBOOK_PAGE2_UID);
      expect(currentPage?.blocks.length).toEqual(5);
      expect(currentPage?.blocks[4].name).toEqual('chart_0');
      expect(JSON.stringify(currentPage?.blocks[4])).toEqual(JSON.stringify(updatedBlock));
      expectPageBlocksUnchanged(currentPage?.blocks || [], NOTEBOOK_PAGE2_BLOCKS, [updatedBlock.uid]);

      const otherPage = newState.notebook?.pages.find(page => page.uid === NOTEBOOK_PAGE1_UID);
      expectPageBlocksUnchanged(otherPage?.blocks || [], NOTEBOOK_PAGE1_BLOCKS);
    });

    /*
      Rename the database_id of a sql block and check the corresponding block was updated (and only
      in this block).
     */
    it('update database_id (sql)', () => {
      const updatedBlock = {
        ...NOTEBOOK_PAGE2_BLOCKS[2],
        content_json: {
          ...NOTEBOOK_PAGE2_BLOCKS[2].content_json,
          database_id: 'abc'
        }
      };
      const newState = notebooksReducer(NOTEBOOKS_STATE, {
        type: NotebooksActionTypes.SAVED_NOTEBOOK_PAGE_BLOCKS,
        payload: {
          page: {
            blocks: [
              NOTEBOOK_PAGE2_BLOCKS[0],
              NOTEBOOK_PAGE2_BLOCKS[1],
              updatedBlock,
              NOTEBOOK_PAGE2_BLOCKS[3],
              NOTEBOOK_PAGE2_BLOCKS[4],
            ],
            cover_image: undefined,
            name: 'Page 2',
            uid: NOTEBOOK_PAGE2_UID
          }
        }
      });

      const currentPage = newState.notebook?.pages.find(page => page.uid === NOTEBOOK_PAGE2_UID);
      expect(currentPage?.blocks.length).toEqual(5);
      expect(currentPage?.blocks[2].content_json.database_id).toEqual('abc');
      expect(JSON.stringify(currentPage?.blocks[2])).toEqual(JSON.stringify(updatedBlock));
      expectPageBlocksUnchanged(currentPage?.blocks || [], NOTEBOOK_PAGE2_BLOCKS, [updatedBlock.uid]);

      const otherPage = newState.notebook?.pages.find(page => page.uid === NOTEBOOK_PAGE1_UID);
      expectPageBlocksUnchanged(otherPage?.blocks || [], NOTEBOOK_PAGE1_BLOCKS);
    });

    /*
      Rename the limit of a sql block and check the corresponding block was updated (and only
      in this block).
     */
    it('update limit (sql)', () => {
      const updatedBlock = {
        ...NOTEBOOK_PAGE2_BLOCKS[2],
        content_json: {
          ...NOTEBOOK_PAGE2_BLOCKS[2].content_json,
          limit: 150
        }
      };
      const newState = notebooksReducer(NOTEBOOKS_STATE, {
        type: NotebooksActionTypes.SAVED_NOTEBOOK_PAGE_BLOCKS,
        payload: {
          page: {
            blocks: [
              NOTEBOOK_PAGE2_BLOCKS[0],
              NOTEBOOK_PAGE2_BLOCKS[1],
              updatedBlock,
              NOTEBOOK_PAGE2_BLOCKS[3],
              NOTEBOOK_PAGE2_BLOCKS[4],
            ],
            cover_image: undefined,
            name: 'Page 2',
            uid: NOTEBOOK_PAGE2_UID
          }
        }
      });

      const currentPage = newState.notebook?.pages.find(page => page.uid === NOTEBOOK_PAGE2_UID);
      expect(currentPage?.blocks.length).toEqual(5);
      expect(currentPage?.blocks[2].content_json.limit).toEqual(150);
      expect(JSON.stringify(currentPage?.blocks[2])).toEqual(JSON.stringify(updatedBlock));
      expectPageBlocksUnchanged(currentPage?.blocks || [], NOTEBOOK_PAGE2_BLOCKS, [updatedBlock.uid]);

      const otherPage = newState.notebook?.pages.find(page => page.uid === NOTEBOOK_PAGE1_UID);
      expectPageBlocksUnchanged(otherPage?.blocks || [], NOTEBOOK_PAGE1_BLOCKS);
    });
  });

  describe('execution level', () => {
    /* it('add new execution', () => {

    }); */

    /*
      Rename an execution of a sql block and check the corresponding block was updated (and only
      in this block).
     */
    it('update existing execution', () => {
      const blockId = NOTEBOOK_PAGE2_BLOCKS[2].uid;
      const newState = notebooksReducer(NOTEBOOKS_STATE, {
        type: NotebooksActionTypes.UPDATED_NOTEBOOK_PAGE_BLOCK_EXECUTION,
        payload: {
          id: blockId,
          page: {
            blocks: NOTEBOOK_PAGE2_BLOCKS,
            cover_image: undefined,
            name: 'Page 2',
            uid: NOTEBOOK_PAGE2_UID
          },
          block: {
            uid: blockId,
            database_id: 'QzPaon50ep'
          },
          execution: SUCCESSFUL_EXECUTION
        }
      });

      const currentPage = newState.notebook?.pages.find(page => page.uid === NOTEBOOK_PAGE2_UID);
      expect(currentPage?.blocks.length).toEqual(5);
      expect(JSON.stringify((currentPage?.blocks[2].results || [])[0])).toEqual(JSON.stringify(SUCCESSFUL_EXECUTION));
      expectPageBlocksUnchanged(currentPage?.blocks || [], NOTEBOOK_PAGE2_BLOCKS, [blockId]);

      const otherPage = newState.notebook?.pages.find(page => page.uid === NOTEBOOK_PAGE1_UID);
      expectPageBlocksUnchanged(otherPage?.blocks || [], NOTEBOOK_PAGE1_BLOCKS);
    });
  });

  describe('comment_threads and comments', () => {
    //todo: it('updates a comment', () => {}); // - but code not done yet.

    //todo: it('sets a comment thread to resolved and then back to OPEN', () => {});

    it('adds a comment thread and comment', () => {
      const firstBlockId = NOTEBOOK_PAGE1_BLOCKS[0].id;
      const commentText = "Whenever I think of something but can't think of what it was I was thinking of, I can't stop thinking until I think I'm thinking of it again. I think I think too much.";
      const commentThreadId = 31;
      const commentUid = 'xdXkjl8vlD';
      const comment: IComment = createComment(commentUid, `${commentThreadId}`, commentText, USER1);

      const commentThread = {
        ...createCommentThread(commentThreadId, firstBlockId),
        comments: [comment]
      };

      const payload = commentThread;

      const newState = notebooksReducer(NOTEBOOKS_STATE, {
        type: NotebooksActionTypes.CREATED_COMMENT_THREAD,
        payload
      });

      let firstBlock = newState!.notebook!.pages[0].blocks[0];

      expect(firstBlock!.comment_threads!.length).toEqual(1);
      let commentThreads = firstBlock!.comment_threads;
      let firstThread = commentThreads![0];
      expect(firstThread.comments!.length).toEqual(1);

      expect(firstThread!.comments[0].text).toEqual(commentText);

      const otherPage = newState.notebook?.pages.find(page => page.uid === NOTEBOOK_PAGE2_UID);
      expectPageBlocksUnchanged(otherPage?.blocks || [], NOTEBOOK_PAGE2_BLOCKS);


      // now test: it 'adds a comment to an existing thread'
      const comment2Text = "The easiest time to add insult to injury is when you’re signing somebody’s cast.";
      const comment2Uid = 'ad3k9lzvl1';
      const comment2: IComment = createComment(comment2Uid, `${commentThreadId}`, comment2Text, USER1);

      const createdCommentPayload = {
        comment: comment2,
        user: USER1
      }

      const anotherNewState = notebooksReducer(newState, {
        type: NotebooksActionTypes.CREATED_COMMENT,
        payload: createdCommentPayload
      });


      firstBlock = anotherNewState!.notebook!.pages[0].blocks[0];
      expect(firstBlock!.comment_threads!.length).toEqual(1);

      commentThreads = firstBlock!.comment_threads;
      firstThread = commentThreads![0];

      expect(firstThread.comments!.length).toEqual(2);
      expect(firstThread.comments[1].text).toEqual(comment2Text);
    });


    it('deletes a comment', () => {
      const firstBlockId = NOTEBOOK_PAGE1_BLOCKS[0].id;
      const firstBlockUid = NOTEBOOK_PAGE1_BLOCKS[0].uid;

      const commentText = 'Crime in multi-storey car parks. It\'s wrong on so many different levels';
      const commentThreadId = 31;
      const commentUid = 'xdXkjl8vlD';
      const comment: IComment = createComment(commentUid, `${commentThreadId}`, commentText, USER1);

      const firstCommentUid = comment.uid;


      const commentThread = {
        ...createCommentThread(commentThreadId, firstBlockId),
        comments: [comment]
      };

      const payload = {
        commentUid: firstCommentUid,
        commentThread,
        blockUid: firstBlockUid,
        pageUid: NOTEBOOK_PAGE1.uid,
        notebookUid: NOTEBOOK1.uid
      }

      const page1 = {
        ...NOTEBOOK_PAGE1,
        blocks: [
          {
            ...NOTEBOOK_PAGE1_BLOCKS[0],
            comment_threads: [commentThread],
          }
        ]
      }

      const stateWithOneCommentThread = {
        ...NOTEBOOKS_STATE,
        notebook: {
          ...NOTEBOOK1,
          pages: [ page1, NOTEBOOK1.pages[1] ]
        }
      }

      /*  Sanity check. check that we've actually got a comment thread in our original state */
      expect(stateWithOneCommentThread!.notebook!.pages[0]!.blocks[0]!.comment_threads!.length).toEqual(1);

      const newState = notebooksReducer(stateWithOneCommentThread, {
        type: NotebooksActionTypes.DELETED_COMMENT,
        payload
      });

      /*
        Currently the backend does not yet delete an empty comment thread.
        IE: if the last comment in a thread is deleted. perhaps the thread should be delete,
        but that does not happen yet. it just sits there empty forever currently.
      */
      expect(newState!.notebook!.pages[0].blocks[0]!.comment_threads!.length).toEqual(1);

      const firstThread = newState!.notebook!.pages[0].blocks[0]!.comment_threads![0];
      expect(firstThread.comments!.length).toEqual(0);

      const otherPage = newState.notebook?.pages.find(page => page.uid === NOTEBOOK_PAGE2_UID);

      expectPageBlocksUnchanged(otherPage?.blocks || [], NOTEBOOK_PAGE2_BLOCKS);
      // make sure page 2 has not changed at all
      expect(otherPage).toEqual(NOTEBOOKS_STATE.notebook.pages[1]);
    });

    it('updates a comment', () => {
      const firstBlockId = NOTEBOOK_PAGE1_BLOCKS[0].id;
      const firstBlockUid = NOTEBOOK_PAGE1_BLOCKS[0].uid;

      const comment1Text = 'Crime in multi-storey car parks. It\'s wrong on so many different levels';

      const commentThreadId = 31;
      const comment1Uid = 'xdXkjl8vlD';
      const comment1: IComment = createComment(comment1Uid, `${commentThreadId}`, comment1Text, USER1);

      const comment2Uid = 'azaazazz12';
      const comment2Text = 'Did you hear about the restaurant on the moon? I heard the food was good but it had no atmosphere.'
      const comment2: IComment = createComment(comment2Uid, `${commentThreadId}`, comment2Text, USER1);

      const firstCommentUid = comment1.uid;


      const commentThread = {
        ...createCommentThread(commentThreadId, firstBlockId),
        comments: [comment1, comment2]
      };

      const page1 = {
        ...NOTEBOOK_PAGE1,
        blocks: [
          {
            ...NOTEBOOK_PAGE1_BLOCKS[0],
            comment_threads: [commentThread],
          }
        ]
      }

      const stateWithOneCommentThread = {
        ...NOTEBOOKS_STATE,
        notebook: {
          ...NOTEBOOK1,
          pages: [ page1, NOTEBOOK1.pages[1] ]
        }
      }

      const newText = "Never trust an atom, they make up everything!";

      const updatedComment2 = {
        ...comment2,
        text: newText,
      }

      const payload = {
        commentUid: firstCommentUid,
        comment: updatedComment2,
        commentThread,
        blockUid: firstBlockUid,
        pageUid: NOTEBOOK_PAGE1.uid,
        notebookUid: NOTEBOOK1.uid
      }

      const newState = notebooksReducer(stateWithOneCommentThread, {
        type: NotebooksActionTypes.UPDATED_COMMENT,
        payload
      });

      const firstThread = newState!.notebook!.pages[0].blocks[0]!.comment_threads![0];
      expect(firstThread.comments!.length).toEqual(2);

      const updatedComment: IComment = firstThread.comments.find((comment:IComment) => comment.uid === comment2Uid) as IComment;

      expect(updatedComment.text).toEqual(newText);

      const firstComment: IComment = firstThread.comments[0] as IComment;
      const secondComment: IComment = firstThread.comments[1] as IComment;

      expect(updatedComment.uid).toEqual(secondComment.uid);
      expect(firstComment.uid).toEqual(comment1Uid);
    });
  });
});
