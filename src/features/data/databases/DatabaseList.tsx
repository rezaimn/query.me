import React, {FunctionComponent, Fragment, useEffect, useState, useMemo, useCallback} from 'react';
import { Link, useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Colors,
  ButtonGroup,
  Button,
  Popover,
  Position,
  Menu,
  MenuItem,
  MenuDivider,
  Dialog,
  Spinner
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import TimeAgo from 'react-timeago';
import { Helmet } from 'react-helmet';
import './DatabaseList.scss';
import { LeftMenu } from '../../../shared/components/layout/LeftMenu';
import { PanelTitle } from '../../../shared/components/layout/PanelTitle';
import {IDatabase, IListColumn, IView, ISort, IParams, INotebooksMetadata} from '../../../shared/models';
import UserNames from '../../../shared/components/user/UserNames';
import {
  List,
  ListHeaders,
  ListRow,
  ListColumn,
  SquareIndicator,
  LabelWithLegend,
  NoResult } from '../../../shared/components/list';
import { DrawerContainer } from '../../../shared/components/layout/Drawer';
import DatabaseDetailsInfoContainer from './DatabaseDetailsInfoContainer';
import { stopPropagationForPopover } from '../../../shared/utils/events';
import ConfirmDialogComponent from '../../../shared/components/dialogs/ConfirmDialog';
import InfiniteScroll from 'react-infinite-scroll-component';
import {isFirstPage} from '../../notebooks/utils';
import {displayRowsSkeleton} from '../../../shared/components/displayRowsSkeleton/displayRowsSkeleton';
import {
  loadCurrentUserPermissions,
  loadDatabases,
  loadDatabaseSharingSettings,
  loadedCurrentUserPermissions,
  loadedDatabaseSharingSettings,
  unsetLastCreatedDatabase,
} from '../../../shared/store/actions/databaseActions';
import ListFiltersContainer from '../../../shared/components/ListFilterContainer/ListFilterContainer';
import SharedListLeftMenuComponent from '../../../shared/components/SharedListLeftMenu/SharedListLeftMenu';
import {isAdmin, isGuest, isLoggedIn} from '../../../shared/utils/auth';
import { IState } from '../../../shared/store/reducers';
import ShareDatabaseButton from './ShareDatabase/ShareDatabaseButton';
import ShareDatabaseDialog from './ShareDatabase/ShareDatabaseDialog';
import { databaseColumns } from './constants';

type RowClickedCallback = (database: IDatabase) => void;
type RowDoubleClickedCallback = (database: IDatabase) => void;
type SaveViewCallback = (view: IView) => void;
type RemoveViewCallback = (viewId: number) => void;
type OnContextMenuOpenChangeCallback = (openMode: boolean) => void;
type OnToggleSortCallback = (sort: ISort) => void;
type RemoveDatabaseCallback = (databaseUid: string) => void;
type OnLoadMoreCallback = () => void;
type SetPageCallback = (value:number) => void;

type DatabaseListComponentProps = {
  databases: IDatabase[];
  databasesLoading: boolean;
  views: IView[];
  view: IView | null;
  viewsLoading: boolean;
  viewSaving: boolean;
  viewRemoving: boolean;
  onSaveView: SaveViewCallback;
  onRemoveView: RemoveViewCallback;
  onToggleSort?: OnToggleSortCallback;
  onRemoveDatabase: RemoveDatabaseCallback;
  onLoadMore: OnLoadMoreCallback;
  setPage: SetPageCallback;
  canLoadMore: boolean;
  currentPage: number;
  firstPage: number;
  listParams: IParams | undefined;
  listMetadata: INotebooksMetadata | null;
};

interface IShareDatabaseElement {
  database: IDatabase;
}

function displayRows({
  databases,
  databasesLoading,
  headers,
  url,
  rowMenuContent,
  rowClickEnabled,
  onRowClicked,
  onRowDoubleClicked,
  onContextMenuOpenChange,
  currentPage,
  firstPage
}: {
  databases: IDatabase[];
  databasesLoading: boolean;
  headers: { [id: string]: IListColumn };
  url: string;
  rowMenuContent: any;
  rowClickEnabled: boolean;
  onRowClicked: RowClickedCallback;
  onRowDoubleClicked: RowDoubleClickedCallback;
  onContextMenuOpenChange: OnContextMenuOpenChangeCallback;
  currentPage: number;
  firstPage: number;
}) {
  return databasesLoading && isFirstPage(currentPage, firstPage) ?
    displayRowsSkeleton(headers) :
    displayRowsData({
      databases, headers, url, rowMenuContent,
      rowClickEnabled, onRowClicked, onRowDoubleClicked,
      onContextMenuOpenChange
    });
}



function displayRowsData({
  databases,
  headers,
  url,
  rowMenuContent,
  rowClickEnabled,
  onRowClicked,
  onRowDoubleClicked,
  onContextMenuOpenChange
}: {
  databases: IDatabase[];
  headers: { [id: string]: IListColumn };
  url: string;
  rowMenuContent: any;
  rowClickEnabled: boolean;
  onRowClicked: RowClickedCallback;
  onRowDoubleClicked: RowDoubleClickedCallback;
  onContextMenuOpenChange: OnContextMenuOpenChangeCallback;
}) {
  const handleRowClick = (database: IDatabase) => {
    rowClickEnabled && onRowClicked(database);
  };

  const handleRowDoubleClick = (database: IDatabase) => {
    rowClickEnabled && onRowDoubleClicked(database);
  };

  return databases && databases.map(database => {
    const rowMenuContentForDatabase = rowMenuContent && rowMenuContent(database);

    return (
      <ListRow
        key={database.uid}
        onRowClicked={() => handleRowClick(database)}
        onRowDoubleClicked={() => handleRowDoubleClick(database)}
      >
        <ListColumn properties={headers.database_name} main={true}>
          <SquareIndicator icon={IconNames.DATABASE} color={Colors.GRAY1}></SquareIndicator>
          <LabelWithLegend label={database.database_name} legend={`Type: ${database.backend}`} />
        </ListColumn>
        <ListColumn properties={headers.changed_by}>
          <UserNames user={database.changed_by} />
        </ListColumn>
        <ListColumn properties={headers.changed_on}>
          <TimeAgo date={database.changed_on_utc} minPeriod={60} />
        </ListColumn>
        <ListColumn properties={headers.created_by}>
          <UserNames user={database.created_by} />
        </ListColumn>
        <ListColumn properties={headers.created_on}>
          <TimeAgo date={database.created_on_utc} minPeriod={60} />
        </ListColumn>
        <ListColumn properties={headers.actions}>
          {
            rowMenuContentForDatabase && (
              <ButtonGroup>
                <div onClick={stopPropagationForPopover}>
                  <Popover
                    content={rowMenuContentForDatabase}
                    position={Position.BOTTOM_RIGHT}
                    className="query-list__rows__trigger"
                    onOpened={() => onContextMenuOpenChange(true)}
                    onClosed={() => onContextMenuOpenChange(false)}
                  >
                    <Button className='bp3-button bp3-minimal' icon={IconNames.MORE}></Button>
                  </Popover>
                </div>
              </ButtonGroup>
            )
          }
        </ListColumn>
      </ListRow>
    );
  });
}

const DatabaseListComponent: FunctionComponent<DatabaseListComponentProps> = ({
  databases, databasesLoading, views, view,
  viewsLoading, viewSaving, viewRemoving,
  onSaveView, onRemoveView, onToggleSort, onLoadMore,
  canLoadMore, setPage, currentPage, firstPage,
  listParams, listMetadata, onRemoveDatabase
}: DatabaseListComponentProps) => {
  const [ showSharing, setShowSharing ] = useState(false); // show sharing settings for last created database
  const [ detailsDisplayed, setDetailsDisplayed ] = useState(false);
  const [ rowClickEnabled, setRowClickEnabled ] = useState(true);
  const [ selectedDatabase, setSelectedDatabase ] = useState<IDatabase | null>(null);
  const [ confirmRemoveDatabase, setConfirmRemoveDatabase ] = useState<IDatabase | null>(null);
  const currentUser = useSelector((state: IState) => state.users.user);
  const currentUserPermissions = useSelector((state: IState) => state.databases.currentUserPermissions);
  const lastCreatedDatabase = useSelector((state: IState) => state.databases.lastCreatedDatabase);
  const dispatch = useDispatch();
  const history = useHistory();
  let { url } = useRouteMatch();
  url = url.endsWith('/') ? url.slice(0, -1) : url;

  useEffect(() => {
    if (currentUser && selectedDatabase && isLoggedIn(currentUser) && !isAdmin(currentUser)) {
      dispatch(loadCurrentUserPermissions(
        selectedDatabase?.uid as string,
        currentUser.uid as string));
    } else if (selectedDatabase) {
      loadedCurrentUserPermissions(null);
    }
  }, [ selectedDatabase, currentUser ]);

  useEffect(() => {
    /*
     * load / remove Sharing Settings after every open / close drawer
     */
    if (selectedDatabase) {
      dispatch(loadDatabaseSharingSettings(selectedDatabase.uid));
    } else {
      dispatch(loadedDatabaseSharingSettings(null));
    }

    return () => {
      dispatch(loadedDatabaseSharingSettings(null));
    };
  }, [ selectedDatabase ]);

  useEffect(() => {
    if (!databasesLoading && lastCreatedDatabase) {
      dispatch(loadDatabaseSharingSettings(lastCreatedDatabase?.uid as string));
    }
  }, [ databasesLoading, lastCreatedDatabase ]);

  useEffect(() => {
    if (!databasesLoading && lastCreatedDatabase) {
      setShowSharing(true);
    }
  }, [ databasesLoading, lastCreatedDatabase ]);

  const canEdit = useMemo(() => {
    return isAdmin(currentUser) || (currentUserPermissions ? currentUserPermissions.edit : false);
  }, [ selectedDatabase, currentUserPermissions ]);

  const onShareClose = useCallback(() => {
    /*
     * unset last created database & its sharing settings
     */
    setShowSharing(false);
    dispatch(unsetLastCreatedDatabase());
    dispatch(loadedDatabaseSharingSettings(null));
  }, [ ]);

  const onShare = useCallback((value: any) => {

  }, [ ]);

  const onCloseDetails = () => {
    setSelectedDatabase(null);
    setDetailsDisplayed(false);
  };

  const onRowClicked = (row: IDatabase) => {
    setSelectedDatabase(row);
    setDetailsDisplayed(true);
  };

  const gotoEdit = (database: IDatabase) => {
    history.push(`${url}/${database.uid}/edit`);
  }

  const onRowDoubleClicked = (row: IDatabase) => {
    history.push(`${url}/${row.uid}`);
  };

  const onContextMenuOpenChange = (openMode: boolean) => {
    setRowClickEnabled(!openMode);
  };

  const handleToggleSort = (sort: ISort) => {
    onToggleSort && onToggleSort(sort);
  };

  const isNotGuest = useMemo(() => isLoggedIn(currentUser) && !isGuest(currentUser), [ currentUser ]);

  const rowMenuContent = (database: IDatabase) => (
    <Menu data-cy='databaseActionMenu'>
      <MenuItem
        icon={IconNames.DOCUMENT_OPEN}
        text="Open"
        onClick={() => onRowDoubleClicked(database)} />
      {
        isNotGuest && canEdit && (
          <Fragment>
            <MenuItem
              icon={IconNames.EDIT}
              text="Edit" onClick={() => gotoEdit(database)} />
            <MenuDivider />
            <MenuItem
              icon={IconNames.TRASH}
              text="Remove"
              onClick={() => setConfirmRemoveDatabase(database)} />
          </Fragment>
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
        isOpen={!!confirmRemoveDatabase}
        onClose={() => setConfirmRemoveDatabase(null) }
        usePortal={true}
        title="Delete the database"
        icon="help"
      >
        <ConfirmDialogComponent
          message={confirmRemoveDatabase ?
            `Do you want to delete the database '${confirmRemoveDatabase?.database_name}'` :
            ''
          }
          pending={viewRemoving}
          onConfirm={() => {
            if (confirmRemoveDatabase) {
              onRemoveDatabase(confirmRemoveDatabase.uid);
            }
          }}
          onClose={() => setConfirmRemoveDatabase(null) }
        ></ConfirmDialogComponent>
      </Dialog>
    );
  };

  const SharingSettingsElement = useCallback(() => {
    if (!selectedDatabase) {
      return null;
    }

    return (
      <ShareDatabaseButton
        database={selectedDatabase} />
    )
  }, [ selectedDatabase ]);

  // if not loading and no databases found
  const noDatabases = !databasesLoading && (!databases || (databases && !databases.length));

  return (
    <div>
      <LeftMenu>
        <Helmet>
          <title>
            {view ? view.name : "All Databases" }
          </title>
        </Helmet>
        <SharedListLeftMenuComponent
          views={views}
          viewsLoading={viewsLoading}
          viewSaving={viewSaving}
          viewRemoving={viewRemoving}
          onSaveView={onSaveView}
          onRemoveView={onRemoveView}
          menuTitle="Databases"
          routePreLink="/d/d/v/"
          getAllViewsLink="/d/d"
        ></SharedListLeftMenuComponent>
      </LeftMenu>
      <PanelTitle>
        {view ? view.name : 'All databases'}
      </PanelTitle>

      <div className="database-list">
        <ListFiltersContainer
          listMetadata={listMetadata}
          listParams={listParams}
          view_type='Database'
          loadListData={loadDatabases}
          setPage={setPage}
          columnsList={databaseColumns}
        />
        {
          noDatabases ?
            <NoResult
              icon={IconNames.DATABASE}
              title="No databases found"
              description="Create a new database or refine your filter criteria."
            /> : (
              <List>
                <ListHeaders
                  headers={databaseColumns}
                  onToggleSort={handleToggleSort}/>
                {
                  <div className='infinite-scroll-base' id='databases-infinite-scroll'>
                    <InfiniteScroll
                      dataLength={databases.length}
                      next={onLoadMore}
                      hasMore={!databasesLoading && canLoadMore}
                      loader={<Spinner size={50} className='load-more-spinner'/>}
                      scrollableTarget="databases-infinite-scroll"
                    >
                      {
                        displayRows({
                          databases, databasesLoading, headers: databaseColumns, url, rowMenuContent: null,
                          rowClickEnabled, onRowClicked, onRowDoubleClicked,
                          onContextMenuOpenChange, currentPage, firstPage
                        })
                      }
                    </InfiniteScroll>
                  </div>
                }
              </List>
            )
        }
        <DrawerContainer
          isOpen={detailsDisplayed}
          icon={IconNames.DATABASE}
          iconBackgroundColor={Colors.GRAY1}
          label={selectedDatabase ? selectedDatabase.database_name : ''}
          detailsLink={selectedDatabase ? `${url}/${selectedDatabase.uid}` : null}
          menuContent={selectedDatabase ? rowMenuContent(selectedDatabase) : null}
          actionElement={selectedDatabase && canEdit ? SharingSettingsElement : null}
          onClose={onCloseDetails}
        >
          { selectedDatabase && (
            <DatabaseDetailsInfoContainer
              databaseUid={selectedDatabase.uid}
              onCloseDrawer={onCloseDetails}
            ></DatabaseDetailsInfoContainer>
          )}
        </DrawerContainer>
      </div>
      {
        canEdit && lastCreatedDatabase && (
          <ShareDatabaseDialog
            show={showSharing}
            onClose={onShareClose}
            onShare={onShare}
            database={lastCreatedDatabase} />
        )
      }
      { configureConfirmRemoveModal() }
    </div>
  )
};

export default DatabaseListComponent;
