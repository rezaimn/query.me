import rison from 'rison';

import {
  IParams,
  ISort,
  INotebook,
  INotebookForCreation,
  INotebookPageForCreation,
  ICommentThreadForCreation,
  ICommentThreadForUpdate,
  ICommentForCreationWithoutCommentThreadId,
  IComment,
  ICommentForCreation,
  INotebookPage,
  INotebookPageBlock
} from '../models';

import { api } from './Api';
import { GetNotebooksType } from '../../features/notebooks/constants';

function prepareContentJson(contentJson: any) {
  if (contentJson) {
    /**
     * sanitize keys from contentJson as we don't need them on the BE side
     */
    const { results, comment_threads, ...rest } = contentJson;
    return {
      ...rest,
    }
  }
  return contentJson;
}

export const getNotebooks = (params: IParams | undefined, sort: ISort | undefined, type?: GetNotebooksType) => {
  if (params && Object.keys(params).length === 1 && (!params.filters || params.filters.length === 0)) {
    params = undefined;
  }
  let requestParams = {};
  if (params && params.filters) {
    requestParams = {
      filters: params.filters,
    };
  }
   if (params && params.page_size) {
    requestParams = {
      ...requestParams,
      page: params?.page,
      page_size: params?.page_size
    };
  }
  if (sort) {
    requestParams = {
      ...requestParams,
      order_column: sort.name,
      order_direction: sort.direction
    };
  }
  let url = `notebook/`;
  if (type === GetNotebooksType.RECENT) {
    url += 'recently_viewed';
  } else if (type === GetNotebooksType.CREATED_BY_USER) {
    url += 'created_by_user';
  }
  return (params || sort) ?
    api.get(`/${url}?q=${rison.encode(requestParams)}`).then(res => res.data) :
    api.get(`/${url}`).then(res => res.data);
};

export const getNotebooksMetadata = () => {
  return api.get(`/notebook/_info`).then(res => res.data);
};

export const getNotebook = (notebookUid: string) => {
  return api.get(`/notebook/${notebookUid}`).then(res => res.data);
};

export const getNotebookByAlias = (alias: string) => {
  const requestParams = {
    filters: [
      {
        col: 'name', // @TODO - change this to alias in the future
        opr: 'eq',
        value: alias
      }
    ]
  }

  return api.get(`/notebook/?q=${rison.encode(requestParams)}`).then(res => res.data);
};

export const getNotebookSharingSettings = (uid: string) => {
  return api.get(`/notebook/${uid}/sharing_settings`).then(res => res.data);
};

export const getCurrentUserPermissions = (uid: string, userId: string) => {
  return api.get(`/notebook/${uid}/current_user_permissions`).then(res => res.data);
}

export const createNotebook = (notebook: INotebookForCreation) => {
  return api.post(`/notebook/`, {
    name: notebook.name,
    pages: [
      {
        name: 'Page 1'
      }
    ]
  })
    .then(res => res.data.result)
    .then(notebook => {
      const pageUid = notebook.pages[0];
      return api.put(`/notebook_page/${pageUid}`, {
        name: 'Page 1',
        blocks: [
          {
            type: 'h1',
            content_json: JSON.stringify({
              id: Date.now(),
              type: 'h1',
              children: [
                {
                  text: 'Page title', bold: true
                },
              ],
            })
          }
        ]
      })
        .then(res => res.data)
        .then(page => ({
          notebook,
          page
        }));
    })
    .then(({ notebook, page }) => ({
      ...notebook,
      pages: [ page ]
    }));
};

const OPEN = `OPEN`;

export const createCommentThreadAndComment = (
  commentThread: ICommentThreadForCreation,
  comment: ICommentForCreationWithoutCommentThreadId
) =>
  {
    const commentThreadPromise = createCommentThread(commentThread)
    const commentPromise = commentThreadPromise
      .then((commentThread:any) => {
        return createComment({
          ...comment,
          comment_thread_id: commentThread.id
        })
     })

    return Promise.all([commentThreadPromise, commentPromise])
      .then(([commentThread, comment]) => {
        return {
          ...commentThread,
          comments: [ comment ]
        }
      })
}

export const createCommentThread = (commentThread: ICommentThreadForCreation) => {

  return api.post(`/comment_thread/`, {
    status: OPEN,
    block_id: commentThread.blockId,
  })
    .then(res => res.data.result)
};

