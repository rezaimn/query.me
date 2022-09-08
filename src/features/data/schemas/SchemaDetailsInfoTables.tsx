import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import InfiniteScroll from 'react-infinite-scroll-component';
import {Spinner} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import { ITable, ISort } from '../../../shared/models';
import { List, ListHeaders, ListRow, ListColumn, SquareIndicator } from '../../../shared/components/list';
import { thViewIcon } from '../../../shared/utils/custom-icons';
import { tableColumns } from './constants';

import './SchemaDetailsInfoTables.scss';

type OnCloseCallback = () => void;
type OnToggleSortCallback = (sort: ISort) => void;
type OnLoadMoreCallback = () => void;

type SchemaDetailsInfoTablesProps = {
  tables?: ITable[];
  onCloseDrawer: OnCloseCallback;
  onToggleSort?: OnToggleSortCallback;
  onLoadMore: OnLoadMoreCallback;
  canLoadMore: boolean;
  schemaLoading: boolean;
  infiniteScrollClassName: string;
};

const SchemaDetailsInfoTablesComponent: FunctionComponent<SchemaDetailsInfoTablesProps> = ({
  tables, onCloseDrawer, onToggleSort, onLoadMore, canLoadMore, schemaLoading, infiniteScrollClassName
}: SchemaDetailsInfoTablesProps) => {
  const history = useHistory();

  const onDisplayTable = (table: ITable) => {
    onCloseDrawer();
    history.push(`/d/t/${table.id}`);
  }

  const handleToggleSort = (sort: ISort) => {
    onToggleSort && onToggleSort(sort);
  };

  return (
    <List>
      <ListHeaders
        headers={tableColumns}
        smallPaddings={true}
        onToggleSort={handleToggleSort}
      />
      <div className={infiniteScrollClassName} id='schema-tables-infinite-scroll'>
        <InfiniteScroll
          dataLength={tables ? tables.length : 0}
          next={onLoadMore}
          hasMore={!schemaLoading && canLoadMore}
          loader={<Spinner size={50} className='load-more-spinner'/>}
          scrollableTarget="schema-tables-infinite-scroll"
        >
          {
            tables && tables.map(table => (
              <ListRow key={table.id} smallPaddings={true}>
                <ListColumn properties={tableColumns.name} main={true}>
                  <SquareIndicator icon={table.type === 'table' ? IconNames.TH : thViewIcon({
                    fill: '#fff',
                    height: 24,
                    width: 24,
                    viewBoxDefault: '8 -3 8 30',
                  })} />
                  <div
                    className="schema-details-tables__table-name"
                    onClick={() => onDisplayTable(table)}
                  >{table.name}</div>
                </ListColumn>
                <ListColumn properties={tableColumns.changed_on}>
                  {table.changed_on && <TimeAgo date={table.changed_on}/>}
                </ListColumn>
              </ListRow>
            ))
          }
        </InfiniteScroll>
      </div>
    </List>
  );
};

export default SchemaDetailsInfoTablesComponent;
