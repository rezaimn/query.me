import React, { FunctionComponent } from 'react';
import { Colors } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Helmet } from 'react-helmet';
import { LeftMenu } from '../../../shared/components/layout/LeftMenu';
import { PanelTitle } from '../../../shared/components/layout/PanelTitle';
import { DetailsHeader } from '../../../shared/components/layout/DetailsHeader';
import DatabaseDetailsInfoComponent from './DatabaseDetailsInfo';
import { IDatabase, IView, ISort } from '../../../shared/models';
import SharedListLeftMenuComponent from '../../../shared/components/SharedListLeftMenu/SharedListLeftMenu';

type SaveViewCallback = (view: IView) => void;
type RemoveViewCallback = (viewId: number) => void;
type OnToggleSortCallback = (sort: ISort) => void;
type OnLoadMoreSchemasForDatabaseCallback = () => void;

type DatabaseDetailsProps = {
  database: IDatabase | null;
  databaseLoading: boolean;
  views: IView[];
  viewsLoading: boolean;
  viewSaving: boolean;
  viewRemoving: boolean;
  onSaveView: SaveViewCallback;
  onRemoveView: RemoveViewCallback;
  onToggleSort: OnToggleSortCallback;
  canLoadMore: boolean;
  firstPage: number;
  loadMoreSchemasForDatabase: OnLoadMoreSchemasForDatabaseCallback;
  currentPage: number;
};

const DatabaseDetailsComponent: FunctionComponent<DatabaseDetailsProps> = ({
  database, databaseLoading, views,
  viewsLoading, viewSaving, viewRemoving,
  onSaveView, onRemoveView, onToggleSort,
  loadMoreSchemasForDatabase,
  canLoadMore,
  currentPage,
  firstPage
}: DatabaseDetailsProps) => {
  return (
    <div>
      <Helmet>
        <title>
            {database ? database.database_name : "Database"}
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
          menuTitle="Databases"
          routePreLink="/d/d/v/"
          getAllViewsLink="/d/d"
        ></SharedListLeftMenuComponent>
      </LeftMenu>
      <PanelTitle>
        <DetailsHeader
          label={database ? database.database_name: ''}
          icon={IconNames.DATABASE}
          iconBackgroundColor={Colors.GRAY2}
          fromDetails={true}
          backUrl="/d/d"
        ></DetailsHeader>
      </PanelTitle>

      <DatabaseDetailsInfoComponent
        canLoadMore={canLoadMore}
        firstPage={firstPage}
        loadMoreSchemasForDatabase={loadMoreSchemasForDatabase}
        currentPage={currentPage}
        infiniteScrollClassName='infinite-scroll-base-database-detail'
        database={database}
        databaseLoading={databaseLoading}
        onToggleSort={onToggleSort}
      />
    </div>
  )
};

export default DatabaseDetailsComponent;
