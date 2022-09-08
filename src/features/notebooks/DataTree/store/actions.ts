export enum DataTreeTypes {
  EXPAND_NODE = 'data_tree_container/expand-node',
  COLLAPSE_NODE = 'data_tree_container/collapse-node',
  SELECT_NODE = 'data_tree_container/select-node',
  SELECT_AND_EXPAND_NODE = 'data_tree_container/select-node-and-expand',
  UNSELECT_NODE = 'data_tree_container/unselect-node',
  UNSELECT_ALL_NODES = 'data_tree_container/unselect-all-nodes',
  LOADED_DATA_TREE = 'data_tree_container/loaded',

  SEARCH = 'data_tree_container/search',
}

export type NodePath = number[];

export interface IExpandNode {
  type: DataTreeTypes.EXPAND_NODE,
  payload: NodePath
}

export interface ICollapseNode {
  type: DataTreeTypes.COLLAPSE_NODE,
  payload: NodePath
}

export interface ISelectNode {
  type: DataTreeTypes.SELECT_NODE,
  payload: NodePath
}

export interface ISelectAndExpandNode {
  type: DataTreeTypes.SELECT_AND_EXPAND_NODE,
  payload: NodePath
}

export interface IUnselectNode {
  type: DataTreeTypes.UNSELECT_NODE,
  payload: NodePath
}

export interface IUnselectAllNodes {
  type: DataTreeTypes.UNSELECT_ALL_NODES,
}

export interface ILoaded {
  type: DataTreeTypes.LOADED_DATA_TREE;
  payload: any;
}

export interface ISearch {
  type: DataTreeTypes.SEARCH;
  payload: {
    keyword: string;
    columnType?: string;
  }
}

// Functions

export function expandNode(path: NodePath): IExpandNode {
  return {
    type: DataTreeTypes.EXPAND_NODE,
    payload: path
  }
}

export function collapseNode(path: NodePath): ICollapseNode {
  return {
    type: DataTreeTypes.COLLAPSE_NODE,
    payload: path
  }
}

export function selectNode(path: NodePath): ISelectNode {
  return {
    type: DataTreeTypes.SELECT_NODE,
    payload: path
  }
}

export function selectAndExpandNode(path: NodePath): ISelectAndExpandNode {
  return {
    type: DataTreeTypes.SELECT_AND_EXPAND_NODE,
    payload: path
  }
}

export function unselectNode(path: NodePath): IUnselectNode {
  return {
    type: DataTreeTypes.UNSELECT_NODE,
    payload: path
  }
}

export function unselectAllNodes(): IUnselectAllNodes {
  return {
    type: DataTreeTypes.UNSELECT_ALL_NODES
  }
}

export function loaded(nodes: any): ILoaded {
  return {
    type: DataTreeTypes.LOADED_DATA_TREE,
    payload: nodes
  }
}

export function search(value: string, columnType: string): ISearch {
  return {
    type: DataTreeTypes.SEARCH,
    payload: {
      keyword: value,
      columnType: columnType
    }
  }
}

export type DataTreeAction =
  IExpandNode |
  ICollapseNode |
  ISelectNode |
  ISelectAndExpandNode |
  IUnselectNode |
  IUnselectAllNodes |
  ILoaded |
  ISearch;
