import React, {useEffect, FunctionComponent, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { loadTable, sortColumnsInTable } from '../../../shared/store/actions/tableActions';
import { loadViews, saveView, removeView } from '../../../shared/store/actions/viewActions';
import { IState } from '../../../shared/store/reducers';
import { IView, ApiStatus, ISort } from '../../../shared/models';
import TableDetailsComponent from './TableDetails';

type TableDetailsContainerParams = {
  tableId: string;
};

type TableDetailsContainerProps = RouteComponentProps<TableDetailsContainerParams>;

const TableDetailsContainer: FunctionComponent<TableDetailsContainerProps> = ({
  match
}: TableDetailsContainerProps) => {
  const tableId = match.params.tableId;
  const firstPage = useSelector((state: IState) => state.general.firstPage);
  const [page, setPage] = useState<number>(firstPage);
  const page_size = useSelector((state: IState) => state.general.pageSize);
  const canLoadMore = useSelector((state: IState) => state.tables.canLoadMoreColumnsForTable);
  const table = useSelector((state: IState) => state.tables.table);
  const loadingStatus = useSelector((state: IState) => state.tables.loadingStatus);
  const views = useSelector((state: IState) => state.views.views);
  const loadingViewsListStatus = useSelector((state: IState) => state.views.loadingListStatus);
  const savingViewStatus = useSelector((state: IState) => state.views.savingStatus);
  const removingViewStatus = useSelector((state: IState) => state.views.removingStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadTable(tableId, page, page_size, true ,true));
    dispatch(loadViews('schema'));
  }, [ dispatch, tableId ]);

  const onSaveView = (view: IView) => {
    dispatch(saveView(view.id, view));
  };

  const onRemoveView = (viewId: number) => {
    dispatch(removeView(viewId));
  };

  const onToggleSort = (sort: ISort) => {
    dispatch(sortColumnsInTable(tableId, sort));
  };

  const loadMoreColumnsForTable = () => {
    dispatch(loadTable(tableId, page + 1, page_size, false, true));
    setPage(page + 1);
  }

  return (
    <TableDetailsComponent
      loadMoreColumnsForTable={loadMoreColumnsForTable}
      firstPage={firstPage}
      canLoadMore={canLoadMore}
      currentPage={page}
      table={table}
      tableLoading={loadingStatus === ApiStatus.LOADING}
      views={views}
      viewsLoading={loadingViewsListStatus === ApiStatus.LOADING}
      viewSaving={savingViewStatus === ApiStatus.LOADING}
      viewRemoving={removingViewStatus === ApiStatus.LOADING}
      onSaveView={onSaveView}
      onRemoveView={onRemoveView}
      onToggleSort={onToggleSort}
      ></TableDetailsComponent>
  );
};

export default withRouter(TableDetailsContainer);
