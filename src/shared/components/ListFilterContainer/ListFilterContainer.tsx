import React, {useState, useMemo, Fragment, useEffect, FunctionComponent} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Dialog} from '@blueprintjs/core';

import './ListFilterContainer.scss'
import { ApiStatus, IFilter, IListColumn, IParams, ISharedListMetadata, ISort } from '../../models';
import {ListFilters} from '../../../shared/components/list';
import {IState} from '../../store/reducers';
import {setupParamsFilters} from '../../utils/setupParamsFilters';
import {createView, saveView} from '../../store/actions/viewActions';
import ViewDialogComponent from '../dialogs/ViewDialog';
import SaveViewDialogComponent from '../dialogs/SaveViewDialog';
import { loadUsers } from '../../store/actions/userActions';
import { loadTags } from '../../store/actions/tagActions';

type SetPageCallback = (value: number) => void;
type LoadListData = ({viewId, filters, sort, page_size, page, reload}:
{
  viewId?: number;
  filters?: IFilter[];
  sort?: ISort;
  reload?: boolean;
  page_size?: number;
  page?: number;
}) => any

type TableFilterContainerParams = {
  setPage: SetPageCallback;
  listParams: IParams | undefined;
  listMetadata: ISharedListMetadata | null;
  loadListData: LoadListData;
  view_type: string;
  disableViews?: boolean;
  disableFilter?: boolean;
  columnsList: { [id: string]: IListColumn };
};

