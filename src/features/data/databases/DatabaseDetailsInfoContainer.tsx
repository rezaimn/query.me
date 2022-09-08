import React, {useEffect, FunctionComponent, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  loadDatabase,
  sortSchemasInDatabase,
} from '../../../shared/store/actions/databaseActions';
import { IState } from '../../../shared/store/reducers';
import { ApiStatus, ISort } from '../../../shared/models';
import DatabaseDetailsInfoComponent from './DatabaseDetailsInfo';

type OnCloseCallback = () => void;

type DatabaseDetailsInfoContainerProps = {
  databaseUid: string;
  onCloseDrawer: OnCloseCallback;
};

const DatabaseDetailsContainer: FunctionComponent<DatabaseDetailsInfoContainerProps> = ({
  databaseUid, onCloseDrawer
}: DatabaseDetailsInfoContainerProps) => {
  const firstPage:number = useSelector((state: IState) => state.general.firstPage);
  const [page, setPage] = useState<number>(firstPage);
  const page_size = useSelector((state: IState) => state.general.pageSize);
  const database = useSelector((state: IState) => state.databases.database);
  const loadingStatus = useSelector((state: IState) => state.databases.loadingStatus);
  const dispatch = useDispatch();
  const canLoadMore = useSelector((state: IState) => state.databases.canLoadMoreSchemasForDatabase);

  useEffect(() => {
    dispatch(loadDatabase(databaseUid, page, page_size, true, true));
  }, [ dispatch, databaseUid ]);

  const onToggleSort = (sort: ISort) => {
    dispatch(sortSchemasInDatabase(databaseUid, sort));
  };

  const loadMoreSchemasForDatabase= () => {
    dispatch(loadDatabase(databaseUid, page + 1, page_size, false, true));
    setPage(page + 1);
  }

  return (
    <DatabaseDetailsInfoComponent
      infiniteScrollClassName='infinite-scroll-base-database-detail-info'
      canLoadMore={canLoadMore}
      currentPage={page}
      firstPage={firstPage}
      database={database}
      databaseLoading={loadingStatus === ApiStatus.LOADING}
      fromDrawer={true}
      onCloseDrawer={onCloseDrawer}
      onToggleSort={onToggleSort}
      loadMoreSchemasForDatabase={loadMoreSchemasForDatabase} />
  );
};

export default DatabaseDetailsContainer;
