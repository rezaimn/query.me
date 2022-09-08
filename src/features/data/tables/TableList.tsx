import React, { FunctionComponent, useState } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import {
  Colors,
  ButtonGroup,
  Button,
  Popover,
  Position,
  Menu,
  MenuItem,
  Tooltip,
  IBreadcrumbProps,
  Spinner
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Helmet } from 'react-helmet';
import './TableList.scss';
import { LeftMenu } from '../../../shared/components/layout/LeftMenu';
import { PanelTitle } from '../../../shared/components/layout/PanelTitle';
import {
  ITable,
  IListColumn,
  IView,
  ISort,
  IParams,
  ISharedListMetadata
} from '../../../shared/models';
import {
  List,
  ListHeaders,
  ListRow,
  ListColumn,
  SquareIndicator,
  NoResult} from '../../../shared/components/list';
import { DrawerContainer } from '../../../shared/components/layout/Drawer';
import TableDetailsInfoContainer from './TableDetailsInfoContainer';
import { stopPropagationForPopover } from '../../../shared/utils/events';
import InfiniteScroll from 'react-infinite-scroll-component';
import {isFirstPage} from '../../notebooks/utils';
import {displayRowsSkeleton} from '../../../shared/components/displayRowsSkeleton/displayRowsSkeleton';
import { loadTables } from '../../../shared/store/actions/tableActions';
import ListFiltersContainer from '../../../shared/components/ListFilterContainer/ListFilterContainer';
import SharedListLeftMenuComponent from '../../../shared/components/SharedListLeftMenu/SharedListLeftMenu';
import { thViewIcon } from '../../../shared/utils/custom-icons';
import { tableColumns } from './constants';

type RowClickedCallback = (table: ITable) => void;
type RowDoubleClickedCallback = (table: ITable) => void;
type SaveViewCallback = (view: IView) => void;
type RemoveViewCallback = (viewId: number) => void;
type OnContextMenuOpenChangeCallback = (openMode: boolean) => void;
type OnToggleSortCallback = (sort: ISort) => void;
type OnLoadMoreCallback = () => void;
type SetPageCallback = (value:number) => void;

type TableListComponentProps = {
  tables: ITable[];
  tablesLoading: boolean;
  views: IView[];
  view: IView | null;
  viewsLoading: boolean;
  viewSaving: boolean;
  viewRemoving: boolean;
  onSaveView: SaveViewCallback;
  onRemoveView: RemoveViewCallback;
  onToggleSort?: OnToggleSortCallback;
  onLoadMore: OnLoadMoreCallback;
  setPage: SetPageCallback;
  canLoadMore: boolean;
  currentPage: number;
  firstPage: number;
  listParams: IParams | undefined;
  listMetadata: ISharedListMetadata | null;
};

