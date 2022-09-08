import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spinner } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import { ISchema, ISort } from '../../../shared/models';
import { List, ListHeaders, ListRow, ListColumn, SquareIndicator } from '../../../shared/components/list';
import { schemaColumns } from './constants';

import './DatabaseDetailsInfoSchemas.scss';

type OnCloseCallback = () => void;
type OnToggleSortCallback = (sort: ISort) => void;
type OnLoadMoreCallback = () => void;

type DatabaseDetailsInfoSchemasProps = {
  schemas?: ISchema[];
  onCloseDrawer: OnCloseCallback;
  onToggleSort?: OnToggleSortCallback;
  onLoadMore: OnLoadMoreCallback;
  canLoadMore: boolean;
  databaseLoading: boolean;
  infiniteScrollClassName: string;
};

const DatabaseDetailsInfoSchemasComponent: FunctionComponent<DatabaseDetailsInfoSchemasProps> = ({
  schemas, onCloseDrawer, onToggleSort, onLoadMore, canLoadMore, databaseLoading,  infiniteScrollClassName
}: DatabaseDetailsInfoSchemasProps) => {
  const history = useHistory();

  const onDisplaySchema = (table: ISchema) => {
    onCloseDrawer();
    history.push(`/d/s/${table.id}`);
  }

  const handleToggleSort = (sort: ISort) => {
    onToggleSort && onToggleSort(sort);
  };

  return (
    <List>
      <ListHeaders
        headers={schemaColumns}
        smallPaddings={true}
        onToggleSort={handleToggleSort}
      />
      <div className={infiniteScrollClassName} id='database-schemas-infinite-scroll'>
        <InfiniteScroll
          dataLength={schemas?schemas.length:0}
          next={onLoadMore}
          hasMore={!databaseLoading && canLoadMore}
          loader={<Spinner size={50} className='load-more-spinner'/>}
          scrollableTarget="database-schemas-infinite-scroll"
        >
          {
            schemas && schemas.map(schema => (
              <ListRow key={schema.id} smallPaddings={true}>
                <ListColumn properties={schemaColumns.name} main={true}>
                  <SquareIndicator icon={IconNames.HEAT_GRID}></SquareIndicator>
                  <div
                    className="schema-details-tables__table-name"
                    onClick={() => onDisplaySchema(schema)}
                  >{schema.name}</div>
                </ListColumn>
                <ListColumn properties={schemaColumns.changed_on}>
                  {schema.changed_on && <TimeAgo date={schema.changed_on}/>}
                </ListColumn>
              </ListRow>
            ))
          }
        </InfiniteScroll>
      </div>
    </List>
  );
};

export default DatabaseDetailsInfoSchemasComponent;
