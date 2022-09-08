import React, {useEffect, FunctionComponent, useState, useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import {
  loadDatabases,
  loadDatabasesMetadata,
  removeDatabase,
} from '../../../shared/store/actions/databaseActions';
import { loadViews, saveView, removeView } from '../../../shared/store/actions/viewActions';
import { IState } from '../../../shared/store/reducers';
import { IView, ApiStatus, ISort, IFilter } from '../../../shared/models';
import DatabaseListComponent from './DatabaseList';
import {setupParamsFilters} from '../../../shared/utils/setupParamsFilters';

type DatabaseDetailsContainerParams = {
  viewId: string;
};

type DatabaseDetailsContainerParamsProps = RouteComponentProps<DatabaseDetailsContainerParams>;

const DatabaseListContainer: FunctionComponent<DatabaseDetailsContainerParamsProps> = ({
  match
}: DatabaseDetailsContainerParamsProps) => {

  const firstPage = useSelector((state: IState) => state.general.firstPage);
  const [page, setPage] = useState<number>(firstPage);
  const page_size = useSelector((state: IState) => state.general.pageSize);
  const canLoadMore = useSelector((state: IState) => state.databases.canLoadMoreDatabases);
  const viewId = parseInt(match.params.viewId);
  const databases = useSelector((state: IState) => state.databases.databases);
  const databasesParams = useSelector((state: IState) => state.databases.databasesParams);
  const databasesMetadata = useSelector((state: IState) => state.databases.databasesMetadata);
  const loadingDatabasesListStatus = useSelector((state: IState) => state.databases.loadingListStatus);
  const views = useSelector((state: IState) => state.views.views);
  const view = useSelector((state: IState) => state.views.view);
  const loadingViewsListStatus = useSelector((state: IState) => state.views.loadingListStatus);
  const savingViewStatus = useSelector((state: IState) => state.views.savingStatus);
  const removingViewStatus = useSelector((state: IState) => state.views.removingStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadDatabasesMetadata());
  }, []);

  useEffect(() => {
    setPage(firstPage);
    dispatch(loadDatabases({ viewId, page_size, page: firstPage, reload: true }));
    dispatch(loadViews('database'));
  }, [ dispatch, viewId ]);

  const onSaveView = (view: IView) => {
    dispatch(saveView(view.id, view));
  };

  const onRemoveView = (viewId: number) => {
    dispatch(removeView(viewId));
    if (databases.length <= page_size) {
      dispatch(loadDatabases({ filters: setupFilters(), page_size, page: firstPage, reload: true }));
    }
  };

  const onToggleSort = (sort: ISort) => {
    const filters = (databasesParams && databasesParams.filters) ?
    databasesParams.filters.map<IFilter>(filter => ({
        name: filter.col,
        label: filter.col,
        type: '',
        opr: filter.opr,
        value: filter.value,
        configured: false,
        fromView: false
      })) :
      undefined;
    dispatch(loadDatabases({ viewId,filters, sort, page_size, page: firstPage, reload: true  }));
  };

  const onRemoveDatabase = (databaseUid: string) => {
    dispatch(removeDatabase(databaseUid));
  };

  const setupFilters = useCallback((): IFilter[] => {
    return setupParamsFilters(databasesParams, databasesMetadata);
  }, [ databasesParams, databasesMetadata ]);

  const loadMoreDatabases= () => {
    dispatch(loadDatabases({filters:setupFilters(), page_size, page: page + 1, reload: false}));
    setPage(page + 1);
  }

  return (
    <DatabaseListComponent
      currentPage={page}
      firstPage={firstPage}
      onLoadMore={loadMoreDatabases}
      canLoadMore={canLoadMore}
      setPage={setPage}
      listParams={databasesParams}
      listMetadata={databasesMetadata}
      databases={databases}
      databasesLoading={loadingDatabasesListStatus === ApiStatus.LOADING}
      views={views}
      view={view}
      viewsLoading={loadingViewsListStatus === ApiStatus.LOADING}
      viewSaving={savingViewStatus === ApiStatus.LOADING}
      viewRemoving={removingViewStatus === ApiStatus.LOADING}
      onSaveView={onSaveView}
      onRemoveView={onRemoveView}
      onToggleSort={onToggleSort}
      onRemoveDatabase={onRemoveDatabase}
    ></DatabaseListComponent>
  );
};

export default withRouter(DatabaseListContainer);
