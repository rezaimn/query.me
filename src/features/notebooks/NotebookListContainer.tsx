import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { defaultNotebookName } from './utils';
import {
  createNotebook,
  duplicateNotebook,
  loadNotebooks,
  loadNotebooksMetadata,
  removeNotebook,
} from '../../shared/store/actions/notebookActions';
import { loadViews, removeView, saveView } from '../../shared/store/actions/viewActions';
import { IState } from '../../shared/store/reducers';
import { ApiStatus, IFilter, ISort, IView } from '../../shared/models';
import NotebookListComponent from './NotebookList';
import { setupParamsFilters } from '../../shared/utils/setupParamsFilters';
import { GetNotebooksType } from './constants';

type NotebookListContainerParams = {
  viewId: string;
};

interface INotebookListContainerProps {
  type?: GetNotebooksType;
  pageTitle?: string;
}

type NotebookListContainerParamsProps = RouteComponentProps<NotebookListContainerParams> & INotebookListContainerProps;

const NotebookListContainer: FunctionComponent<NotebookListContainerParamsProps> = ({
  match,
  pageTitle = '',
  type
}: NotebookListContainerParamsProps) => {

  const firstPage = useSelector((state: IState) => state.general.firstPage);
  const [page, setPage] = useState<number>(firstPage);
  const page_size = useSelector((state: IState) => state.general.pageSize);
  const canLoadMore = useSelector((state: IState) => state.notebooks.canLoadMoreNotebooks);
  const viewId = parseInt(match.params.viewId);
  const notebooks = useSelector((state: IState) => state.notebooks.notebooks);
  const notebooksParams = useSelector((state: IState) => state.notebooks.notebooksParams);
  const notebooksMetadata = useSelector((state: IState) => state.notebooks.notebooksMetadata);
  const loadingNotebooksListStatus = useSelector((state: IState) => state.notebooks.loadingListStatus);
  const views = useSelector((state: IState) => state.views.views);
  const view = useSelector((state: IState) => state.views.view);
  const loadingViewsListStatus = useSelector((state: IState) => state.views.loadingListStatus);
  const savingViewStatus = useSelector((state: IState) => state.views.savingStatus);
  const removingViewStatus = useSelector((state: IState) => state.views.removingStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadNotebooksMetadata());
  }, [ ]);

  useEffect(() => {
    setPage(firstPage);
    dispatch(loadNotebooks({viewId,page_size, page: firstPage, reload: true, type}));
    dispatch(loadViews('notebook'));
  }, [dispatch, viewId]);

  useEffect(() => {
    setPage(firstPage);
    dispatch(loadNotebooks({viewId,page_size, page: firstPage, reload: true, type}));

  }, [dispatch, type]);


  const onSaveView = (view: IView) => {
    dispatch(saveView(view.id, view));
  };

  const onRemoveView = (viewId: number) => {
    dispatch(removeView(viewId));
  };

  const onAddNotebook = () => {
    dispatch(createNotebook({name: defaultNotebookName()}));
  };

  const onRemoveNotebook = (notebookId: string) => {
    dispatch(removeNotebook(notebookId));
    if (notebooks.length <= page_size) {
      dispatch(loadNotebooks({ filters: setupFilters(), page_size, page: firstPage, reload: true, type}));
    }
  };

  const onDuplicateNotebook = (notebookUid: string) => {
    dispatch(duplicateNotebook(notebookUid));
  }

  const onToggleSort = (sort: ISort) => {
    const filters = (notebooksParams && notebooksParams.filters) ?
      notebooksParams.filters.map<IFilter>(filter => ({
        name: filter.col,
        label: filter.col,
        type: '',
        opr: filter.opr,
        value: filter.value,
        configured: false,
        fromView: false
      })) :
      undefined;
    dispatch(loadNotebooks({viewId, filters, sort,  page_size, page: firstPage, reload: true, type}));
  };

  const setupFilters = useCallback((): IFilter[] => {
    return setupParamsFilters(notebooksParams, notebooksMetadata);
  }, [notebooksParams, notebooksMetadata]);

  const loadMoreNotebooks = () => {
    dispatch(loadNotebooks({filters: setupFilters(), page_size, page: page + 1, reload: false, type}));
    setPage(page + 1);
  }

  return (
    <NotebookListComponent
      setPage={setPage}
      firstPage={firstPage}
      canLoadMore={canLoadMore}
      onLoadMore={loadMoreNotebooks}
      listParams={notebooksParams}
      listMetadata={notebooksMetadata}
      notebooks={notebooks}
      notebooksLoading={loadingNotebooksListStatus === ApiStatus.LOADING}
      views={views}
      view={view}
      viewsLoading={loadingViewsListStatus === ApiStatus.LOADING}
      viewSaving={savingViewStatus === ApiStatus.LOADING}
      viewRemoving={removingViewStatus === ApiStatus.LOADING}
      onSaveView={onSaveView}
      onRemoveView={onRemoveView}
      onAddNotebook={onAddNotebook}
      onRemoveNotebook={onRemoveNotebook}
      onDuplicateNotebook={onDuplicateNotebook}
      onToggleSort={onToggleSort}
      currentPage={page}
      pageTitle={pageTitle}
      disableViews={type !== GetNotebooksType.ALL}
      disableFilter={type === GetNotebooksType.RECENT}
    ></NotebookListComponent>
  );

};

export default withRouter(NotebookListContainer);
