import cloneDeep from 'lodash/cloneDeep';
import {ITreeNode, Tree} from '@blueprintjs/core';
import {DataTreeAction, DataTreeTypes, NodePath} from "./actions";
import { filterDataTree } from "../utils";

export const initialDataTreeState: IDataTreeState = {
  dataTree: null,
  tmpDataTree: null,
}

export interface IDataTreeState {
  dataTree: ITreeNode[] | null,
  tmpDataTree: ITreeNode[] | null,
}

const expandNode = (node: ITreeNode) => node && (node.isExpanded = true);
const collapseNode = (node: ITreeNode) => node && (node.isExpanded = false);
const selectNode = (node: ITreeNode) => node && (node.isSelected = true);
const selectAndExpandNode = (node: ITreeNode) => {
  if (!node) {
    return;
  }
  node.isExpanded = true;
  node.isSelected = true;
};
const unselectNode = (node: ITreeNode) => node && (node.isSelected = false);
const removeCaretIfNoChildren = (node: ITreeNode) => {
  if (node && (!node.childNodes || node.childNodes.length === 0)) {
    node.hasCaret = false;
    collapseNode(node);
  }
};

type UpdateFn = (node: ITreeNode) => void;

function updateNode(nodes: ITreeNode[] | null, path: NodePath, updateFn: UpdateFn) {
  if (!nodes) {
    return null;
  }
  const node = Tree.nodeFromPath(path, nodes);
  node && updateFn(node);
}

function updateAllNodes(nodes: ITreeNode[] | null, updateFn: UpdateFn) {
  if (!nodes) {
    return null;
  }
  for (const node of nodes) {
    updateFn(node);
  }
}

export default function dataTreeReducer(
  state: IDataTreeState = initialDataTreeState,
  action: DataTreeAction): IDataTreeState {

  let dataTree;
  switch (action.type) {
    case DataTreeTypes.EXPAND_NODE:
      dataTree = cloneDeep(state.dataTree);

      updateNode(dataTree, action.payload, expandNode);
      updateNode(dataTree, action.payload, removeCaretIfNoChildren);

      return {
        ...state,
        dataTree: dataTree
      };
    case DataTreeTypes.COLLAPSE_NODE:
      dataTree = cloneDeep(state.dataTree);

      updateNode(dataTree, action.payload, collapseNode);

      return {
        ...state,
        dataTree: dataTree
      };
    case DataTreeTypes.SELECT_NODE:
      dataTree = cloneDeep(state.dataTree);

      updateAllNodes(dataTree, unselectNode);
      updateNode(dataTree, action.payload, selectNode);

      return {
        ...state,
        dataTree: dataTree
      };
    case DataTreeTypes.SELECT_AND_EXPAND_NODE:
      dataTree = cloneDeep(state.dataTree);

      updateAllNodes(dataTree, unselectNode);
      updateNode(dataTree, action.payload, selectAndExpandNode);

      return {
        ...state,
        dataTree: dataTree
      };
    case DataTreeTypes.UNSELECT_NODE:
      dataTree = cloneDeep(state.dataTree);

      updateNode(dataTree, action.payload, unselectNode);

      return {
        ...state,
        dataTree: dataTree
      };
    case DataTreeTypes.UNSELECT_ALL_NODES:
      dataTree = cloneDeep(state.dataTree);

      updateAllNodes(dataTree, unselectNode);

      return {
        ...state,
        dataTree: dataTree
      };
    case DataTreeTypes.LOADED_DATA_TREE:
      // init call
      return {
        ...state,
        dataTree: action.payload
      }
      case DataTreeTypes.SEARCH:
      const keyword = action.payload.keyword;
      const columnType = action.payload.columnType || "";

      /*
       * tmpDataTree is used to save the initial dataTree.
       * In case of a search query / columnType filter, we save dataTree into tmpDataTree.
       * In case the search query is empty, we assign dataTree with tmpDataTree (initial value) and unset tmpDataTree.
       */
      const filter = !!(keyword || columnType);

      let tmpDataTree = state.tmpDataTree;
      if (filter && !tmpDataTree) {
        tmpDataTree = cloneDeep(state.dataTree);
      } if (!filter) {
        tmpDataTree = null;
      }

      dataTree = state.dataTree;
      if (filter) {
        dataTree = filterDataTree(cloneDeep(tmpDataTree), keyword, columnType);
      } else if (!filter && state.tmpDataTree) {
        dataTree = cloneDeep(state.tmpDataTree);
      }

      return {
        ...state,
        dataTree: dataTree,
        tmpDataTree: tmpDataTree
      }
    default:
      return state;
  }
};
