import React, {useEffect, FunctionComponent, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { loadSchema, sortTablesInSchema } from '../../../shared/store/actions/schemaActions';
import { loadViews, saveView, removeView } from '../../../shared/store/actions/viewActions';
import { IState } from '../../../shared/store/reducers';
import { IView, ApiStatus, ISort } from '../../../shared/models';
import SchemaDetailsComponent from './SchemaDetails';
import {loadDatabase} from '../../../shared/store/actions/databaseActions';

type SchemaDetailsContainerParams = {
  schemaId: string;
};

type SchemaDetailsContainerProps = RouteComponentProps<SchemaDetailsContainerParams>;

const SchemaDetailsContainer: FunctionComponent<SchemaDetailsContainerProps> = ({
  match
}: SchemaDetailsContainerProps) => {
  const schemaId = match.params.schemaId;
  const firstPage = useSelector((state: IState) => state.general.firstPage);
  const [page, setPage] = useState<number>(firstPage);
  const page_size = useSelector((state: IState) => state.general.pageSize);
  const canLoadMore = useSelector((state: IState) => state.schemas.canLoadMoreTablesForSchema);
  const schema = useSelector((state: IState) => state.schemas.schema);
  const loadingStatus = useSelector((state: IState) => state.schemas.loadingStatus);
  const views = useSelector((state: IState) => state.views.views);
  const loadingViewsListStatus = useSelector((state: IState) => state.views.loadingListStatus);
  const savingViewStatus = useSelector((state: IState) => state.views.savingStatus);
  const removingViewStatus = useSelector((state: IState) => state.views.removingStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadSchema(schemaId, page, page_size, true ,true));
    dispatch(loadViews('schema'));
  }, [ dispatch, schemaId ]);

  const onSaveView = (view: IView) => {
    dispatch(saveView(view.id, view));
  };

  const onRemoveView = (viewId: number) => {
    dispatch(removeView(viewId));
  };

  const onToggleSort = (sort: ISort) => {
    dispatch(sortTablesInSchema(schemaId, sort));
  };
  const loadMoreTablesForSchema= () => {
    dispatch(loadSchema(schemaId, page + 1, page_size, false, true));
    setPage(page + 1);
  }
  return (
    <SchemaDetailsComponent
      loadMoreTablesForSchema={loadMoreTablesForSchema}
      firstPage={firstPage}
      canLoadMore={canLoadMore}
      currentPage={page}
      schema={schema}
      schemaLoading={loadingStatus === ApiStatus.LOADING}
      views={views}
      viewsLoading={loadingViewsListStatus === ApiStatus.LOADING}
      viewSaving={savingViewStatus === ApiStatus.LOADING}
      viewRemoving={removingViewStatus === ApiStatus.LOADING}
      onSaveView={onSaveView}
      onRemoveView={onRemoveView}
      onToggleSort={onToggleSort}
    ></SchemaDetailsComponent>
  );
};

export default withRouter(SchemaDetailsContainer);
