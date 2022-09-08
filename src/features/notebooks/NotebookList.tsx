import React, { FunctionComponent, useState, SyntheticEvent, useMemo } from 'react';
import { Link, useRouteMatch, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Icon,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
  Colors,
  Dialog,
  Toaster,
  Intent,
  Spinner,
  Button,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import TimeAgo from 'react-timeago';
import { Helmet } from 'react-helmet';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './NotebookList.scss';
import { LeftMenu } from '../../shared/components/layout/LeftMenu';
import { PanelTitle } from '../../shared/components/layout/PanelTitle';
import {INotebook, IView, IListColumn, ISort, IParams, INotebooksMetadata} from '../../shared/models';
import NotebookListLeftMenuComponent from './NotebookListLeftMenu';
import {
  List,
  ListHeaders,
  ListRow,
  ListColumn,
  SquareIndicator,
  EditableTags,
  NoResult
} from '../../shared/components/list';
import UserNames from '../../shared/components/user/UserNames';
import NotebookTagsContainer from './NotebookTagsContainer';
import { stopPropagationForPopover } from '../../shared/utils/events';
import ConfirmDialogComponent from '../../shared/components/dialogs/ConfirmDialog';
import InfiniteScroll from 'react-infinite-scroll-component';
import { isFirstPage } from './utils';
import {displayRowsSkeleton} from '../../shared/components/displayRowsSkeleton/displayRowsSkeleton';
import ListFiltersContainer from '../../shared/components/ListFilterContainer/ListFilterContainer';
import {loadNotebooks} from '../../shared/store/actions/notebookActions';
import { isGuest, isLoggedIn } from '../../shared/utils/auth';
import { IState } from '../../shared/store/reducers';
import { notebookColumns } from './constants';

const copiedToaster = Toaster.create({
  className: 'recipe-toaster',
  position: Position.TOP
});

type RowClickedCallback = (notebook: INotebook) => void;
type RowDoubleClickedCallback = (notebook: INotebook) => void;
type SaveViewCallback = (view: IView) => void;
type RemoveViewCallback = (viewId: number) => void;
type AddNotebookCallback = () => void;
type RemoveNotebookCallback = (notebookId: string) => void;
type DuplicateNotebookCallback = (notebookId: string) => void;
type OnEditModeChangeCallback = (editMode: boolean) => void;
type OnContextMenuOpenChangeCallback = (openMode: boolean) => void;
type OnToggleSortCallback = (sort: ISort) => void;
type OnLoadMoreCallback = () => void;
type SetPageCallback = (value:number) => void;

type NotebookListComponentProps = {
  notebooks: INotebook[];
  notebooksLoading: boolean;
  views: IView[];
  view: IView | null;
  viewsLoading: boolean;
  viewSaving: boolean;
  viewRemoving: boolean;
  onSaveView: SaveViewCallback;
  onRemoveView: RemoveViewCallback;
  onRemoveNotebook: RemoveNotebookCallback;
  onDuplicateNotebook: DuplicateNotebookCallback;
  onAddNotebook: AddNotebookCallback;
  onToggleSort?: OnToggleSortCallback;
  onLoadMore: OnLoadMoreCallback;
  setPage: SetPageCallback;
  canLoadMore: boolean;
  currentPage: number;
  firstPage: number;
  listParams: IParams | undefined;
  listMetadata: INotebooksMetadata | null;
  pageTitle: string;
  disableViews: boolean;
  disableFilter: boolean;
};

function displayRows({
  notebooks,
  notebooksLoading,
  headers,
  url,
  rowMenuContent,
  rowClickEnabled,
  tagsEditModeDisabled,
  onRowClicked,
  onRowDoubleClicked,
  onEditModeChange,
  onContextMenuOpenChange,
  currentPage,
  firstPage
}: {
  notebooks: INotebook[];
  notebooksLoading: boolean;
  headers: { [id: string]: IListColumn };
  url: string;
  rowMenuContent: any;
  rowClickEnabled: boolean;
  tagsEditModeDisabled: boolean;
  onRowClicked: RowClickedCallback;
  onRowDoubleClicked: RowDoubleClickedCallback;
  onEditModeChange: OnEditModeChangeCallback;
  onContextMenuOpenChange: OnContextMenuOpenChangeCallback;
  currentPage: number;
  firstPage: number;
}) {
  return notebooksLoading && isFirstPage(currentPage, firstPage) ?
    displayRowsSkeleton(headers) :
    displayRowsData({
      notebooks, headers, url, rowMenuContent,
      rowClickEnabled, tagsEditModeDisabled,
      onRowClicked, onRowDoubleClicked,
      onEditModeChange, onContextMenuOpenChange
    });
}


function displayRowsData({
  notebooks,
  headers,
  url,
  rowMenuContent,
  rowClickEnabled,
  tagsEditModeDisabled,
  onRowClicked,
  onRowDoubleClicked,
  onEditModeChange,
  onContextMenuOpenChange
}: {
  notebooks: INotebook[];
  headers: { [id: string]: IListColumn };
  url: string;
  rowMenuContent: any;
  rowClickEnabled: boolean;
  tagsEditModeDisabled: boolean;
  onRowClicked: RowClickedCallback;
  onRowDoubleClicked: RowDoubleClickedCallback;
  onEditModeChange: OnEditModeChangeCallback;
  onContextMenuOpenChange: OnContextMenuOpenChangeCallback;
}) {
  const handleRowDoubleClick = (notebook: INotebook) => {
    rowClickEnabled && onRowDoubleClicked(notebook);
  };

  return notebooks && notebooks.map(notebook => {
    const rowMenuContentForNotebook = rowMenuContent(notebook);

    return (
      <ListRow
        key={notebook.uid}
        onRowClicked={() => handleRowDoubleClick(notebook)}
      >
        <ListColumn properties={headers.name} main={true}>
          <SquareIndicator icon={IconNames.MANUAL} color={Colors.INDIGO3} />
          <span className="bp3-text-overflow-ellipsis">{notebook.name} </span>
          { notebook?.is_public && <Icon icon={IconNames.GLOBE} color={Colors.GRAY1} className="public-icon" /> }
        </ListColumn>
        <ListColumn properties={headers.changed_by}>
          <UserNames user={notebook.changed_by} />
        </ListColumn>
        <ListColumn properties={headers.changed_on}>
          <TimeAgo date={notebook.changed_on_utc} minPeriod={60} />
        </ListColumn>
        <ListColumn properties={headers.created_by}>
          <UserNames user={notebook.created_by} />
        </ListColumn>
        <ListColumn properties={headers.created_on}>
          <TimeAgo date={notebook.created_on_utc} minPeriod={60} />
        </ListColumn>
        <ListColumn properties={headers.tags}>
          <div
            className="stop-propagnation-container"
            onClick={stopPropagationForPopover}
          >
            <NotebookTagsContainer
              objectType="notebook"
              objectId={notebook.uid}
              selectedTags={notebook.tags}
              disableEditMode={tagsEditModeDisabled}
              onEditModeChange={onEditModeChange}
            ></NotebookTagsContainer>
          </div>
        </ListColumn>
        <ListColumn properties={headers.actions}>
          <div onClick={stopPropagationForPopover} data-cy='rowOpenMenu'>
            <Popover
              content={rowMenuContentForNotebook}
              position={Position.BOTTOM_RIGHT}
              className="notebook-list__rows__trigger"
              onOpened={() => onContextMenuOpenChange(true)}
              onClosed={() => onContextMenuOpenChange(false)}
            >
              <Button className='bp3-button bp3-minimal' icon={IconNames.MORE} />
            </Popover>
          </div>
        </ListColumn>
      </ListRow>
    );
  });
}

const NotebookListComponent: FunctionComponent<NotebookListComponentProps> = ({
  notebooks, notebooksLoading, views, view,
  viewsLoading, viewSaving, viewRemoving,
  onSaveView, onRemoveView, onAddNotebook,
  onRemoveNotebook, onToggleSort, onDuplicateNotebook,
  onLoadMore, canLoadMore,setPage, currentPage, firstPage,
  listParams, listMetadata, pageTitle, disableViews, disableFilter
}: NotebookListComponentProps) => {

  const [ detailsDisplayed, setDetailsDisplayed ] = useState(false);
  const [ rowClickEnabled, setRowClickEnabled ] = useState(true);
  const [ tagsEditModeDisabled, setTagsEditModeDisabled ] = useState(false);
  const [ confirmRemoveNotebook, setConfirmRemoveNotebook ] = useState<INotebook | null>(null);
  const currentUser = useSelector((state: IState) => state.users.user);
  const history = useHistory();

  const [ selectedNotebook, setSelectedNotebook ] = useState<INotebook | null>(null);
  let { url } = useRouteMatch();
  url = url.endsWith('/') ? url.slice(0, -1) : url;

  const onCloseDetails = () => {
    setSelectedNotebook(null);
    setDetailsDisplayed(false);
  };

  const onRowClicked = (row: INotebook) => {
    setSelectedNotebook(row);
    setDetailsDisplayed(true);
  };

  const onRowDoubleClicked = (row: INotebook) => {
    history.push(`/n/${row.uid}`);
  };

  const onEditModeChange = (editMode: boolean) => {
    setRowClickEnabled(!editMode);
  };

  const onContextMenuOpenChange = (openMode: boolean) => {
    setRowClickEnabled(!openMode);
    setTagsEditModeDisabled(openMode);
  };

  const handleToggleSort = (sort: ISort) => {
    onToggleSort && onToggleSort(sort);
  };

  const handleRemoveNotebook = (notebook: INotebook) => {
    setConfirmRemoveNotebook(notebook);
  };

  const handleDuplicateNotebook = (notebookUid: string) => {
    onDuplicateNotebook(notebookUid);
  };

  const onCopied = () => {
    copiedToaster.show({
      message: "Notebook shareable URL copied to clipboard.",
      intent: Intent.SUCCESS
    });
  };

  const isNotGuest = useMemo(() => isLoggedIn(currentUser) && !isGuest(currentUser), [ currentUser ]);

  const rowMenuContent = (notebook: INotebook) => (
    <Menu>
      <MenuItem
        icon={IconNames.DOCUMENT_OPEN}
        text="Open"
        aria-label="Open"
        onClick={() => onRowDoubleClicked(notebook)}
      ></MenuItem>
      <MenuDivider />
      { /* <MenuItem icon={IconNames.PLAY} text="Execute Notebook"></MenuItem> */ }
      {
        isNotGuest && (
          <MenuItem
            icon={IconNames.DUPLICATE}
            text="Make a copy"
            aria-label="Make a copy"
            onClick={() => handleDuplicateNotebook(notebook.uid) }/>
        )
      }
      <CopyToClipboard
        text={`${window.location.origin}${url}/${notebook.uid}`}
        onCopy={() => onCopied()}
      >
        <MenuItem icon={IconNames.LINK} text="Get shareable link"></MenuItem>
      </CopyToClipboard>
      { /* <MenuItem icon={IconNames.STAR_EMPTY} text="Bookmark"></MenuItem> */ }
      <MenuDivider />
      {
        isNotGuest && (
          <MenuItem
            icon={IconNames.TRASH}
            text="Delete"
            aria-label="Delete"
            onClick={() => handleRemoveNotebook(notebook)} />
        )
      }
    </Menu>
  );

  const configureConfirmRemoveModal = () => {
    return (
      <Dialog
        autoFocus={true}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        enforceFocus={true}
        isOpen={!!confirmRemoveNotebook}
        onClose={() => setConfirmRemoveNotebook(null) }
        usePortal={true}
        title="Delete the view"
        icon="help"
      >
        <ConfirmDialogComponent
          message={confirmRemoveNotebook ? `Do you want to delete the notebook ${confirmRemoveNotebook?.name}` : ''}
          pending={viewRemoving}
          onConfirm={() => {
            if (confirmRemoveNotebook) {
              onRemoveNotebook(confirmRemoveNotebook.uid);
            }
          }}
          onClose={() => setConfirmRemoveNotebook(null) }
        ></ConfirmDialogComponent>
      </Dialog>
    );
  };

  // if not loading and no notebooks found
  const noNotebooks = !notebooksLoading && (!notebooks || (notebooks && !notebooks.length));

  return (
    <div>
      <Helmet>
        <title>
          {view ? view.name : pageTitle}
        </title>
      </Helmet>
      <LeftMenu>
        <NotebookListLeftMenuComponent
          views={views}
          viewsLoading={viewsLoading}
          viewSaving={viewSaving}
          viewRemoving={viewRemoving}
          onAddNotebook={onAddNotebook}
          onSaveView={onSaveView}
          onRemoveView={onRemoveView}
        ></NotebookListLeftMenuComponent>
      </LeftMenu>
      <PanelTitle>
        {view ? view.name : pageTitle}
      </PanelTitle>

      <div className="notebook-list">
        <ListFiltersContainer
          loadListData={loadNotebooks}
          listMetadata={listMetadata}
          listParams={listParams}
          view_type='Notebook'
          setPage={setPage}
          disableViews={disableViews}
          disableFilter={disableFilter}
          columnsList={notebookColumns}
        />
        {
          noNotebooks ?
            <NoResult
              icon={IconNames.MANUAL}
              title="No notebooks found"
              description="Create a new notebook or refine your filter criteria."
            /> : (
              <List>
                <ListHeaders
                  headers={notebookColumns}
                  onToggleSort={handleToggleSort}/>
                <div className='infinite-scroll-base' id='notebooks-infinite-scroll'>
                  <InfiniteScroll
                    dataLength={notebooks.length}
                    next={onLoadMore}
                    hasMore={!notebooksLoading && canLoadMore}
                    loader={<Spinner size={50} className='load-more-spinner'/>}
                    scrollableTarget="notebooks-infinite-scroll"
                  >
                    {
                      displayRows({
                        notebooks, notebooksLoading, headers: notebookColumns, url, rowMenuContent,
                        rowClickEnabled, tagsEditModeDisabled,
                        onRowClicked, onRowDoubleClicked,
                        onEditModeChange,
                        onContextMenuOpenChange,
                        currentPage,
                        firstPage
                      })
                    }
                  </InfiniteScroll>
                </div>
              </List>
            )
        }
        { /* <DrawerContainer
          isOpen={detailsDisplayed}
          icon={IconNames.CODE}
          iconBackgroundColor={Colors.BLUE5}
          label={selectedNotebook ? selectedNotebook.label : ''}
          detailsLink={selectedNotebook ? `${url}/${selectedNotebook.id}` : null}
          actionIcon={IconNames.DOCUMENT_OPEN}
          actionLabel="Open"
          onClose={onCloseDetails}
          onAction={() => selectedNotebook && onRowDoubleClicked(selectedNotebook)}
        >
          { selectedNotebook && (
            <NotebookDetailsInfoContainer notebookId={selectedNotebook.id}></NotebookDetailsInfoContainer>
          )}
        </DrawerContainer> */ }
        { configureConfirmRemoveModal() }
      </div>
    </div>
  )
};

export default NotebookListComponent;
