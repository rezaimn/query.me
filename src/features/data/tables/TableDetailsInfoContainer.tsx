import React, {useEffect, FunctionComponent, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadTable, sortColumnsInTable } from '../../../shared/store/actions/tableActions';
import { IState } from '../../../shared/store/reducers';
import { ApiStatus, ISort } from '../../../shared/models';
import TableDetailsInfoComponent from './TableDetailsInfo';

type TableDetailsInfoContainerProps = {
  tableId: string;
};

const TableDetailsContainer: FunctionComponent<TableDetailsInfoContainerProps> = ({
  tableId
}: TableDetailsInfoContainerProps) => {
  const table = useSelector((state: IState) => state.tables.table);
  const loadingStatus = useSelector((state: IState) => state.tables.loadingStatus);
  const dispatch = useDispatch();
  const firstPage:number = useSelector((state: IState) => state.general.firstPage);
  const [page, setPage] = useState<number>(firstPage);
  const page_size = useSelector((state: IState) => state.general.pageSize);
  const canLoadMore = useSelector((state: IState) => state.tables.canLoadMoreColumnsForTable);

  useEffect(() => {
    dispatch(loadTable(tableId, page, page_size, true ,true));
  }, [ dispatch, tableId ]);

  const onToggleSort = (sort: ISort) => {
    dispatch(sortColumnsInTable(tableId, sort));
  };

  const loadMoreColumnsForTable= () => {
    dispatch(loadTable(tableId, page + 1, page_size, false, true));
    setPage(page + 1);
  }

  return (
    <TableDetailsInfoComponent
      infiniteScrollClassName='infinite-scroll-base-table-detail-info'
      canLoadMore={canLoadMore}
      currentPage={page}
      firstPage={firstPage}
      loadMoreColumnsForTable={loadMoreColumnsForTable}
      table={table}
      tableLoading={loadingStatus === ApiStatus.LOADING}
      fromDrawer={true}
      onToggleSort={onToggleSort}
  ></TableDetailsInfoComponent>
  );
};

export default TableDetailsContainer;
