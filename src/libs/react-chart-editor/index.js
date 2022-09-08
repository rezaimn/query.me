import PlotlyEditor from './PlotlyEditor';
import DefaultEditor from './DefaultEditor';
import EditorControls from './EditorControls';
import {EDITOR_ACTIONS} from './lib/constants';

export const PROPERTIES_LINKED_TO_SQL_BLOCK = [
    'x',
    'y',
    'z',
    'values',
    'labels',
    'parents',
    'ids',
    'measure',
    'node.label',
    'node.groups',
    'node.x',
    'node.y',
    'link.source',
    'link.target',
    'link.value',
    'link.label',
    'i',
    'j',
    'k',
    'open',
    'high',
    'low',
    'close',
    'a',
    'b',
    'c',
    'u',
    'v',
    'w',
    'starts.x',
    'starts.y',
    'starts.z',
    'header.values',
    'cells.values',
    'r',
    'theta',
    'header.fill.color',
    'header.font.color',
    'header.font.size',
    'cells.fill.color',
    'cells.font.color',
    'cells.font.size',
    'columnwidth',
    'columnorder',
    'intensity',
    'facecolor',
    'vertexcolor'
  ];
export {DefaultEditor, EditorControls, EDITOR_ACTIONS};

export * from './lib';
export * from './components';
export * from './default_panels';
export * from './shame';

export default PlotlyEditor;
