import {
  AutoformatRule,
  ELEMENT_DEFAULT,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_CODE_BLOCK,
  ELEMENT_BLOCKQUOTE,
  insertNodes,
  insertEmptyCodeBlock
} from '@udecode/plate';
import { Editor, Transforms } from 'slate';
import { getPlatePluginType, SPEditor, TElement } from '@udecode/plate-core';
import { onCommand } from '../commands';
import { preFormat } from './autoformatUtils';
import { ELEMENT_PARAMETER } from '../plugins/parameter/defaults';
import { ELEMENT_SQL } from '../plugins/sql/types';
import { ELEMENT_PLOTLY } from '../plugins/plotly/defaults';
import { clearBlockFormat } from './autoformatUtils';

const formatChildren = (type: any, options: any) => (editor: Editor) => {
  /*
   * default formatting is Transforms.setNodes, where you cannot set children
   */
  const children = [{text: "", ...options}];
  insertNodes(
    editor,
    { type: getPlatePluginType(editor as SPEditor, type), children },
    { match: (n) => Editor.isBlock(editor, n) }
  );
};

export const autoformatBlocks: AutoformatRule[] = [
  {
    mode: 'block',
    type: ELEMENT_H1,
    match: '# ',
    preFormat,
    format: formatChildren(ELEMENT_H1, { bold: true })
  },
  {
    mode: 'block',
    type: ELEMENT_H2,
    match: '## ',
    preFormat,
    format: formatChildren(ELEMENT_H2, { bold: true })
  },
  {
    mode: 'block',
    type: ELEMENT_H3,
    match: '### ',
    preFormat,
  },
  {
    mode: 'block',
    type: ELEMENT_H4,
    match: '#### ',
    preFormat,
  },
  {
    mode: 'block',
    type: ELEMENT_H5,
    match: '##### ',
    preFormat,
  },
  {
    mode: 'block',
    type: ELEMENT_H6,
    match: '###### ',
    preFormat,
  },
  {
    mode: 'block',
    type: ELEMENT_CODE_BLOCK,
    match: '``',
    triggerAtBlockStart: false,
    preFormat: clearBlockFormat,
    format: (editor) => {
      insertEmptyCodeBlock(editor as SPEditor, {
        defaultType: getPlatePluginType(editor as SPEditor, ELEMENT_DEFAULT),
        insertNodesOptions: { select: true },
      });
    },
  },
  {
    mode: 'block',
    type: ELEMENT_SQL,
    match: '-- ',
    preFormat,
    format: (editor: Editor) => {
      onCommand(editor.selection?.focus.path || [], 'add-block', { type: ELEMENT_SQL }, editor);
    },
  },
  {
    mode: 'block',
    type: ELEMENT_BLOCKQUOTE,
    match: '> ',
    preFormat,
    format: formatChildren(ELEMENT_BLOCKQUOTE, { italic: true })
  },
  {
    mode: 'block',
    type: ELEMENT_PARAMETER,
    match: '??? ',
    preFormat,
    format: (editor: Editor) => {
      onCommand(editor.selection?.focus.path || [], 'add-block', { type: ELEMENT_PARAMETER }, editor);
    },
  },
  {
    mode: 'block',
    type: ELEMENT_PLOTLY,
    match: '&&& ',
    preFormat,
    format: (editor: Editor) => {
      onCommand(editor.selection?.focus.path || [], 'add-block', { type: ELEMENT_PLOTLY }, editor);
    },
  },
  {
    mode: 'block',
    type: ELEMENT_CODE_BLOCK,
    match: '```',
    preFormat,
    format: (editor: Editor) => {
      onCommand(editor.selection?.focus.path || [], 'add-block', { type: 'code_block' }, editor);
    },
  },
  {
    mode: 'block',
    type: ELEMENT_CODE_BLOCK,
    match: '[]',
    preFormat,
    format: (editor: Editor) => {
      onCommand(editor.selection?.focus.path || [], 'add-block', { type: 'action_item' }, editor);
    },
  },
]
