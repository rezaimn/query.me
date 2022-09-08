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
import './SchemaList.scss';
import { LeftMenu } from '../../../shared/components/layout/LeftMenu';
import { PanelTitle } from '../../../shared/components/layout/PanelTitle';
import {ISchema, IListColumn, IView, ISort, IParams, INotebooksMetadata} from '../../../shared/models';
import {List, ListHeaders, ListRow, ListColumn, SquareIndicator, NoResult} from '../../../shared/components/list';
import { DrawerContainer } from '../../../shared/components/layout/Drawer';
import SchemaDetailsInfoContainer from './SchemaDetailsInfoContainer';
import { stopPropagationForPopover } from '../../../shared/utils/events';
import {isFirstPage} from '../../notebooks/utils';
import InfiniteScroll from 'react-infinite-scroll-component';
import {displayRowsSkeleton} from '../../../shared/components/displayRowsSkeleton/displayRowsSkeleton';
import ListFiltersContainer from '../../../shared/components/ListFilterContainer/ListFilterContainer';
import { loadSchemas } from '../../../shared/store/actions/schemaActions';
import SharedListLeftMenuComponent from '../../../shared/components/SharedListLeftMenu/SharedListLeftMenu';
import { schemaColumns } from './constants';


type RowClickedCallback = (schema: ISchema) => void;
type RowDoubleClickedCallback = (schema: ISchema) => void;
type SaveViewCallback = (view: IView) => void;
type RemoveViewCallback = (viewId: number) => void;
type OnContextMenuOpenChangeCallback = (openMode: boolean) => void;
type OnToggleSortCallback = (sort: ISort) => void;
type OnLoadMoreCallback = () => void;
type SetPageCallback = (value:number) => void;

type SchemaListComponentProps = {
  schemas: ISchema[];
  schemasLoading: boolean;
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
  listMetadata: INotebooksMetadata | null;
};

