import React, { FunctionComponent } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Colors, Spinner } from '@blueprintjs/core';

import { ITableColumn, ISort } from '../../../shared/models';
import { List, ListHeaders, ListRow, ListColumn, SquareIndicator } from '../../../shared/components/list';
import { columnIcon } from './utils';
import { tableColumnDetails } from './constants';

import './TableDetailsInfoColumns.scss';

type OnToggleSortCallback = (sort: ISort) => void;
type OnLoadMoreCallback = () => void;

type TableDetailsInfoColumnsProps = {
  columns?: ITableColumn[];
  onToggleSort?: OnToggleSortCallback;
  onLoadMore: OnLoadMoreCallback;
  canLoadMore: boolean;
  tableLoading: boolean;
  infiniteScrollClassName: string;
};

const TableDetailsInfoColumnsComponent: FunctionComponent<TableDetailsInfoColumnsProps> = ({
  columns, onToggleSort, onLoadMore, canLoadMore, tableLoading, infiniteScrollClassName,
}: TableDetailsInfoColumnsProps) => {

  const handleToggleSort = (sort: ISort) => {
    onToggleSort && onToggleSort(sort);
  };

  return (
    <List>
      <ListHeaders
        headers={tableColumnDetails}
        onToggleSort={handleToggleSort}
      />
      <div className={infiniteScrollClassName} id='table-columns-infinite-scroll'>
        <InfiniteScroll
          dataLength={columns ? columns.length : 0}
          next={onLoadMore}
          hasMore={!tableLoading && canLoadMore}
          loader={<Spinner size={50} className='load-more-spinner'/>}
          scrollableTarget="table-columns-infinite-scroll"
        >
          {
            columns && columns.map(column => (
              <ListRow key={column.name} smallPaddings={true}>
                <ListColumn properties={tableColumnDetails.name} main={true}>
                  <SquareIndicator icon={columnIcon({ column, color: '#fff', viewBox: '6 -2 14 30' })}
                                   color={Colors.GRAY1}/>
                  <div>{column.name}</div>
                </ListColumn>
                <ListColumn properties={tableColumnDetails.data_type}>
                  {column.data_type}
                </ListColumn>
              </ListRow>
            ))
          }
        </InfiniteScroll>
      </div>
    </List>
  );
};

export default TableDetailsInfoColumnsComponent;
