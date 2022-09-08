import React, {FunctionComponent, useRef, useState, useEffect, useMemo, useCallback} from 'react';
import {
  Button,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Helmet } from 'react-helmet';

import './NotebookDetails.scss';
import { LeftMenu } from '../../shared/components/layout/LeftMenu';
import { PanelTitle } from '../../shared/components/layout/PanelTitle';
import { UnderlinedTabs, UnderlinedTab } from '../../shared/components/layout/UnderlinedTabs';
import NotebookEditor from './editor/NotebookEditorSlate';
import {
  IDatabase,
  INotebookPage,
  INotebookPageForCreation,
  INotebookPageBlock, INotebookPageCoverImage,
} from '../../shared/models';
import NotebookDetailsPagesComponent from './NotebookDetailsPages';
import CoverImage from './CoverImage'

import { useNotebookEditable } from "./hooks/use-editable";
import DataTreeContainer from './DataTree/DataTreeContainer';
import { createJinjaAutocomplete } from './editor/plugins/sql/components/sqlJinjaMode';
import NotebookConfiguration from './NotebookConfiguration';
import { useNotebookCurrentBlock, useSelectNotebookDataElement } from './NotebookNavigationContext';
import { useSelector } from 'react-redux';
import { IState } from '../../shared/store/reducers';
import { coverImageVerticalPositionDefault } from './constants';

type AddNotebookPageCallback = (notebookPage: INotebookPageForCreation) => void;
type SaveNotebookPageCallback = (notebookPage: INotebookPage, cover_image_download_url?: string) => void;
type SaveNotebookPageBlocksCallback = (notebookPage: INotebookPage) => void;
type RemoveNotebookPageCallback = (notebookId: string) => void;
type SelectNotebookPageCallback = (notebookPage: INotebookPage | null) => void;
type SelectNotebookPageBlockCallback = (pageUid: string, blockUid: string | null, blockId: any) => void;
type SaveBlockCallback = (block: INotebookPageBlock) => void;
type PageMoveCallback = (uid: string, direction: string) => void;
type OnChangeCallback = (value: any, cover_image_download_url?: string) => void;
type EditorLoadedCallback = (editorLoaded: boolean) => void;

type NotebookDetailsComponentProps = {
  notebook: any | null;
  isVisible: boolean;
  notebookLoading: boolean;
  notebookPageSaving: boolean;
  notebookPageRemoving: boolean;
  selectedNotebookPage: INotebookPage | null;
  selectedNotebookPageBlockId: any;
  databases: IDatabase[];
  onAddNotebookPage: AddNotebookPageCallback;
  onSaveNotebookPage: SaveNotebookPageCallback;
  onSaveNotebookPageBlocks: SaveNotebookPageBlocksCallback;
  onPageMoveInTheList: PageMoveCallback;
  onRemoveNotebookPage: RemoveNotebookPageCallback;
  onSelectNotebookPage: SelectNotebookPageCallback;
  onSelectNotebookPageBlock: SelectNotebookPageBlockCallback;
  onEditorLoaded: EditorLoadedCallback;
  fullScreenBlock?: INotebookPageBlock;
  onSaveBlock: SaveBlockCallback;
};

type CoverImageMemoProps = {
  coverImage: any;
  onCoverImageUrlChange: OnChangeCallback;
  selectedNotebookPage: INotebookPage | null | undefined;
};

const CoverImageMemo = React.memo(({
  coverImage,
  onCoverImageUrlChange,
  selectedNotebookPage
}: CoverImageMemoProps) => {
  if (!selectedNotebookPage) {
    return null;
  }

  return (
    <CoverImage
      coverImage={coverImage}
      onCoverImageUrlChange={onCoverImageUrlChange}
    />
  );
});