export const updateCommentThread = (id: number, uid: string, commentThread: ICommentThreadForUpdate) => {
  return api.put(`/comment_thread/${id}`, commentThread)
    .then(res => ({
        ...res.data.result,
        // we're passing the uid through here, because the reducer is using it to do the update
        // and the API only returns "status" and no other field.
        uid
      })
    )
};

export const createComment = (comment: ICommentForCreation) => {
  return api.post(`/comment/`, comment)
    .then(res => ({
      ...res.data.result,
    }))
};

export const updateComment = (comment: IComment) => {
  const commentUid: string = comment.uid;

  return api.put(`/comment/${commentUid}`, {
      text: comment.text
    })
    .then(res => res.data.result)
};

export const deleteComment = (commentUid: string) => {
  return api.delete(`/comment/${commentUid}`)
    .then(res => res.data.result)
};

export const saveNotebook = (id: string, notebook: Partial<INotebook>) => {
  return api.put(`/notebook/${id}`, notebook).then(res => res.data);
};

export const removeNotebook = (notebookUid: string) => {
  return api.delete(`/notebook/${notebookUid}`);
};

export const duplicateNotebook = (notebookUid: string) => {
  return api.post(`/notebook/${notebookUid}/duplicate`).then(res => res.data);
};

export const executeNotebook = (notebookUid: string) => {
  return api.post(`/notebook/${notebookUid}/run`).then(res => res.data);
};

export const shareNotebookWithUser = (notebookUid: string, userUid: string, permission: string) => {
  const payload = {
    user_uid: userUid,
    permission
  };

  return api.post(`/notebook/${notebookUid}/share_with_user`, payload).then(res => res.data);
};

export const shareNotebookWithWorkspace = (notebookUid: string, permission: string) => {
  const payload = {
    permission
  };

  return api.post(`/notebook/${notebookUid}/share_with_workspace`, payload).then(res => res.data);
};

export const createNotebookPage = (notebookPage: INotebookPageForCreation) => {
  return api.post(`/notebook_page/`, {
    name: notebookPage.name,
    notebook_id: notebookPage.notebookId,
    blocks: [
      {
        type: 'h1',
        content_json: JSON.stringify({
          id: Date.now(),
          type: 'h1',
          children: [
            {
              text: 'Page title', bold: true
            },
          ],
        })
      },
      ...(notebookPage.blocks || [])
    ],
    position: notebookPage.position || 0,
  })
    .then(res => res.data)
    .then(page => {
      return api.get(`/notebook/${notebookPage.notebookId}`)
        .then(res => res.data);
    });
};

const getBlockUid = (block: INotebookPageBlock, addedBlocks: INotebookPageBlock[]) => {
  if (block.uid) {
    return {
      uid: block.uid,
      id: block.id
    };
  }

  const { content_json } = block;
  const addedBlock = addedBlocks.find(b => {
    return (b.content_json.id === content_json.id);
  });

  return {
    uid: addedBlock?.uid || '',
    id: addedBlock?.id || ''
  };
};

/*
  Trigger the page saving for page properties (excluded blocks).
 */
export const saveNotebookPage = (id: string, notebookPage: Partial<INotebookPage>) => {
  return saveNotebookPageProperties(id, notebookPage);
}

const saveNotebookPageProperties = (id: string, notebookPage: Partial<INotebookPage>) => {
  const { name, cover_image } = notebookPage;
  return api.put(`/notebook_page/${id}`, {
    name, cover_image
  })
    .then(res => notebookPage)
}

/*
  Trigger the page saving for page blocks (excluded blocks).
 */
