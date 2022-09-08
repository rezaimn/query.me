import React, {useEffect, FunctionComponent, useState, useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import {
  loadSchemas,
  loadSchemasMetadata,
} from '../../../shared/store/actions/schemaActions';
import { loadViews, saveView, removeView } from '../../../shared/store/actions/viewActions';
import { IState } from '../../../shared/store/reducers';
import {IView, ApiStatus, IFilter} from '../../../shared/models';
import SchemaListComponent from './SchemaList';
import {setupParamsFilters} from '../../../shared/utils/setupParamsFilters';

type SchemaDetailsContainerParams = {
  viewId: string;
};

type SchemaDetailsContainerParamsProps = RouteComponentProps<SchemaDetailsContainerParams>;

const SchemaListContainer: FunctionComponent<SchemaDetailsContainerParamsProps> = ({
  match
}: SchemaDetailsContainerParamsProps) => {
  const firstPage = useSelector((state: IState) => state.general.firstPage);
  const [page, setPage] = useState<number>(firstPage);
  const page_size = useSelector((state: IState) => state.general.pageSize);
  const canLoadMore = useSelector((state: IState) => state.schemas.canLoadMoreSchemas);
  const schemasParams = useSelector((state: IState) => state.schemas.schemasParams);
  const schemasMetadata = useSelector((state: IState) => state.schemas.schemasMetadata);
  const viewId = parseInt(match.params.viewId);
  const schemas = useSelector((state: IState) => state.schemas.schemas);
  const loadingSchemasListStatus = useSelector((state: IState) => state.schemas.loadingListStatus);
  const views = useSelector((state: IState) => state.views.views);
  const view = useSelector((state: IState) => state.views.view);
  const loadingViewsListStatus = useSelector((state: IState) => state.views.loadingListStatus);
  const savingViewStatus = useSelector((state: IState) => state.views.savingStatus);
  const removingViewStatus = useSelector((state: IState) => state.views.removingStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadSchemasMetadata());
  }, [ ]);

  useEffect(() => {
    setPage(firstPage);
    dispatch(loadSchemas({ viewId, page_size, page: firstPage, reload: true  }));
    dispatch(loadViews('schema'));
  }, [ dispatch, viewId ]);

  const onSaveView = (view: IView) => {
    dispatch(saveView(view.id, view));
  };

  const onRemoveView = (viewId: number) => {
    dispatch(removeView(viewId));
    if (schemas.length <= page_size) {
      dispatch(loadSchemas({ filters: setupFilters(), page_size, page: firstPage, reload: true }));
    }
  };

  const setupFilters = useCallback((): IFilter[] => {
    return setupParamsFilters(schemasParams, schemasMetadata);
  }, [schemasParams, schemasMetadata]);

  const loadMoreSchemas= () => {
    dispatch(loadSchemas({filters:setupFilters(), page_size, page: page + 1, reload: false}));
    setPage(page + 1);
  }
  return (
    <SchemaListComponent
      currentPage={page}
      firstPage={firstPage}
      onLoadMore={loadMoreSchemas}
      canLoadMore={canLoadMore}
      setPage={setPage}
      listParams={schemasParams}
      listMetadata={schemasMetadata}
      schemas={schemas}
      schemasLoading={loadingSchemasListStatus === ApiStatus.LOADING}
      views={views}
      view={view}
      viewsLoading={loadingViewsListStatus === ApiStatus.LOADING}
      viewSaving={savingViewStatus === ApiStatus.LOADING}
      viewRemoving={removingViewStatus === ApiStatus.LOADING}
      onSaveView={onSaveView}
      onRemoveView={onRemoveView}
    ></SchemaListComponent>
  );
};

export default  withRouter(SchemaListContainer);
