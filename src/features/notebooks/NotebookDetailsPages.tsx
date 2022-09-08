import React, { FunctionComponent, useState, useEffect, useCallback, Fragment } from 'react';
import {
  Dialog,
  Menu,
  Tree,
  ITreeNode,
  Position,
  Tooltip,
  Button,
  IconName,
  Popover,
  MenuItem, MenuDivider,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import { INotebookPage, INotebookPageBlock } from '../../shared/models';
import ConfirmDialogComponent from '../../shared/components/dialogs/ConfirmDialog';
import NotebookPageDialogComponent from '../../shared/components/dialogs/NotebookPageDialog';
import { useNotebookEditable } from './hooks/use-editable';

import './NotebookDetailsPages.scss';

type PageActionCallback = (page: INotebookPage) => void;
type SelectPageCallback = (page: INotebookPage) => void;
type SavePageCallback = (page: INotebookPage) => void;
type RemovePageCallback = (pageUid: string) => void;
type PageMoveCallback = (uid: string, direction: string) => void;
type SelectPageBlockCallback = (pageUid: string, blockUid: string, blockId: any) => void;

type NotebookDetailsPagesComponentProps = {
  pages: INotebookPage[];
  currentPage: INotebookPage | null;
  pageSaving: boolean;
  pageRemoving: boolean;
  onSelectPage: SelectPageCallback;
  onSavePage: SavePageCallback;
  onRemovePage: RemovePageCallback;
  onSelectPageBlock: SelectPageBlockCallback;
  onPageMoveInTheList: PageMoveCallback;
};


function addToolbarButtonsForPage(
  pageIndex: number,
  pagesListLength: number,
  page: INotebookPage,
  onEditPage: PageActionCallback,
  onRemovePage: PageActionCallback,
  onPageMove: PageMoveCallback,
  pageHovered: boolean
) {
  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === (pagesListLength - 1);
  const handleEditPage = () => {
    onEditPage(page);
  };

  const handlePageMoveUp = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    onPageMove(page.uid, 'up');
  };

  const handlePageMoveDown = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    onPageMove(page.uid, 'down');
  };

  const handleRemovePage = () => {
    onRemovePage(page);
  };

  const onToolbarClick = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
  }
  const pageSettingMenu = () => (
    <Menu>
      <MenuItem
        icon={IconNames.EDIT}
        text="Edit page name"
        aria-label="Edit page name"
        onClick={handleEditPage}
      />
      {
        !isFirstPage &&
        <MenuItem
          icon={IconNames.ARROW_UP}
          text="Move up"
          aria-label="Move up"
          onClick={handlePageMoveUp}/>
      }
      {
        !isLastPage &&
        <MenuItem
          icon={IconNames.ARROW_DOWN}
          text="Move down"
          aria-label="Move down"
          onClick={handlePageMoveDown}/>
      }
      <MenuDivider/>
      <MenuItem
        icon={IconNames.TRASH}
        text="Delete page"
        aria-label="Delete page"
        onClick={handleRemovePage}/>
    </Menu>
  );

  return (
    <div className="notebook-details__pages__toolbar" style={{ opacity: pageHovered ? 100 : 0 }}
         onClick={onToolbarClick}>
      <Popover
        portalClassName='page-toolbar-menu'
        content={pageSettingMenu()}
        position={Position.BOTTOM_RIGHT}
      >
        <Button className='bp3-button bp3-minimal' icon={IconNames.MORE}/>
      </Popover>
    </div>
  );
}

function normalizeBlocks(blocks: INotebookPageBlock[]) {
  if (!blocks) {
    return blocks;
  }

  const t = blocks.map(block => normalizeBlock(block));
  return t;
}

function normalizeBlock(block: INotebookPageBlock) {
  if (block.content_json.type === 'layout') {
    const targetBlocks = [];
    const { children } = block.content_json as any;
    for (const child of children) {
      if (child.type === 'layout_item') {
        if (child.children && child.children.length > 0) {
          targetBlocks.push(...child.children);
        }
      }
    }
    return targetBlocks.filter(block => !!block.type);
  }

  return block;
}

