import {
  defaultsDeepToNodes,
  queryNode,
  QueryNodeOptions,
  someNode,
} from '@udecode/plate-common';
import {
  getPlatePluginWithOverrides,
  TNode,
  WithOverride,
} from '@udecode/plate-core';
import cloneDeep from 'lodash/cloneDeep';
import { Operation } from 'slate';
import { HistoryEditor } from 'slate-history';

export interface WithLastSelectProps extends QueryNodeOptions {
}

interface ILastSelectionEditor {
  lastSelection: any;
}

/**
 * We save the last selection.
 * operation structure:
 * {
 *   type:
 *   properties:
 *   newProperties:
 * }
 */
export const withLastSelection = ({}: WithLastSelectProps = {}): WithOverride<HistoryEditor> => (e) => {
  const editor = (e as any) as ILastSelectionEditor;
  const { apply } = e;
  editor.lastSelection = null;

  e.apply = (op: Operation) => {
    if (op.type === 'set_selection') {
      editor.lastSelection = op; // @TODO - do not overwrite with the same selection
    }

    apply(op);
  };

  return e;
};

/**
 * @see {@link withNodeId}
 */
export const createLastSelectionPlugin = getPlatePluginWithOverrides(withLastSelection);