const NotebookDetailsComponent: FunctionComponent<NotebookDetailsComponentProps> = ({
  notebook,
  isVisible,
  notebookPageSaving,
  notebookPageRemoving,
  selectedNotebookPage,
  selectedNotebookPageBlockId,
  databases,
  onAddNotebookPage,
  onSaveNotebookPage,
  onSaveNotebookPageBlocks,
  onRemoveNotebookPage,
  onSelectNotebookPage,
  onPageMoveInTheList,
  onSelectNotebookPageBlock,
  onEditorLoaded,
  fullScreenBlock,
  onSaveBlock,
}: NotebookDetailsComponentProps) => {
  // selectedNotebookPage is used for lookup notebook.pages for the current page.
  const [ currentDatabase, setCurrentDatabase ] = useState<IDatabase | null>(null);
  const [ editorLoaded, setEditorLoaded ] = useState<boolean>(false);
  const leftPanelsRef = useRef();
  const currentBlock = useNotebookCurrentBlock();
  const { dispatchDataElementSelection } = useSelectNotebookDataElement();
  const editable = useNotebookEditable();
  const [ cacheIsVisible, setCacheIsVisible ] = useState(isVisible);
  const [ forceRefresh, setForceRefresh ] = useState(false);
  useEffect(() => {
    if (cacheIsVisible !== isVisible) {
      setCacheIsVisible(isVisible);
      if (isVisible) {
        /* only force refresh if isVisible transitioned from false to true */
        setForceRefresh(true);
      }
    }
  }, [ cacheIsVisible, isVisible ]);

  // Disabled the selection in the data tab
  /* useEffect(() => {
    if (currentBlock && currentBlock.type === 'sql' ) {
      const current: any = leftPanelsRef.current;
      current && current.selectTab('tabData');
    }
  }, [ currentBlock ]); */

  useEffect(() => {
    if (notebook && !selectedNotebookPage) {
      // if notebook is loaded and no current page is set
      if (notebook && notebook.pages && notebook.pages.length > 0) {
        onSelectNotebookPage(notebook.pages[0]);
      }
    }
  }, [ notebook ]);

  useEffect(() => {
    if (databases && databases.length > 0 && !currentDatabase) {
      setCurrentDatabase(databases[0]);
    }
  }, [ databases, currentDatabase ]);

  useEffect(() => {
    if (editorLoaded) {
      setForceRefresh(false);
      createJinjaAutocomplete(notebook);
    }
    onEditorLoaded(editorLoaded);
  }, [ editorLoaded, notebook ]);

  const onSelectPage = (page: INotebookPage) => {
    if (page) {
      onSelectNotebookPage(page);
    }
  };

  const onSelectPageBlock = (pageUid: string, blockUid: string, blockId: any) => {
    if (blockUid) {
      onSelectNotebookPageBlock(pageUid, blockUid, blockId);
    }
  };

  const handleAddNotebookPage = () => {
    const name = (notebook && notebook?.pages) ?
      `Page ${notebook?.pages.length + 1}` : 'Page 1';
    onAddNotebookPage({ name, notebookId: notebook?.id, position: notebook?.pages?.length || 0 });
  };

  const handleSaveNotebookPageBlocks = (notebookPage: INotebookPage) => {
    onSaveNotebookPageBlocks(notebookPage);
  };

  /**
   * In order to always get the latest content from the store, we only use selectedNotebookPage to filter after it,
   * because selectedNotebookPage is not always updated with the latest page content.
   */
  const content = (notebook && selectedNotebookPage) ? notebook.pages.find((p: any) => p.uid === selectedNotebookPage.uid) : null;

  const currentPageCoverImage = useSelector((state: IState) => state.notebooks.selectedNotebookPage?.cover_image);

  const [coverImage, setCoverImage] = useState<INotebookPageCoverImage>(
    (currentPageCoverImage && typeof currentPageCoverImage === 'string') ?
      JSON.parse(currentPageCoverImage) : {
        url: '',
        download_url: '',
        position: { x: 0, y: coverImageVerticalPositionDefault },
      });

  useEffect(() => {
    let updatedCoverImage;
    if (typeof currentPageCoverImage === 'string') {
      updatedCoverImage = JSON.parse(currentPageCoverImage);
    }
    setCoverImage({
      ...updatedCoverImage
    });
  }, [currentPageCoverImage]);

  const onUpdateNotebookPageCoverUrl = useCallback((cover_image: any, cover_image_download_url?: string) => {
    const res = { ...content, cover_image: JSON.stringify({ ...cover_image }) };
    if (cover_image) {
      onSaveNotebookPage(res, cover_image_download_url);
    }
  }, [content]);

  const onSelectDataElement = (dataElement: any) => {
    if (dataElement) {
      dispatchDataElementSelection(dataElement);
    }
  };

  const isFullScreen: boolean = !!fullScreenBlock && !!fullScreenBlock.uid;

  const contentForEditor = !isFullScreen ? content : {
    ...content,
    blocks: content.blocks.filter((block: INotebookPageBlock) => block.uid === fullScreenBlock!.uid)
  }

  return (
    <div className="notebook">
      <Helmet>
        <title>
          {notebook ? notebook.name : 'Notebook'}
        </title>
        <link id="favicon" rel="icon" type="image/png" href="/static/assets/images/favicon_notebook.png" />
      </Helmet>
      <LeftMenu>
        <div className="notebook__tabs">
          <UnderlinedTabs
            ref={leftPanelsRef}
            defaultActiveTab="tabDocument"
            noTopBorder={true}
            tabSelectorHeight="3px"
            tabsMargin="0"
          >
            <UnderlinedTab id="tabData" title="DATA">
              <div className="notebook__data">
                <DataTreeContainer
                  show={editable}
                  onSelectDataElement={onSelectDataElement}
                />
              </div>
            </UnderlinedTab>
            <UnderlinedTab id="tabDocument" title="DOCUMENT">
              <div className="notebook__pages__toolbar" data-cy='pagesToolbar'>
                <div>Pages</div>
                {
                  editable && (
                    <div className="notebook__pages__toolbar__add">
                      <Button
                        icon={IconNames.ADD}
                        data-cy='addPageAction'
                        onClick={handleAddNotebookPage}
                        className='bp3-button bp3-minimal'
                      />
                    </div>
                  )
                }
              </div>
              <div data-cy='pages'>
                {
                  notebook && (
                    <NotebookDetailsPagesComponent
                      pages={notebook.pages}
                      currentPage={selectedNotebookPage}
                      pageSaving={notebookPageSaving}
                      pageRemoving={notebookPageRemoving}
                      onSelectPage={onSelectPage}
                      onSelectPageBlock={onSelectPageBlock}
                      onSavePage={onSaveNotebookPage}
                      onRemovePage={onRemoveNotebookPage}
                      onPageMoveInTheList={onPageMoveInTheList}
                    />
                  )
                }
              </div>
            </UnderlinedTab>
          </UnderlinedTabs>
        </div>
      </LeftMenu>
      <PanelTitle>
        Details
      </PanelTitle>

      <div className="notebook__content" style={{position: 'relative'}}>
        <>
          {
            !isFullScreen && (<CoverImageMemo
              selectedNotebookPage={selectedNotebookPage}
              coverImage={coverImage}
              onCoverImageUrlChange={onUpdateNotebookPageCoverUrl}
            />)
          }
          {  !isFullScreen && contentForEditor && (
              <NotebookEditor
                content={contentForEditor}
                selectedNotebookPageBlockId={selectedNotebookPageBlockId}
                forceRefresh={forceRefresh}
                onSave={handleSaveNotebookPageBlocks}
                onSaveBlock={onSaveBlock}
                onEditorLoad={setEditorLoaded}
              />
            )
          }
          {/* It was difficult to resuse the same <NotebookEditor because of the way it handles state internally */}
          {/* If we want to reuse it for both normal mode and full screen then we would need to have logic in its state management and state saving  code */}
          {/* about changing to and from full screen mode for example */}
          {  isFullScreen && contentForEditor && (
              <NotebookEditor
                content={contentForEditor}
                selectedNotebookPageBlockId={selectedNotebookPageBlockId}
                forceRefresh={false}
                onSave={handleSaveNotebookPageBlocks}
                onSaveBlock={onSaveBlock}
                onEditorLoad={setEditorLoaded}
                fullScreenBlock={fullScreenBlock}
              />
            )
          }
        </>
      </div>
      {notebook && <NotebookConfiguration notebook={notebook} />}
    </div>
  )
};

export default NotebookDetailsComponent;
