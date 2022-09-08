import React, { FunctionComponent } from 'react';
import { Colors } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Helmet } from 'react-helmet';
import { LeftMenu } from '../../../shared/components/layout/LeftMenu';
import { PanelTitle } from '../../../shared/components/layout/PanelTitle';
import { DetailsHeader } from '../../../shared/components/layout/DetailsHeader';
import TableDetailsInfoComponent from './TableDetailsInfo';
import { ITable, IView, ISort } from '../../../shared/models';
import SharedListLeftMenuComponent from '../../../shared/components/SharedListLeftMenu/SharedListLeftMenu';
import { thViewIcon } from '../../../shared/utils/custom-icons';

type SaveViewCallback = (view: IView) => void;
type RemoveViewCallback = (viewId: number) => void;
type OnToggleSortCallback = (sort: ISort) => void;
type OnLoadMoreColumnsForTableCallback = () => void;

type TableDetailsProps = {
  table: ITable | null;
  tableLoading: boolean;
  views: IView[];
  viewsLoading: boolean;
  viewSaving: boolean;
  viewRemoving: boolean;
  onSaveView: SaveViewCallback;
  onRemoveView: RemoveViewCallback;
  onToggleSort: OnToggleSortCallback;
  canLoadMore: boolean;
  firstPage: number;
  loadMoreColumnsForTable: OnLoadMoreColumnsForTableCallback;
  currentPage: number;
};

const TableDetailsComponent: FunctionComponent<TableDetailsProps> = ({
  table, tableLoading, views,
  viewsLoading, viewSaving, viewRemoving,
  onSaveView, onRemoveView, onToggleSort,
  loadMoreColumnsForTable,
  canLoadMore,
  currentPage,
  firstPage
}: TableDetailsProps) => {
  return (
    <div>
      <Helmet>
        <title>
          {table ? table.name : 'Table'}
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
        <DetailsHeader
          label={table ? table.name : ''}
          icon={table ? (table.type === 'table' ? IconNames.TH : thViewIcon({
            fill: '#fff',
            height: 36,
            width: 36,
            viewBoxDefault: '8 -8 8 40',
          })) : IconNames.TH}
          iconBackgroundColor={Colors.GRAY2}
          fromDetails={true}
          backUrl="/d/t"
        />
      </PanelTitle>

      <TableDetailsInfoComponent
        infiniteScrollClassName='infinite-scroll-base-table-detail'
        canLoadMore={canLoadMore}
        firstPage={firstPage}
        loadMoreColumnsForTable={loadMoreColumnsForTable}
        currentPage={currentPage}
        table={table}
        tableLoading={tableLoading}
        onToggleSort={onToggleSort}
      ></TableDetailsInfoComponent>
    </div>
  )
};

export default TableDetailsComponent;