function displayRows({
  tables,
  tablesLoading,
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
  tables: ITable[];
  tablesLoading: boolean;
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
  return tablesLoading && isFirstPage(currentPage, firstPage) ?
    displayRowsSkeleton(headers) :
    displayRowsData({
      tables, headers, url, rowMenuContent,
      rowClickEnabled, onRowClicked, onRowDoubleClicked,
      onContextMenuOpenChange
    });
}


function displayRowsData({
  tables,
  headers,
  url,
  rowMenuContent,
  rowClickEnabled,
  onRowClicked,
  onRowDoubleClicked,
  onContextMenuOpenChange
}: {
  tables: ITable[];
  headers: { [id: string]: IListColumn };
  url: string;
  rowMenuContent: any;
  rowClickEnabled: boolean;
  onRowClicked: RowClickedCallback;
  onRowDoubleClicked: RowDoubleClickedCallback;
  onContextMenuOpenChange: OnContextMenuOpenChangeCallback;
}) {
  const handleRowClick = (table: ITable) => {
    rowClickEnabled && onRowClicked(table);
  };

  const handleRowDoubleClick = (table: ITable) => {
    rowClickEnabled && onRowDoubleClicked(table);
  };

  return tables && tables.map((table, index) => {
    const rowMenuContentForTable = rowMenuContent(table);

    return (
      <ListRow
        key={index}
        onRowClicked={() => handleRowClick(table)}
        onRowDoubleClicked={() => handleRowDoubleClick(table)}
      >
        <ListColumn properties={headers.name} main={true}>
          <SquareIndicator
            icon={table.type === 'table' ? IconNames.TH : thViewIcon({
              fill: '#fff',
              height: 24,
              width: 24,
              viewBoxDefault: '8 -3 8 30',
            })}
            color={Colors.GRAY1}/>
          <Tooltip
            minimal={true}
            content={<span>{table.name}</span>}
          >{table.name}</Tooltip>
        </ListColumn>
        <ListColumn properties={headers.database}>
          <Tooltip
            minimal={true}
            content={<span>{table.database}</span>}
          >{table.database}</Tooltip>
        </ListColumn>
        <ListColumn properties={headers.schema}>
          <Tooltip
            minimal={true}
            content={<span>{table.schema}</span>}
          >{table.schema}</Tooltip>
        </ListColumn>
        <ListColumn properties={headers.actions}>
          <ButtonGroup>
            <div onClick={stopPropagationForPopover}>
              <Popover
                content={rowMenuContentForTable}
                position={Position.BOTTOM_RIGHT}
                className="query-list__rows__trigger"
                onOpened={() => onContextMenuOpenChange(true)}
                onClosed={() => onContextMenuOpenChange(false)}
              >
                <Button className='bp3-button bp3-minimal' icon={IconNames.MORE}></Button>
              </Popover>
            </div>
          </ButtonGroup>
        </ListColumn>
      </ListRow>
    );
  });
}

const TableListComponent: FunctionComponent<TableListComponentProps> = ({
  tables, tablesLoading, views, view,
  viewsLoading, viewSaving, viewRemoving,
  onSaveView, onRemoveView, onToggleSort,
  onLoadMore, canLoadMore,setPage, currentPage, firstPage,
  listParams, listMetadata
}: TableListComponentProps) => {
  const [ detailsDisplayed, setDetailsDisplayed ] = useState(false);
  const [ rowClickEnabled, setRowClickEnabled ] = useState(true);
  const [ selectedTable, setSelectedTable ] = useState<ITable | null>(null);
  const [ selectedTableBreadcrumb, setSelectedTableBreadcrumb ] = useState<IBreadcrumbProps[] | null>(null);
  const history = useHistory();
  let { url } = useRouteMatch();
  url = url.endsWith('/') ? url.slice(0, -1) : url;


///should remove and send as props
  const onCloseDetails = () => {
    setSelectedTable(null);
    setSelectedTableBreadcrumb(null);
    setDetailsDisplayed(false);
  };
///should remove and send as props
  const onRowClicked = (row: ITable) => {
    setSelectedTable(row);
    setSelectedTableBreadcrumb([
      { icon: IconNames.DATABASE, text: row.database },
      { icon: IconNames.HEAT_GRID, text: row.schema },
      { icon: row.type === 'table' ? IconNames.TH : thViewIcon({
          fill: '#222',
          height: 30,
          width: 30,
          viewBoxDefault: '10 -3 8 30',
        }), text: row.name },
    ]);
    setDetailsDisplayed(true);
  };

  const onRowDoubleClicked = (row: ITable) => {
    history.push(`${url}/${row.id}`);
  };

  const onContextMenuOpenChange = (openMode: boolean) => {
    setRowClickEnabled(!openMode);
  };

  const handleToggleSort = (sort: ISort) => {
    onToggleSort && onToggleSort(sort);
  };

  const rowMenuContent = (table: ITable) => (
    <Menu data-cy='tableActionMenu'>
      <MenuItem
        icon={IconNames.DOCUMENT_OPEN}
        text="Open"
        onClick={() => onRowDoubleClicked(table)}
      ></MenuItem>
      { /* <MenuDivider />
      <MenuItem icon={IconNames.DUPLICATE} text="Make a copy"></MenuItem>
      <MenuItem icon={IconNames.LINK} text="Get shareable link"></MenuItem>
      <MenuItem icon={IconNames.STAR_EMPTY} text="Bookmark"></MenuItem>
      <MenuDivider />
      <MenuItem icon={IconNames.TRASH} text="Remove"></MenuItem> */ }
    </Menu>
  );

  // if not loading and no tables found
  const noTables = !tablesLoading && (!tables || (tables && !tables.length));

  return (
    <div>
      <Helmet>
        <title>
          {view ? view.name : 'All Tables'}
        </title>
      </Helmet>
      <LeftMenu>
        <SharedListLeftMenuComponent
          views={views}
          viewsLoading={viewsLoading}
          viewSaving={viewSaving}
          viewRemoving={viewRemoving}
          onSaveView={onSaveView}
          onRemoveView={onRemoveView}
          menuTitle="Tables"
          routePreLink="/d/t/v/"
          getAllViewsLink="/d/t"
        ></SharedListLeftMenuComponent>
      </LeftMenu>
      <PanelTitle>
        {view ? view.name : 'All tables'}
      </PanelTitle>

      <div className="table-list">
        <ListFiltersContainer
          listMetadata={listMetadata}
          listParams={listParams}
          view_type='Table'
          loadListData={loadTables}
          setPage={setPage}
          columnsList={tableColumns}
        />
        {
          noTables ? <NoResult
            icon={IconNames.TH}
            title="No tables found"
            description="Create a new database or refine your filter criteria." /> : (
            <List>
              <ListHeaders
                headers={tableColumns}
                onToggleSort={handleToggleSort}/>
              {
                <div className='infinite-scroll-base' id='tables-infinite-scroll'>
                  <InfiniteScroll
                    dataLength={tables.length}
                    next={onLoadMore}
                    hasMore={!tablesLoading && canLoadMore}
                    loader={<Spinner size={50} className='load-more-spinner'/>}
                    scrollableTarget="tables-infinite-scroll"
                  >
                    {
                      displayRows({
                        tables, tablesLoading, headers: tableColumns, url, rowMenuContent,
                        rowClickEnabled, onRowClicked, onRowDoubleClicked,
                        onContextMenuOpenChange,
                        currentPage,
                        firstPage
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
          icon={selectedTable ? (selectedTable.type === 'table' ? IconNames.TH : thViewIcon({
            height: 24,
            width: 24,
            viewBoxDefault: '8 -3 8 30',
          })):IconNames.TH}
          iconBackgroundColor={Colors.GRAY1}
          label={selectedTable ? selectedTable.name : ''}
          breadcrumb={selectedTableBreadcrumb}
          detailsLink={selectedTable ? `${url}/${selectedTable.id}` : null}
          onClose={onCloseDetails}
        >
          { selectedTable && (
            <TableDetailsInfoContainer
              tableId={selectedTable.id}
            ></TableDetailsInfoContainer>
          )}
        </DrawerContainer>
      </div>
    </div>
  )
};

export default TableListComponent;
