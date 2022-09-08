import React, { FunctionComponent } from 'react';
import { Colors } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Helmet } from 'react-helmet';
import { LeftMenu } from '../../../shared/components/layout/LeftMenu';
import { PanelTitle } from '../../../shared/components/layout/PanelTitle';
import { DetailsHeader } from '../../../shared/components/layout/DetailsHeader';
import SchemaDetailsInfoComponent from './SchemaDetailsInfo';
import { ISchema, IView, ISort } from '../../../shared/models';
import SharedListLeftMenuComponent from '../../../shared/components/SharedListLeftMenu/SharedListLeftMenu';

type SaveViewCallback = (view: IView) => void;
type RemoveViewCallback = (viewId: number) => void;
type OnToggleSortCallback = (sort: ISort) => void;
type OnLoadMoreTablesForSchemaCallback = () => void;

type SchemaDetailsProps = {
  schema: ISchema | null;
  schemaLoading: boolean;
  views: IView[];
  viewsLoading: boolean;
  viewSaving: boolean;
  viewRemoving: boolean;
  onSaveView: SaveViewCallback;
  onRemoveView: RemoveViewCallback;
  onToggleSort: OnToggleSortCallback;
  canLoadMore: boolean;
  firstPage: number;
  loadMoreTablesForSchema: OnLoadMoreTablesForSchemaCallback;
  currentPage: number;
};

const SchemaDetailsComponent: FunctionComponent<SchemaDetailsProps> = ({
  schema, schemaLoading, views,
  viewsLoading, viewSaving, viewRemoving,
  onSaveView, onRemoveView, onToggleSort,
  loadMoreTablesForSchema,
  canLoadMore,
  currentPage,
  firstPage
}: SchemaDetailsProps) => {
  return (
    <div>
      <Helmet>
        <title>
          {schema ? schema.name : "Schema"}
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
        <DetailsHeader
          label={schema ? schema.name: ''}
          icon={IconNames.HEAT_GRID}
          iconBackgroundColor={Colors.GRAY2}
          fromDetails={true}
          backUrl="/d/s"
        ></DetailsHeader>
      </PanelTitle>

      <SchemaDetailsInfoComponent
        infiniteScrollClassName='infinite-scroll-base-schema-detail'
        canLoadMore={canLoadMore}
        firstPage={firstPage}
        loadMoreTablesForSchema={loadMoreTablesForSchema}
        currentPage={currentPage}
        schema={schema}
        schemaLoading={schemaLoading}
        onToggleSort={onToggleSort}
      ></SchemaDetailsInfoComponent>
    </div>
  )
};

export default SchemaDetailsComponent;
