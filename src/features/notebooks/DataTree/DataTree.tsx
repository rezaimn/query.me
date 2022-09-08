import React, {
  Fragment,
  FunctionComponent,
  useEffect,
  useMemo,
  useCallback,
  useState,
  useReducer
} from 'react';
import { NavLink } from 'react-router-dom';
import {
  Button,
  Icon,
  InputGroup,
  Menu,
  MenuItem,
  Popover,
  Position,
  ITreeNode,
  Tree,
  Dialog,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import {
  NodePath,
  loaded,
  search as onSearch,
  expandNode,
  collapseNode,
  selectAndExpandNode
} from './store/actions';
import dataTreeReducer, { IDataTreeState } from './store/reducer';
import { buildDataTree } from './build';
import { refreshDataTree } from './refresh';
import { capitalizeWord } from "../../../shared/utils/text";
import useDebounce from '../../../shared/hooks/use-debounce';
import { useNotebookCurrentBlock } from '../NotebookNavigationContext';
import './DataTree.scss';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '../../../shared/store/reducers';
import { loadedSelectStarData, loadSelectStarData } from '../../../shared/store/actions/dataTreeActions';
import QueryTableResult from '../editor/plugins/sql/results/QueryTableResult';

type OnRefreshCallback = (id: string) => void;
type OnCopyRequestCallback = (id: string | number) => void;
type SelectDataElementCallback = (dataElement: any) => void;

type DataTreeComponentProps = {
  nodes: any;
  onRefresh: OnRefreshCallback;
  onSelectDataElement: SelectDataElementCallback;
};

interface ISearchMenu {
  label: string;
  onMenuClick: (columnType: string) => void;
}

const SearchMenu: FunctionComponent<ISearchMenu> = ({ onMenuClick, label }: ISearchMenu) => {
  const content = (
    <Menu>
      <MenuItem text="All" onClick={(event: any) => onMenuClick('')} />
      <MenuItem text="String" onClick={(event: any) => onMenuClick('STRING')} />
      <MenuItem text="Number" onClick={(event: any) => onMenuClick('NUMBER')} />
      <MenuItem text="Date" onClick={(event: any) => onMenuClick('DATE')} />
      <MenuItem text="Boolean" onClick={(event: any) => onMenuClick('BOOLEAN')} />
    </Menu>
  );

  return (
    <Popover content={content} position={Position.BOTTOM_LEFT}>
      <Button minimal={true} rightIcon={IconNames.CARET_DOWN}>{ label ? capitalizeWord(label) : 'All' }</Button>
    </Popover>
  );
}

const initialDataTreeState: IDataTreeState = {
  dataTree: null,
  tmpDataTree: null,
}

const DataTreeComponent: FunctionComponent<DataTreeComponentProps> = ({
  nodes, onRefresh, onSelectDataElement
}: DataTreeComponentProps) => {
  const [ state, dispatch ] = useReducer(dataTreeReducer, initialDataTreeState);
  const dispatchData = useDispatch();

  const [ columnType, setColumnType ] = useState('');
  const [ search, setSearch ] = useState('');
  const [ selectedDatabase, setSelectedDatabase ] = useState('');
  const [ requestCopied, setRequestCopied ] = useState<string | number | null>(null);
  const debouncedColumnType = useDebounce(columnType, 800);
  const debouncedSearch = useDebounce(search, 800);
  const currentBlock = useNotebookCurrentBlock();
  const selectStarData = useSelector((state: IState) => state.dataTree.selectStarData);
  const [openTablePreviewModal, setOpenTablePreviewModal] = useState<boolean>(false);
  const [tableFullId, setTableFullId] = useState<string>('');

  const onTablePreview = (id: string) => {
    setTableFullId(id);
    setOpenTablePreviewModal(true);
    dispatchData(loadedSelectStarData(null));
    const [databaseId, schemaId, tableId] = id.split('.');
    dispatchData(loadSelectStarData(databaseId, schemaId, tableId));
  };
  const onCloseTablePreviewModal = () => {
    setOpenTablePreviewModal(false);
  };
  const onRequestCopied = useCallback((id: string | number) => {
    setRequestCopied(id);
    setTimeout(() => {
      setRequestCopied(null);
    }, 5000);
  }, [requestCopied, setRequestCopied]);

  // Disabled the selection in the data tab
  /* useEffect(() => {
    if (
      state?.dataTree &&
      currentBlock &&
      currentBlock.type === 'sql' &&
      currentBlock.database_id &&
      selectedDatabase !== currentBlock.database_id
    ) {
      const path = state?.dataTree.findIndex(database => database.id === currentBlock.database_id);
      setSelectedDatabase(currentBlock.database_id);
      dispatch(selectAndExpandNode([path]));
    }
  }, [ currentBlock, state?.dataTree ]); */

  useEffect(() => {
    /*
     * on component init, nodes are provided.
     * nodes are loaded and turned into dataTree and set in local state.
     *
     */

    dispatch(
      loaded(buildDataTree(nodes, requestCopied, onRefresh, onRequestCopied, onTablePreview))
    );
  }, [ nodes ]);

  useEffect(() => {
    if (state && state?.dataTree) {
      dispatch(
        loaded(refreshDataTree(state?.dataTree, requestCopied, onRequestCopied, onTablePreview))
      );
    }
  }, [ requestCopied ]);

  const onNodeExpand = useCallback((node: ITreeNode, path: NodePath) => {
    dispatch(expandNode(path));
    // load children on lazy load
  }, []);

  const onNodeCollapse = useCallback((node: ITreeNode, path: NodePath) => dispatch(collapseNode(path)), []);

  const onNodeMouseEnter = useCallback((
    node: any,
    nodePath: NodePath,
    event: any) => {
    const { type } = node.nodeData || {};

    if (type === 'database' || type === 'table') {
      event.currentTarget?.classList?.add('active');
    }
  }, []);

  const onNodeMouseLeave = useCallback((
    node: any,
    nodePath: NodePath,
    event: any) => {
    const { type } = node.nodeData || {};

    if (type === 'database' || type === 'table') {
      event.currentTarget?.classList?.remove('active');
    }
  }, []);

  useEffect(() => {
    dispatch(
      onSearch(search, columnType)
    );
  }, [ debouncedColumnType, debouncedSearch ]);

  return (
    <Fragment>
      <div className="data-tree">
        <div className="data-tree__header">
          <InputGroup
            defaultValue=""
            onChange={(event: any) => setSearch(event.target.value)}
            className="data-tree__search"
            leftIcon={IconNames.SEARCH}
            placeholder='Search'
            rightElement={<SearchMenu onMenuClick={setColumnType} label={columnType} />} />
          <NavLink to="/d/d/connect">
            <Button
              icon={IconNames.ADD}
              data-cy='addPageAction'
              className='bp3-button bp3-minimal'
            />
          </NavLink>
        </div>
        {
          state.dataTree && <Tree
            className='data-tree__overflow'
            contents={state.dataTree}
            onNodeExpand={onNodeExpand}
            onNodeCollapse={onNodeCollapse}
            onNodeMouseEnter={onNodeMouseEnter}
            onNodeMouseLeave={onNodeMouseLeave}
            onNodeClick={onSelectDataElement}
          />
        }
      </div>
      <Dialog
        icon="info-sign"
        onClose={() => onCloseTablePreviewModal()}
        title={`Preview of: ${tableFullId.split('.').pop()}`}
        isOpen={openTablePreviewModal}
        style={{ backgroundColor: '#fff', paddingBottom: '5px', width: '60vw', zIndex: 1000 }}
      >
        {
          selectStarData &&
          <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <QueryTableResult result={selectStarData}/>
          </div>
        }
      </Dialog>
    </Fragment>
  );
};

export default DataTreeComponent;
