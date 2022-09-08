import { HistoryEditor } from 'slate-history';
import { Transforms } from 'slate';
import {
  getPlatePluginWithOverrides,
  TNode,
  WithOverride,
} from '@udecode/plate-core';

interface IWithTrailingWhiteSpace {

}

/**
 * Enables support for inserting nodes with an id key.
 */
 export const withTrailingWhiteSpace = ({}: IWithTrailingWhiteSpace = {}): WithOverride<HistoryEditor> => (e) => {
  const editor = e as any & { removedIDs: Set<any> };
  const { apply } = editor;
  e.apply = (operation: any) => {
    const newProperties = operation?.newProperties as any;
    if (operation.type === 'set_node' && newProperties?.code) {
      let offset = 0;
      let whiteSpacePath: number[] = [];
      if (editor.selection?.focus?.offset) {
        offset = editor.selection?.focus?.offset;
        whiteSpacePath = [...editor.selection?.focus?.path];
        whiteSpacePath[whiteSpacePath.length - 1] = whiteSpacePath[whiteSpacePath.length - 1] + 1;
      }
      Transforms.insertNodes(editor, { text: ' ' }, {
        at: { path: operation.path, offset: offset },
      });
      try {
        // Range object from Slate
        const selection = { anchor: { offset: 1, path: whiteSpacePath }, focus: { offset: 1, path: whiteSpacePath } };
        Transforms.select(editor, selection);
      } catch (e) {
        // silent fail
      }
      return apply({
        ...operation,
        properties: {
          ...operation.properties,
        },
      });
    }
    return apply(operation);
  };
  return e;
};

/**
 * @see {@link withTrailingWhiteSpace}
 */
export const createTrailingWhiteSpacePlugin = getPlatePluginWithOverrides(withTrailingWhiteSpace);
