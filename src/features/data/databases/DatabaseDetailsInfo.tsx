import React, {FunctionComponent} from 'react';
import TimeAgo from 'react-timeago';

import './DatabaseDetailsInfo.scss';
import LabelledText from '../../../shared/components/form/LabelledText';
import { UnderlinedTabs, UnderlinedTab } from '../../../shared/components/layout/UnderlinedTabs';
import DatabaseDetailsInfoSchemas from './DatabaseDetailsInfoSchemas';
import { IDatabase, ISort } from '../../../shared/models';
import { parseSqlUri } from '../../../shared/utils/databases';
import {isFirstPage} from '../../notebooks/utils';
import { displayDetailsSkeleton } from '../../../shared/components/displayRowsSkeleton/displayRowsSkeleton';

type OnCloseCallback = () => void;
type OnToggleSortCallback = (sort: ISort) => void;
type OnLoadMoreSchemasForDatabaseCallback = () => void;

type DatabaseDetailsInfoProps = {
  database: IDatabase | null;
  databaseLoading: boolean;
  fromDrawer?: boolean;
  onCloseDrawer?: OnCloseCallback;
  onToggleSort: OnToggleSortCallback;
  loadMoreSchemasForDatabase: OnLoadMoreSchemasForDatabaseCallback;
  canLoadMore: boolean;
  currentPage: number;
  firstPage: number;
  infiniteScrollClassName: string;
};

type DatabaseDetailsProps = {
  database: IDatabase | null;
  fromDrawer?: boolean;
  onCloseDrawer: OnCloseCallback;
  onToggleSort: OnToggleSortCallback;
  canLoadMore: boolean;
  loadMoreSchemasForDatabase: OnLoadMoreSchemasForDatabaseCallback;
  databaseLoading: boolean;
  infiniteScrollClassName: string;
};

const displayDetails = ({
  database,
  fromDrawer,
  onCloseDrawer,
  onToggleSort,
  canLoadMore,
  loadMoreSchemasForDatabase,
  databaseLoading,
  infiniteScrollClassName
}: DatabaseDetailsProps) => {
  const details = parseSqlUri(database?.sqlalchemy_uri);
  return (
    <div className={`database-details ${fromDrawer ? 'no-border' : ''}`} data-cy='databaseDetailsInfo'>
      <div className={`database-details__props ${fromDrawer ? 'vertical-props' : ''}`}>
        <div className={`database-details__props__left ${fromDrawer ? 'full-width' : ''}`}>
          <LabelledText inline={true} label="Type" labelUppercase={true}>
            {database?.backend}
          </LabelledText>
          <LabelledText inline={true} label="Host" labelUppercase={true}>
            {details?.hostname}
          </LabelledText>
          <LabelledText inline={true} label="Port" labelUppercase={true}>
            {details?.port}
          </LabelledText>
          <LabelledText inline={true} label="Username" labelUppercase={true}>
            {details?.username}
          </LabelledText>
        </div>
        <div className={`database-details__props__right ${fromDrawer ? 'full-width' : ''}`}>
          <LabelledText inline={true} label="Created" labelUppercase={true}>
            {
              database?.created_on_utc ? (
                <TimeAgo date={database?.created_on_utc} />
              ) : (
                <div />
              )
            }
          </LabelledText>
          <LabelledText inline={true} label="Updated" labelUppercase={true}>
            {
              database?.changed_on_utc ? (
                <TimeAgo date={database?.changed_on_utc} />
              ) : (
                <div />
              )
            }
          </LabelledText>
          <LabelledText inline={true} label="Last used" labelUppercase={true}>
            {
              database?.last_use ? (
                <TimeAgo date={database?.last_use} />
              ) : (
                <div>No use</div>
              )
            }
          </LabelledText>
        </div>
      </div>
      <div className="database-details__tabs" data-cy='databaseSchemasList'>
        <UnderlinedTabs defaultActiveTab="schemasTab">
          <UnderlinedTab id="schemasTab" title="Schemas"
                         tag={database?.schemas ? database?.schemas.length.toString() : '0'}>
            <DatabaseDetailsInfoSchemas
              onLoadMore={loadMoreSchemasForDatabase}
              canLoadMore={canLoadMore}
              schemas={database?.schemas}
              onCloseDrawer={onCloseDrawer}
              onToggleSort={onToggleSort}
              databaseLoading={databaseLoading}
              infiniteScrollClassName={infiniteScrollClassName} />
          </UnderlinedTab>
        </UnderlinedTabs>
      </div>
    </div>
  );
}

const DatabaseDetailsInfoComponent: FunctionComponent<DatabaseDetailsInfoProps> = ({
  database, databaseLoading,
  fromDrawer,
  onCloseDrawer,
  onToggleSort,
  currentPage,
  firstPage,
  canLoadMore,
  loadMoreSchemasForDatabase,
  infiniteScrollClassName
}: DatabaseDetailsInfoProps) => {

  const handleCloseDrawer = () => {
    onCloseDrawer && onCloseDrawer();
  }
  return (databaseLoading || !database) && isFirstPage(currentPage, firstPage) ?
    displayDetailsSkeleton() :
    displayDetails({database,
      fromDrawer,
      onCloseDrawer: handleCloseDrawer,
      onToggleSort,
      canLoadMore,
      loadMoreSchemasForDatabase,
      databaseLoading,
      infiniteScrollClassName});
};

export default DatabaseDetailsInfoComponent;
