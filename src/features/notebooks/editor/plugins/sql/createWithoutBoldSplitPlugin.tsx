import { HistoryEditor } from 'slate-history';
import {
  getPlatePluginWithOverrides,
  TNode,
  WithOverride,
} from '@udecode/plate-core';

interface IWithoutBoldSplit {

}

export const withoutBoldSplit = ({}: IWithoutBoldSplit = {}): WithOverride<HistoryEditor> => (e) => {
  const editor = e as any & { removedIDs: Set<any> };
  const { apply } = editor;
  e.apply = (operation) => {
    if (operation.type === 'split_node' ) {
      const properties = operation.properties as any;
      if (editor.selection?.anchor.offset === editor.selection?.focus.offset) {
        properties.bold = false;
      }
      return apply({
        ...operation,
        properties: {
          ...properties
        },
      });
    }
    return apply(operation);
  };
  return e;
};

/**
 * @see {@link withoutBoldSplit}
 */
export const createWithoutBoldSplitPlugin = getPlatePluginWithOverrides(withoutBoldSplit);
