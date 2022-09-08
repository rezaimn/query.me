import React, {useEffect, FunctionComponent, useState, useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import {
  loadTables,
  loadTablesMetadata,
} from '../../../shared/store/actions/tableActions';
import { loadViews, saveView, removeView } from '../../../shared/store/actions/viewActions';
import { IState } from '../../../shared/store/reducers';
import {IView, ApiStatus, IFilter, IQueryColumn} from '../../../shared/models';
import TableListComponent from './TableList';
import {setupParamsFilters} from '../../../shared/utils/setupParamsFilters';

type TableDetailsContainerParams = {
  viewId: string;
};

type TableDetailsContainerParamsProps = RouteComponentProps<TableDetailsContainerParams>;

const TableListContainer: FunctionComponent<TableDetailsContainerParamsProps> = ({
  match
}: TableDetailsContainerParamsProps) => {
  const firstPage = useSelector((state: IState) => state.general.firstPage);
  const [page, setPage] = useState<number>(firstPage);
  const page_size = useSelector((state: IState) => state.general.pageSize);
  const canLoadMore = useSelector((state: IState) => state.tables.canLoadMoreTables);
  const viewId = parseInt(match.params.viewId);
  const tablesParams = useSelector((state: IState) => state.tables.tablesParams);
  const tablesMetadata = useSelector((state: IState) => state.tables.tablesMetadata);
  const tables = useSelector((state: IState) => state.tables.tables);
  const loadingTablesListStatus = useSelector((state: IState) => state.tables.loadingListStatus);
  const views = useSelector((state: IState) => state.views.views);
  const view = useSelector((state: IState) => state.views.view);
  const loadingViewsListStatus = useSelector((state: IState) => state.views.loadingListStatus);
  const savingViewStatus = useSelector((state: IState) => state.views.savingStatus);
  const removingViewStatus = useSelector((state: IState) => state.views.removingStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadTablesMetadata());
  }, [ ]);

  useEffect(() => {
    setPage(firstPage);
    dispatch(loadTables({ viewId, page_size, page: firstPage, reload: true }));
    dispatch(loadViews('table'));
  }, [ dispatch, viewId ]);

  const onSaveView = (view: IView) => {
    dispatch(saveView(view.id, view));
  };

  const onRemoveView = (viewId: number) => {
    dispatch(removeView(viewId));
    if (tables.length <= page_size) {
      dispatch(loadTables({ filters: setupFilters(), page_size, page: firstPage, reload: true }));
    }
  };

  const setupFilters = useCallback((): IFilter[] => {
    return setupParamsFilters(tablesParams, tablesMetadata);
  }, [tablesParams, tablesMetadata]);

  const loadMoreTables= () => {
    dispatch(loadTables({filters: setupFilters(), page_size, page: page + 1, reload: false}));
    setPage(page + 1);
  }
  return (
    <TableListComponent
      currentPage={page}
      firstPage={firstPage}
      onLoadMore={loadMoreTables}
      canLoadMore={canLoadMore}
      setPage={setPage}
      listParams={tablesParams}
      listMetadata={tablesMetadata}
      tables={tables}
      tablesLoading={loadingTablesListStatus === ApiStatus.LOADING}
      views={views}
      view={view}
      viewsLoading={loadingViewsListStatus === ApiStatus.LOADING}
      viewSaving={savingViewStatus === ApiStatus.LOADING}
      viewRemoving={removingViewStatus === ApiStatus.LOADING}
      onSaveView={onSaveView}
      onRemoveView={onRemoveView}
    ></TableListComponent>
  );
};

export default  withRouter(TableListContainer);