function buildPagesNodes(
  pages: INotebookPage[],
  editable: boolean,
  currentPage: INotebookPage | null,
  hoveredPage: any,
  onEditPage: PageActionCallback,
  onRemovePage: PageActionCallback,
  onPageMove: PageMoveCallback,
) {
  return pages.map((page, index) => ({
    id: page.uid,
    hasCaret: true,
    isExpanded: currentPage?.uid === page.uid ? true : false,
    // icon: IconNames.DOCUMENT,
    label: page.name,
    className: `page-item ${currentPage && (currentPage.uid === page.uid) ? 'selected' : ''}`,
    secondaryLabel: editable ? addToolbarButtonsForPage(index, pages.length, page, onEditPage, onRemovePage, onPageMove, hoveredPage && (hoveredPage.id === page.uid) ? true : false) : null,
    nodeData: { page },
    icon: IconNames.DOCUMENT,
    childNodes: page.blocks ?
      normalizeBlocks(page.blocks)
        .reduce((acc: INotebookPageBlock[], block: INotebookPageBlock | INotebookPageBlock[]) => {
          return Array.isArray(block) ?
            acc.concat(block) :
            acc.concat([block]);
        }, [])
        .filter((block: any) => {
          const type = block?.content_json?.type ? block.content_json.type : block.type;
          return type === 'sql' || type === 'plotly' || type === 'parameter';
        })
        .map((block: any, index: number) => {
          const type = block?.content_json?.type ? block.content_json.type : block.type;
          return {
            id: `query-${index + 1}`,
            hasCaret: false,
            isExpanded: false,
            icon: type === 'sql' ? IconNames.CODE : type === 'plotly' ? IconNames.CHART : IconNames.CODE_BLOCK,
            label: block.name || `Query ${index + 1}`,
            nodeData: { page, block },
          };
        }) : [],
  })) as ITreeNode[];
}