const ListFiltersContainer: FunctionComponent<TableFilterContainerParams> = ({
  setPage,
  listParams,
  listMetadata,
  loadListData,
  view_type,
  columnsList,
  disableViews = false,
  disableFilter = false,
}: TableFilterContainerParams) => {

  const dispatch = useDispatch();
  const [disableSaveViewBtn, setDisableSaveViewBtn] = useState<boolean>(false);
  const [addDialogOpened, setAddDialogOpened] = useState<boolean>(false);
  const [saveDialogOpened, setSaveDialogOpened] = useState<boolean>(false);
  const [currentViewId, setCurrentViewId] = useState<number | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<IFilter[]>([]);
  const firstPage = useSelector((state: IState) => state.general.firstPage);
  const page_size = useSelector((state: IState) => state.general.pageSize);
  const creatingStatus = useSelector((state: IState) => state.views.creatingStatus);
  const savingStatus = useSelector((state: IState) => state.views.savingStatus);
  const view = useSelector((state: IState) => state.views.view);
  let viewId = view ? view.id : null;

  useEffect(() => {
    viewId && viewId >= 0 ? setDisableSaveViewBtn(true) : setDisableSaveViewBtn(false);
  }, [viewId]);

  useEffect(() => {
    dispatch(loadUsers({ page_size: -1, page: firstPage, reload: true }));
    dispatch(loadTags());
  }, []);
  // Reinitialize in-progress filters when changing to new view or no view
  if (viewId !== currentViewId) {
    setSelectedFilters([]);
    setCurrentViewId(viewId);
  }

  // Correspond to the filters actually used to filter the list
  const allFilters = useMemo(() => {
    if (listMetadata && listMetadata.filters) {
      const fields: any = Object.keys(columnsList).filter((key: string) => columnsList[key].filterable);
      return Object
        .keys(listMetadata.filters)
        .reduce((acc: IFilter[], fieldName: string) => {
          const field = fields.find((f: any) => f === fieldName);
          if (field) {
            acc.push({
              name: columnsList[field].id,
              label: columnsList[field].label,
              type: columnsList[field].type || '',
              configured: false,
              fromView: true,
              options: listMetadata.filters[fieldName].map(filter => {
                filter.fillValue = true;
                return filter;
              }),
            });
          }
          return acc;
        }, [] as IFilter[]);
    }
    return [];
  }, [listMetadata]);

  // Current filters correspond to filters used for the request
  // To update them, we need to dispatch "loadQueries" with updated
  // filters. They can be updated if new filter is applied, existing
  // filter updated or removed.
  useEffect(() => {
    const currentFilters = setupParamsFilters(listParams, allFilters);
    setSelectedFilters(currentFilters);
  }, [listParams, listMetadata]);

  const onTriggerSaveView = (filters: IFilter[]) => {
    if (view) {
      setSaveDialogOpened(true);
    } else {
      setAddDialogOpened(true);
    }
  };

  const onAddView = ({name}: { name: string }) => {
    setDisableSaveViewBtn(true);
    dispatch(createView({
      name,
      icon: 'bookmark',
      view_type: view_type,
      url: window.location.href,
      // Be careful to use the attribute col and not name
      params: JSON.stringify({
        filters: selectedFilters.map(filter => ({
          col: filter.name, opr: filter.opr, value: filter.value
        }))
      })
    }));
  };

  const onSaveView = () => {
    if (view) {
      setDisableSaveViewBtn(true);
      dispatch(saveView(view.id, {
        ...view,
        params: JSON.stringify({
          filters: selectedFilters.map(filter => ({
            col: filter.name, opr: filter.opr, value: filter.value
          }))
        })
      }));
    }
  };

  const onAddFilter = (filter: IFilter) => {
    setDisableSaveViewBtn(false);
    setPage(firstPage);
    const updatedFilters = selectedFilters.concat({
      ...filter,
      fromView: false
    });
    dispatch(loadListData({
      viewId: view ? view.id : undefined,
      filters: updatedFilters,
      reload: true,
      page: firstPage,
      page_size
    }));
  }

  const onUpdateFilter = (filter: IFilter, index: number) => {
    setDisableSaveViewBtn(false);
    setPage(firstPage);
    const updatedFilters = selectedFilters.map((f, filterIndex) => {
      return (filterIndex === index) ?
        filter : f;
    });
    setSelectedFilters(updatedFilters);
    dispatch(loadListData({
      viewId: view ? view.id : undefined,
      filters: updatedFilters,
      reload: true,
      page: firstPage,
      page_size
    }));
  }

  const onRemoveFilter = (filter: IFilter) => {
    setPage(firstPage);
    const index = selectedFilters.findIndex(f => (
      f.name === filter.name &&
      f.opr === filter.opr &&
      f.value === filter.value
    ));
    if (index !== -1) {
      setDisableSaveViewBtn(false);
      const tmpFiltersToConfigure = selectedFilters.slice();
      tmpFiltersToConfigure.splice(index, 1);
      setSelectedFilters(tmpFiltersToConfigure);
      dispatch(loadListData({
        viewId: view ? view.id : undefined,
        filters: tmpFiltersToConfigure,
        reload: true,
        page: firstPage,
        page_size
      }));
    }
  };

  return (
    <Fragment>
      <ListFilters
        disableViews={disableSaveViewBtn || disableViews}
        disableFilter={disableFilter}
        allFilters={allFilters}
        selectedFilters={selectedFilters}
        onSaveView={onTriggerSaveView}
        onAddFilter={onAddFilter}
        onUpdateFilter={onUpdateFilter}
        onRemoveFilter={onRemoveFilter}
      ></ListFilters>
      <Dialog
        autoFocus={true}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        enforceFocus={true}
        isOpen={!!addDialogOpened}
        onClose={() => setAddDialogOpened(false)}
        usePortal={true}
        title="Create a new view"
        icon="cog"
      >
        <ViewDialogComponent
          pending={creatingStatus === ApiStatus.LOADING}
          onSave={onAddView}
          onClose={() => setAddDialogOpened(false)}
        ></ViewDialogComponent>
      </Dialog>
      <Dialog
        autoFocus={true}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        enforceFocus={true}
        isOpen={!!saveDialogOpened}
        onClose={() => setSaveDialogOpened(false)}
        usePortal={true}
        title="Save view"
        icon="cog"
      >
        <SaveViewDialogComponent
          view={view}
          pending={creatingStatus === ApiStatus.LOADING || savingStatus === ApiStatus.LOADING}
          onSave={onSaveView}
          onAdd={onAddView}
          onClose={() => setSaveDialogOpened(false)}
        ></SaveViewDialogComponent>
      </Dialog>
    </Fragment>
  );
};

export default ListFiltersContainer;