export const saveNotebookPageBlocks = (id: string, notebookPage: Partial<INotebookPage>) => {
  let { blocks } = notebookPage;
  if (!blocks) {
    blocks = [];
  }
  const blocksToAdd = blocks.filter(block => !block.uid);
  if (blocksToAdd && blocksToAdd.length > 0) {
    return Promise.all(blocksToAdd.map(block => {
      return addNotebookPageBlock(block);
    })).then(addedBlocks => {
      const updatedBlocks = (blocks || []).map(block => {
        const ids = getBlockUid(block, addedBlocks);
        const contentJson = prepareContentJson(block.content_json);

        return {
          ...block,
          id: ids.id,
          uid: ids.uid,
          content_json: JSON.stringify(contentJson),
        };
      });

      const updatedBlocksWithoutCommentThreads = updatedBlocks.map(block => {
        const { comment_threads, ...rest} = block;
        return {
          ...rest
        };
      });

      return api.put(`/notebook_page/${id}`, {
        /* name,
        cover_image, */
        blocks: updatedBlocksWithoutCommentThreads
      })
        .then(res => res.data.result)
        .then(res => {
          return res;
        })
        .then(page => ({
          ...page,
          uid: id,
          blocks: updatedBlocks.map(updatedBlock => ({
            ...updatedBlock,
            content_json: JSON.parse(updatedBlock.content_json)
          }))
        }));
    });
  } else {
    const updatedBlocks = blocks.map(block => {
      const contentJson = prepareContentJson(block.content_json);

      return {
        ...block,
        content_json: JSON.stringify(contentJson)
      }
    });

    const updatedBlocksWithoutCommentThreads = updatedBlocks.map(block => {
      const {comment_threads, ...rest} = block;

      return {
        ...rest
      };
    });


    return api.put(`/notebook_page/${id}`, {
      /* name,
      cover_image, */
      blocks: updatedBlocksWithoutCommentThreads
    })
      .then(res => res.data.result)
      .then(res => {
        return res;
      })
      .then(page => (
        {
          ...page,
          uid: id,
          blocks: updatedBlocks.map(updatedBlock => ({
            ...updatedBlock,
            content_json: JSON.parse(updatedBlock.content_json)
        }))
      }));
  }
};

export const removeNotebookPage = (notebookPageUid: string) => {
  return api.delete(`/notebook_page/${notebookPageUid}`);
};

export const executeNotebookPage = (pageUid: string) => {
  return api.post(`/notebook_page/${pageUid}/run`).then(res => res.data);
};

export const addNotebookPageBlock =  (block: INotebookPageBlock): Promise<INotebookPageBlock> => {
  return api.post(`/block/`, { })
    .then(res => res.data)
    .then((addedBlock) => ({ ...block, uid: addedBlock.result.uid, id: addedBlock.id }))
};

export const saveNotebookPageBlock = (notebookPageBlockUid: string, block: Partial<INotebookPageBlock>) => {
  const contentJson = prepareContentJson(block.content_json);

  return api.put(`/block/${notebookPageBlockUid}`, {
    ...block,
    content_json: contentJson ? JSON.stringify(contentJson) : contentJson,
    id: undefined,
    position: undefined,
    results: undefined,
    comment_threads: undefined,
  })
    .then(res => res.data.result)
    .then(block => ({
      ...block,
      content_json: block.content_json ?
        JSON.parse(block.content_json) :
        block.content_json
    }));
}

export const executeNotebookPageBlock = (
  notebookPageBlockUid: string,
  notebookUid: string | null | undefined,
  block: Partial<INotebookPageBlock> | null) => {
  return api.post(`/block/${notebookPageBlockUid}/run/${notebookUid || ''}`, block ?
    { content_json: JSON.stringify(block.content_json) } : {}
  )
    .then(res => res.data);
}

export const previewNotebookPageBlock = (
  notebookPageBlockUid: string,
  notebookUid: string | null | undefined) => {
  return api.get(`/block/${notebookPageBlockUid}/preview/${notebookUid}`).then((res: any) => res.data);
}

export const getNotebookPageBlockExecutions = (notebookPageBlockUid: string) => {
  return api.get(`/block/${notebookPageBlockUid}/results/`).then(res => res.data);
}

export const getNotebookPageBlockExecution = (notebookPageBlockUid: string, runId: string) => {
  return api.get(`/block/${notebookPageBlockUid}/results/${runId}`).then(res => res.data);
}

export const cancelNotebookPageBlockExecution = (notebookPageBlockUid: string, runId: string) => {
  return api.get(`/block/${notebookPageBlockUid}/stop/${runId}`).then(res => res.data);
}

export const saveNotebookPagesPosition = (notebookId: string, notebookPagesIds: string[]) => {
  return api.post(`/notebook/${notebookId}/pages_position`, notebookPagesIds).then(res => res.data);
};