const NotebookDetailsPagesComponent: FunctionComponent<NotebookDetailsPagesComponentProps> = ({
  pages, currentPage, pageSaving, pageRemoving,
  onSelectPage, onSavePage, onRemovePage,
  onSelectPageBlock,
  onPageMoveInTheList,
}: NotebookDetailsPagesComponentProps) => {
  const [editPage, setEditPage] = useState<INotebookPage | null>(null);
  const [hoveredPage, setHoveredPage] = useState<INotebookPage | null>(null);
  const [confirmRemovePage, setConfirmRemovePage] = useState<INotebookPage | null>(null);
  const [dataTree, setDataTree] = useState<ITreeNode[] | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(-1);
  const editable = useNotebookEditable();
  const getCurrentPageIndex = (currentPage: INotebookPage | null, pages: INotebookPage[]) => {
    return pages.findIndex(page => page.uid === currentPage?.uid);
  };
  const saveCurrentPageIndex = (currentPage: INotebookPage | null, pages: INotebookPage[]) => {
    const CPIndex = getCurrentPageIndex(currentPage, pages);
    if (CPIndex >= 0) {
      setCurrentPageIndex(CPIndex);
    } else {
      if (currentPageIndex > 0) {
        onSelectPage(pages[currentPageIndex - 1] as INotebookPage);
        setCurrentPageIndex(currentPageIndex - 1);
      }
    }
  };

  useEffect(() => {
    if (pages) {
      saveCurrentPageIndex(currentPage, pages);
      const nodes = buildPagesNodes(pages, editable, currentPage, hoveredPage, onEditPage, onTriggerRemovePage, onPageMove);
      setDataTree(nodes);
    }
  }, [pages,currentPage]);

  const onEditPage = useCallback((page: INotebookPage) => {
    setEditPage(page);
  }, []);

  const onTriggerSavePage = useCallback(({ name }: { name: string }) => {
    if (editPage) {
      onSavePage({
        ...editPage,
        name,
      });
    }
  }, [editPage]);

  const onPageMove = (pageUid: string, direction: string) => {
    onPageMoveInTheList(pageUid, direction);
  };

  const onTriggerRemovePage = useCallback((page: INotebookPage) => {
    setConfirmRemovePage(page);
  }, []);

  const onSelectBlock = useCallback((pageUid: string, blockUid: string, blockId: any) => {
    onSelectPageBlock(pageUid, blockUid, blockId);
  }, []);

  const closeEditPageDialog = useCallback(() => {
    setEditPage(null);
  }, []);

  const configureEditModal = () => {
    return (
      <Dialog
        autoFocus={true}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        enforceFocus={true}
        isOpen={!!editPage}
        onClose={closeEditPageDialog}
        usePortal={true}
        title="Edit the page name"
        icon="help"
      >
        <NotebookPageDialogComponent
          page={editPage}
          pending={pageSaving}
          onSave={onTriggerSavePage}
          onClose={closeEditPageDialog}
        >
        </NotebookPageDialogComponent>
      </Dialog>
    );
  };

  const configureConfirmRemoveModal = () => {
    return (
      <Dialog
        autoFocus={true}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        enforceFocus={true}
        isOpen={!!confirmRemovePage}
        onClose={() => setConfirmRemovePage(null)}
        usePortal={true}
        title="Delete the page"
        icon="help"
      >
        <ConfirmDialogComponent
          message={confirmRemovePage ? `Do you want to delete the page ${confirmRemovePage?.name}` : ''}
          pending={pageRemoving}
          onConfirm={() => {
            if (confirmRemovePage) {
              onRemovePage(confirmRemovePage.uid);
            }
          }}
          onClose={() => setConfirmRemovePage(null)}
        ></ConfirmDialogComponent>
      </Dialog>
    );
  };

  const handleSelectNode = (node: ITreeNode, path: number[]) => {
    if (node.nodeData) {
      if (path.length === 1) {
        const { page } = node.nodeData as any;
        onSelectPage(page as INotebookPage);
      } else if (path.length === 2) {
        const { page, block } = node.nodeData as any;
        onSelectBlock(page.uid as string, block.uid as string, block.content_json.id);
      }
    }
  };

  const onNodeExpand = useCallback((node: ITreeNode, path: number[]) => {
    setDataTree(
      (dataTree: ITreeNode[] | null) =>
        dataTree ?
          dataTree?.map((dataTreeNode: ITreeNode) => dataTreeNode.id === node.id ?
            ({
              ...dataTreeNode,
              isExpanded: true,
            }) as ITreeNode :
            dataTreeNode,
          ) :
          null,
    );
    // load children on lazy load
  }, [dataTree]);

  const onNodeCollapse = useCallback((node: ITreeNode, path: number[]) => {
    setDataTree(
      (dataTree: ITreeNode[] | null) =>
        dataTree ?
          dataTree?.map((dataTreeNode: ITreeNode) => dataTreeNode.id === node.id ?
            ({
              ...dataTreeNode,
              isExpanded: false,
            }) as ITreeNode :
            dataTreeNode,
          ) :
          null,
    );
  }, [dataTree]);

  const onPageHoverStarted = (node: ITreeNode) => {
    setDataTree(
      (dataTree: ITreeNode[] | null) =>
        dataTree ?
          dataTree?.map((dataTreeNode: ITreeNode, index) => dataTreeNode.id === node.id ?
            ({
              ...dataTreeNode,
              secondaryLabel: editable ? addToolbarButtonsForPage(index, pages.length, pages[index], onEditPage, onTriggerRemovePage, onPageMove, true) : null,
            }) as ITreeNode :
            dataTreeNode,
          ) :
          null,
    );
  };

  const onPageHoverFinished = (node: ITreeNode) => {
    setDataTree(
      (dataTree: ITreeNode[] | null) =>
        dataTree ?
          dataTree?.map((dataTreeNode: ITreeNode, index) => dataTreeNode.id === node.id ?
            ({
              ...dataTreeNode,
              secondaryLabel: editable ? addToolbarButtonsForPage(index, pages.length, pages[index], onEditPage, onTriggerRemovePage, onPageMove, false) : null,
            }) as ITreeNode :
            dataTreeNode,
          ) :
          null,
    );
  };
  return (
    <Fragment>
      <Menu className="notebook-details__pages" data-cy='pages'>
        {dataTree && (
          <Tree
            className='notebook-details__overflow'
            contents={dataTree}
            onNodeClick={handleSelectNode}
            onNodeExpand={onNodeExpand}
            onNodeCollapse={onNodeCollapse}
            onNodeMouseEnter={onPageHoverStarted}
            onNodeMouseLeave={onPageHoverFinished}
          />
        )}
      </Menu>
      {editable && configureEditModal()}
      {editable && configureConfirmRemoveModal()}
    </Fragment>
  );
};

export default NotebookDetailsPagesComponent;
