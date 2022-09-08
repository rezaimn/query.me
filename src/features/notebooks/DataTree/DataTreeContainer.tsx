import React, { FunctionComponent, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Spinner, Button } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import {
  load as loadDataTree,
  refreshDatabase,
} from '../../../shared/store/actions/dataTreeActions';
import { IDatabase, ApiStatus } from '../../../shared/models';
import { IState } from '../../../shared/store/reducers';
import DataTreeComponent from './DataTree';
import { useNotebookCurrentBlock } from '../NotebookNavigationContext';

import './DataTreeContainer.scss';

type SelectDataElementCallback = (dataElement: any) => void;

type DataTreeContainerProps = {
  databases?: IDatabase[] | null;
  show?: boolean;
  onSelectDataElement: SelectDataElementCallback;
};

const DataTreeContainer: FunctionComponent<DataTreeContainerProps> = ({
  show = true,
  onSelectDataElement,
}: DataTreeContainerProps) => {
  const nodes = useSelector((state: IState) => state.dataTree.nodes);
  const loadingStatus = useSelector((state: IState) => state.dataTree.loadingStatus);
  const dispatch = useDispatch();
  const currentBlock = useNotebookCurrentBlock();

  const onRefresh = useCallback((id: string) => {
    if (id) {
      dispatch(refreshDatabase(id));
    }
  }, []);

  if (!show) {
    // do not render tree if show is false
    return (
      <div className="no-data-tree">
        <p>No data available.</p>
      </div>
    )
  }

  const loading = loadingStatus === ApiStatus.LOADING;
  if (loading) {
    return <Spinner className="loading" size={25} />;
  }

  if ((!nodes || (nodes && !nodes.length)) && !loading) {
    return (
      <div className="no-data-tree">
        <NavLink to="/d/d/connect">
          <Button
            data-cy='addNewNotebookLeftMenu'
            icon={IconNames.ADD}
            className="bp3-large"
            intent="primary"
            aria-label="New Database"
          >New Database</Button>
        </NavLink>
      </div>
    )
  }

  /*
   * the tree is built inside the DataTreeComponent
   */
  return (
    nodes && <DataTreeComponent
      nodes={nodes}
      onRefresh={onRefresh}
      onSelectDataElement={onSelectDataElement}
    />
  );
};

export default DataTreeContainer;
