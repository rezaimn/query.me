import React, {useEffect, FunctionComponent, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { loadDatabase, sortSchemasInDatabase } from '../../../shared/store/actions/databaseActions';
import { loadViews, saveView, removeView } from '../../../shared/store/actions/viewActions';
import { IState } from '../../../shared/store/reducers';
import { IView, ApiStatus, ISort } from '../../../shared/models';
import DatabaseDetailsComponent from './DatabaseDetails';

type DatabaseDetailsContainerParams = {
  databaseId: string;
};

type DatabaseDetailsContainerProps = RouteComponentProps<DatabaseDetailsContainerParams>;

const DatabaseDetailsContainer: FunctionComponent<DatabaseDetailsContainerProps> = ({
  match
}: DatabaseDetailsContainerProps) => {
  const databaseId = match.params.databaseId;
  const firstPage = useSelector((state: IState) => state.general.firstPage);
  const [page, setPage] = useState<number>(firstPage);
  const canLoadMore = useSelector((state: IState) => state.databases.canLoadMoreSchemasForDatabase);
  const page_size = useSelector((state: IState) => state.general.pageSize);
  const database = useSelector((state: IState) => state.databases.database);
  const loadingStatus = useSelector((state: IState) => state.databases.loadingStatus);
  const views = useSelector((state: IState) => state.views.views);
  const loadingViewsListStatus = useSelector((state: IState) => state.views.loadingListStatus);
  const savingViewStatus = useSelector((state: IState) => state.views.savingStatus);
  const removingViewStatus = useSelector((state: IState) => state.views.removingStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadDatabase(databaseId, page, page_size, true ,true));
    dispatch(loadViews('database'));
  }, [ dispatch, databaseId ]);

  const onSaveView = (view: IView) => {
    dispatch(saveView(view.id, view));
  };

  const onRemoveView = (viewId: number) => {
    dispatch(removeView(viewId));
  };

  const onToggleSort = (sort: ISort) => {
    dispatch(sortSchemasInDatabase(databaseId, sort));
  };
  const loadMoreSchemasForDatabase= () => {
    dispatch(loadDatabase(databaseId, page + 1, page_size, false, true));
    setPage(page + 1);
  }

  return (
    <DatabaseDetailsComponent
      loadMoreSchemasForDatabase={loadMoreSchemasForDatabase}
      firstPage={firstPage}
      canLoadMore={canLoadMore}
      currentPage={page}
      database={database}
      databaseLoading={loadingStatus === ApiStatus.LOADING}
      views={views}
      viewsLoading={loadingViewsListStatus === ApiStatus.LOADING}
      viewSaving={savingViewStatus === ApiStatus.LOADING}
      viewRemoving={removingViewStatus === ApiStatus.LOADING}
      onSaveView={onSaveView}
      onRemoveView={onRemoveView}
      onToggleSort={onToggleSort}
    />
  );
};

export default withRouter(DatabaseDetailsContainer);
