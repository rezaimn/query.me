import React, {useEffect, FunctionComponent, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { loadSchema, sortTablesInSchema } from '../../../shared/store/actions/schemaActions';
import { IState } from '../../../shared/store/reducers';
import { ApiStatus, ISort } from '../../../shared/models';
import SchemaDetailsInfoComponent from './SchemaDetailsInfo';
import DatabaseDetailsInfoComponent from '../databases/DatabaseDetailsInfo';

type OnCloseCallback = () => void;

type SchemaDetailsInfoContainerProps = {
  schemaId: string;
  onCloseDrawer: OnCloseCallback;
};

const SchemaDetailsContainer: FunctionComponent<SchemaDetailsInfoContainerProps> = ({
  schemaId, onCloseDrawer
}: SchemaDetailsInfoContainerProps) => {
  const schema = useSelector((state: IState) => state.schemas.schema);
  const loadingStatus = useSelector((state: IState) => state.schemas.loadingStatus);
  const dispatch = useDispatch();
  const firstPage:number = useSelector((state: IState) => state.general.firstPage);
  const [page, setPage] = useState<number>(firstPage);
  const page_size = useSelector((state: IState) => state.general.pageSize);
  const canLoadMore = useSelector((state: IState) => state.schemas.canLoadMoreTablesForSchema);

  useEffect(() => {
    dispatch(loadSchema(schemaId, page, page_size, true ,true));
  }, [ dispatch, schemaId ]);

  const onToggleSort = (sort: ISort) => {
    dispatch(sortTablesInSchema(schemaId, sort));
  };
  const loadMoreTablesForSchema = () => {
    dispatch(loadSchema(schemaId, page + 1, page_size, false, true));
    setPage(page + 1);
  }

  return (
    <SchemaDetailsInfoComponent
      infiniteScrollClassName='infinite-scroll-base-schema-detail-info'
      canLoadMore={canLoadMore}
      currentPage={page}
      firstPage={firstPage}
      loadMoreTablesForSchema={loadMoreTablesForSchema}
      schema={schema}
      schemaLoading={loadingStatus === ApiStatus.LOADING}
      fromDrawer={true}
      onCloseDrawer={onCloseDrawer}
      onToggleSort={onToggleSort}
    ></SchemaDetailsInfoComponent>
  );
};

export default SchemaDetailsContainer;
