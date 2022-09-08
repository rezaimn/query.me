import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  FunctionComponent
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, RouteComponentProps, useHistory } from 'react-router-dom';
import { History } from 'history';
import qs from 'qs';
import { usePageVisibility } from 'react-page-visibility';

import {
  selectHeader,
  resetHeader,
  selectLeftPanelBackground,
  resetLeftPanelBackground,
  setIsFullScreen
} from '../../shared/store/actions/uiActions';
import {
  loadNotebook,
  loadCurrentUserPermissions,
  createNotebookPage,
  saveNotebookPage,
  saveNotebookPageBlocks,
  saveNotebookPageBlock,
  removeNotebookPage,
  selectNotebookPage,
  selectNotebookPageBlock, saveNotebookPagesPosition,
} from '../../shared/store/actions/notebookActions';

import { loadDatabases } from '../../shared/store/actions/databaseActions';
import { load as loadDataTree}  from '../../shared/store/actions/dataTreeActions';
import {isAdmin, isLoggedIn} from '../../shared/utils/auth';

import { IState } from '../../shared/store/reducers';
import { ApiStatus, INotebookPage, INotebookPageForCreation, INotebookPageBlock } from '../../shared/models';
import NotebookDetailsComponent from './NotebookDetails';
import { NotebookNavigationProvider } from './NotebookNavigationContext';
import { NotebookEditableContext } from './hooks/use-editable';
import { notebookFromWorkspace } from './utils';

type NotebookDetailsContainerParams = {
  notebookId: string;
  pageId?: string;
  blockUid?: string;
  blockId?: string;
};

type NotebookDetailsContainerParamsProps = RouteComponentProps<NotebookDetailsContainerParams>;


const redirectToNotebookPage = ( history: History, notebookUid: string, pageUid: string | undefined ) => {
  let newRoute = `/n/${notebookUid}`;

  if (pageUid) {
    newRoute += `/${pageUid}`;
  }

  history.push(newRoute)
}

