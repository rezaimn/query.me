import { Editor } from 'slate';
import { getNodes, EditorNodesOptions } from '@udecode/plate';


/**
 * Get blocks with an id
 */
export const getBlocksWithId = (
  editor: Editor,
  options: EditorNodesOptions
) => {
  return [
    ...getNodes(editor, {
      match: (n) => Editor.isBlock(editor, n) && !!n.id,
      ...options,
    }),
  ];
};