function displayRows({
  schemas,
  schemasLoading,
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
  schemas: ISchema[];
  schemasLoading: boolean;
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
  return schemasLoading && isFirstPage(currentPage, firstPage) ?
    displayRowsSkeleton(headers) :
    displayRowsData({
      schemas, headers, url, rowMenuContent,
      rowClickEnabled, onRowClicked, onRowDoubleClicked,
      onContextMenuOpenChange
    });
}

function displayRowsData({
  schemas,
  headers,
  url,
  rowMenuContent,
  rowClickEnabled,
  onRowClicked,
  onRowDoubleClicked,
  onContextMenuOpenChange
}: {
  schemas: ISchema[];
  headers: { [id: string]: IListColumn };
  url: string;
  rowMenuContent: any;
  rowClickEnabled: boolean;
  onRowClicked: RowClickedCallback;
  onRowDoubleClicked: RowDoubleClickedCallback;
  onContextMenuOpenChange: OnContextMenuOpenChangeCallback;
}) {
  const handleRowClick = (schema: ISchema) => {
    rowClickEnabled && onRowClicked(schema);
  };

  const handleRowDoubleClick = (schema: ISchema) => {
    rowClickEnabled && onRowDoubleClicked(schema);
  };

  return schemas && schemas.map((schema, index) => {
    const rowMenuContentForSchema = rowMenuContent(schema);

    return (
      <ListRow
        key={index}
        onRowClicked={() => handleRowClick(schema)}
        onRowDoubleClicked={() => handleRowDoubleClick(schema)}
      >
        <ListColumn properties={headers.name} main={true}>
          <SquareIndicator icon={IconNames.HEAT_GRID} color={Colors.GRAY1}></SquareIndicator>
          <Tooltip
            minimal={true}
            content={<span>{schema.name}</span>}
          >{schema.name}</Tooltip>
        </ListColumn>
        <ListColumn properties={headers.database}>
          <Tooltip
            minimal={true}
            content={<span>{schema.database}</span>}
          >{schema.database}</Tooltip>
        </ListColumn>
        <ListColumn properties={headers.actions}>
          <ButtonGroup>
            <div onClick={stopPropagationForPopover}>
              <Popover
                content={rowMenuContentForSchema}
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

const SchemaListComponent: FunctionComponent<SchemaListComponentProps> = ({
  schemas, schemasLoading, views, view,
  viewsLoading, viewSaving, viewRemoving,
  onSaveView, onRemoveView, onToggleSort,
  onLoadMore, canLoadMore,setPage, currentPage, firstPage,
  listParams,
  listMetadata
}: SchemaListComponentProps) => {
  const [ detailsDisplayed, setDetailsDisplayed ] = useState(false);
  const [ rowClickEnabled, setRowClickEnabled ] = useState(true);
  const [ selectedSchema, setSelectedSchema ] = useState<ISchema | null>(null);
  const [ selectedSchemaBreadcrumb, setSelectedSchemaBreadcrumb ] = useState<IBreadcrumbProps[] | null>(null);
  const history = useHistory();
  let { url } = useRouteMatch();
  url = url.endsWith('/') ? url.slice(0, -1) : url;

  const onCloseDetails = () => {
    setSelectedSchema(null);
    setSelectedSchemaBreadcrumb(null);
    setDetailsDisplayed(false);
  };

  const onRowClicked = (row: ISchema) => {
    setSelectedSchema(row);
    setSelectedSchemaBreadcrumb([
      { icon: IconNames.DATABASE, text: row.database },
      { icon: IconNames.HEAT_GRID, text: row.name }
    ]);
    setDetailsDisplayed(true);
  };

  const onRowDoubleClicked = (row: ISchema) => {
    history.push(`${url}/${row.id}`);
  };

  const onContextMenuOpenChange = (openMode: boolean) => {
    setRowClickEnabled(!openMode);
  };

  const handleToggleSort = (sort: ISort) => {
    onToggleSort && onToggleSort(sort);
  };

  const rowMenuContent = (schema: ISchema) => (
    <Menu data-cy='schemaActionMenu'>
      <MenuItem
        icon={IconNames.DOCUMENT_OPEN}
        text="Open"
        onClick={() => onRowDoubleClicked(schema)}
      ></MenuItem>
      { /* <MenuDivider />
      <MenuItem icon={IconNames.DUPLICATE} text="Make a copy"></MenuItem>
      <MenuItem icon={IconNames.LINK} text="Get shareable link"></MenuItem>
      <MenuItem icon={IconNames.STAR_EMPTY} text="Bookmark"></MenuItem>
      <MenuDivider />
      <MenuItem icon={IconNames.TRASH} text="Remove"></MenuItem> */ }
    </Menu>
  );

  // if not loading and no schemas found
  const noSchemas = !schemasLoading && (!schemas || (schemas && !schemas.length));

  return (
    <div>
      <Helmet>
        <title>
          {view ? view.name : 'All schemas'}
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
          menuTitle="Schemas"
          routePreLink="/d/s/v/"
          getAllViewsLink="/d/s"
        ></SharedListLeftMenuComponent>
      </LeftMenu>
      <PanelTitle>
        {view ? view.name : 'All schemas'}
      </PanelTitle>

      <div className="schema-list">
        <ListFiltersContainer
          listMetadata={listMetadata}
          listParams={listParams}
          loadListData={loadSchemas}
          view_type='Schema'
          setPage={setPage}
          columnsList={schemaColumns}
        />
        {
          noSchemas ?
            <NoResult
              icon={IconNames.HEAT_GRID}
              title="No schemas found"
              description="Create a new database or refine your filter criteria." /> : (
        <List>
          <ListHeaders
            headers={schemaColumns}
            onToggleSort={handleToggleSort} />
          {
            <div className='infinite-scroll-base' id='schemas-infinite-scroll'>
              <InfiniteScroll
                dataLength={schemas.length}
                next={onLoadMore}
                hasMore={!schemasLoading && canLoadMore}
                loader={<Spinner size={50} className='load-more-spinner'/>}
                scrollableTarget="schemas-infinite-scroll"
              >
                {
                  displayRows({
                    schemas, schemasLoading, headers: schemaColumns, url, rowMenuContent,
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
          icon={IconNames.HEAT_GRID}
          iconBackgroundColor={Colors.GRAY1}
          label={selectedSchema ? selectedSchema.name : ''}
          breadcrumb={selectedSchemaBreadcrumb}
          detailsLink={selectedSchema ? `${url}/${selectedSchema.id}` : null}
          menuContent={selectedSchema ? rowMenuContent(selectedSchema) : null}
          onClose={onCloseDetails}
        >
          { selectedSchema && (
            <SchemaDetailsInfoContainer
              schemaId={selectedSchema.id}
              onCloseDrawer={onCloseDetails}
            ></SchemaDetailsInfoContainer>
          )}
        </DrawerContainer>
      </div>
    </div>
  )
};

export default SchemaListComponent;