const NotebookDetailsContainer: FunctionComponent<NotebookDetailsContainerParamsProps> = ({
  match, location
}: NotebookDetailsContainerParamsProps) => {
  const notebookId = match.params.notebookId;
  const pageId = match.params.pageId;

  const { blockUid } = qs.parse(location.search.replace('?', ''));

  const blockParamUid = match.params.blockId ?? undefined;

  const notebook = useSelector((state: IState) => state.notebooks.notebook);
  const selectedNotebookPage = useSelector((state: IState) => state.notebooks.selectedNotebookPage);

  const pageMoveInTheList = (pageUid: string, direction: string) => {
    const pageIndex: any = notebook?.pages.findIndex(page => page.uid === pageUid);
    if ((direction === 'up' && pageIndex === 0) ||
      (direction === 'down' && pageIndex === notebook?.pages.length)) {
      return;
    }
    const pages = [...notebook?.pages] || [];
    const pagesIds = pages.map(page => page.uid);
    const selectedPage = pagesIds[pageIndex];
    pagesIds.splice(pageIndex, 1);
    pagesIds.splice(direction === 'up' ? pageIndex - 1 : pageIndex + 1, 0, selectedPage);

    dispatch(saveNotebookPagesPosition(notebook?.uid || '', pagesIds));
  };

  const currentNotebookPage: INotebookPage | null = useMemo(() => (
      notebook?.pages.find((notebookPage: INotebookPage) => notebookPage.uid === pageId) ?? null
    ),
    [ notebook, pageId ]
  );

  const fullScreenBlock: INotebookPageBlock | undefined = useMemo(() => (
    currentNotebookPage?.blocks?.find((block: any) => block.uid === blockParamUid))
    , [ notebook, currentNotebookPage, blockParamUid ]
  );

  const fullScreenBlockDoesNotExist = useMemo(() => {
    return !!blockParamUid && !fullScreenBlock;
  }, [ blockParamUid, fullScreenBlock ]);


  const selectedNotebookPageBlockId = useSelector((state: IState) => state.notebooks.selectedNotebookPageBlockId);
  const databases = useSelector((state: IState) => state.databases.databases);
  const loadingStatus = useSelector((state: IState) => state.notebooks.loadingStatus);
  const savingPageStatus = useSelector((state: IState) => state.notebooks.savingPageStatus);
  const removingPageStatus = useSelector((state: IState) => state.notebooks.removingPageStatus);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const currentUser = useSelector((state: IState) => state.users.user);
  const currentUserPermissions = useSelector((state: IState) => state.notebooks.currentUserPermissions);
  const currentWorkspace = useSelector((state: IState) => state.workspaces.workspace);
  const [ editable, setEditable ] = useState<boolean>(true);
  const dispatch = useDispatch();
  const history = useHistory();
  const isVisible = usePageVisibility();

  useEffect(() => {
    if (isVisible) {
      dispatch(loadNotebook(notebookId, pageId));
    }
  }, [ isVisible ]);

  useEffect(() => {
    dispatch(selectHeader('notebook'));
    dispatch(selectLeftPanelBackground('white'));
    return function reset() {
      dispatch(resetHeader());
      dispatch(resetLeftPanelBackground());
    };
  }, [ ]);

  const isFullScreen: boolean = !!fullScreenBlock && !!fullScreenBlock.uid;

  useEffect(() => {
    dispatch(setIsFullScreen( isFullScreen ));
  }, [ isFullScreen ]);

  useEffect(() => {
    dispatch(selectHeader('notebook', { editable: editable }));
  }, [ editable ]);

  useEffect(() => {
    dispatch(loadNotebook(notebookId, pageId));

    if (currentUser && isLoggedIn(currentUser) && !isAdmin(currentUser)) {
      dispatch(loadCurrentUserPermissions(notebookId, currentUser.uid as string));
    }
  }, [ dispatch, notebookId, currentUser ]);

  useEffect(() => {
    if (isLoggedIn(currentUser)) {
      dispatch(loadDatabases({ reload: true }));
      dispatch(loadDataTree());
    }
  }, [ currentUser ]);

  useEffect(() => {
    if (pageId && notebook) {
      const notebookPage = notebook.pages.find((page: INotebookPage) => page.uid === pageId) || null;
      dispatch(selectNotebookPage(notebookPage));
    }
  }, [ pageId, blockUid ]);

  useEffect(() => {
    if (selectedNotebookPage && blockUid && editorLoaded) {
      const selectedBlock = selectedNotebookPage!.blocks.find((block) => blockUid === block.uid)

      // todo: comment needed on why its set to 0
      // I suppose because this value is used to scroll, and with 0 it will just scroll to the top
      const selectedBlockSlateId = selectedBlock ?  selectedBlock.content_json.id : 0;

      setTimeout(() => {
        dispatch(selectNotebookPageBlock(selectedNotebookPage.uid, blockUid as string,selectedBlockSlateId));
      }, 100);
    }
  }, [ selectedNotebookPage, blockUid, editorLoaded ]);

  useEffect(() => {
    /*
     * @TODO - move it into a permission helper file
     */
    if (!isLoggedIn(currentUser)) {
      /*
       * user is not logged in
       */
      setEditable(false);
    } else if (
      notebook && notebook.is_public && (notebook.uid === notebookId) &&
      !notebookFromWorkspace(notebook, currentWorkspace)) {
      /*
       * Public notebook viewed by another Workspace
       */
      setEditable(false);
    } else if (currentUserPermissions && !currentUserPermissions.view) {
      history.push('/n/'); // redirect to notebook list
    } else if (currentUserPermissions && !currentUserPermissions.edit) {
      setEditable(false);
    } else {
      setEditable(true);
    }
  }, [ notebook, currentUser, currentUserPermissions, currentWorkspace ]);

  useEffect(() => {
    if(currentNotebookPage && fullScreenBlockDoesNotExist) {
      //remove the block id from the path as it doesn't exist.
      redirectToNotebookPage(history, notebookId, pageId);
    }
  }, [ fullScreenBlockDoesNotExist, currentNotebookPage ]);

  const onAddNotebookPage = (notebookPage: INotebookPageForCreation) => {
    dispatch(createNotebookPage(notebookPage));
  };

  const onSaveNotebookPage = (notebookPage: INotebookPage, cover_image_download_url?: string) => {
    dispatch(saveNotebookPage(notebookPage.uid, notebookPage, cover_image_download_url));
  };

  const onSaveNotebookPageBlocks = (notebookPage: INotebookPage) => {
    dispatch(saveNotebookPageBlocks(notebookPage.uid, notebookPage));
  };

  const onSaveBlock = useCallback((block: INotebookPageBlock) => {
    if(!block) {
      return
    }
    dispatch(saveNotebookPageBlock(block.uid, { uid: pageId }, block));
  },[]);

  const onRemoveNotebookPage = (notebookPageUid: string) => {
    dispatch(removeNotebookPage(notebookPageUid));
  };

  const onSelectNotebookPage = (notebookPage: INotebookPage | null) => {
    redirectToNotebookPage(history, notebookId, notebookPage?.uid);
  };

  const onSelectNotebookPageBlock = (pageUid: string, blockUid: string | null, blockId: any) => {
    if (blockUid) {
      const blockIdParamSetToCurrentBlock = history.location.search.includes(blockUid)
      if (pageUid !== pageId || !blockIdParamSetToCurrentBlock) {
        history.push(`/n/${notebookId}/${pageUid}?blockUid=${blockUid}`);
      }

      dispatch(selectNotebookPageBlock(pageUid, blockUid, blockId));
    }
  };

  const onEditorLoaded = (editorLoaded: boolean) => {
    setEditorLoaded(editorLoaded);
  };

  const showNotebook = !!(notebook && notebook.uid === notebookId); // if uid is equal, show notebook

  return (
    <NotebookNavigationProvider>
      <NotebookEditableContext.Provider value={editable}>
        <NotebookDetailsComponent
          notebook={showNotebook ? notebook : null}
          isVisible={isVisible}
          notebookLoading={loadingStatus === ApiStatus.LOADING}
          notebookPageSaving={savingPageStatus === ApiStatus.LOADING}
          notebookPageRemoving={removingPageStatus === ApiStatus.LOADING}
          selectedNotebookPage={selectedNotebookPage}
          selectedNotebookPageBlockId={selectedNotebookPageBlockId}
          databases={databases}
          onAddNotebookPage={onAddNotebookPage}
          onSaveNotebookPage={onSaveNotebookPage}
          onSaveNotebookPageBlocks={onSaveNotebookPageBlocks}
          onRemoveNotebookPage={onRemoveNotebookPage}
          onSelectNotebookPage={onSelectNotebookPage}
          onSelectNotebookPageBlock={onSelectNotebookPageBlock}
          onEditorLoaded={onEditorLoaded}
          fullScreenBlock={fullScreenBlock}
          onSaveBlock={onSaveBlock}
          onPageMoveInTheList={pageMoveInTheList}
        />
      </NotebookEditableContext.Provider>
    </NotebookNavigationProvider>
  );
};

export default withRouter(NotebookDetailsContainer);
