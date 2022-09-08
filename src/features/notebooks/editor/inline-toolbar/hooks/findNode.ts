/**
 * Iterate through all of the nodes in the editor and return the first match. If
 * no match is found, return undefined.
 */
import { Editor, Location, Node, NodeEntry, Span } from 'slate';
import { TEditor, TNode, MatchOptions, findNode } from '@udecode/plate';

export type FindNodeOptions<T extends Node = Node> = {
  at?: Location | Span;
  id?: number | string;
  reverse?: boolean;
  voids?: boolean;
} & MatchOptions<T>;

export const findNodeById = <T extends Node = Node>(
  editor: TEditor,
  options: FindNodeOptions<T>
): NodeEntry<TNode<any>> | undefined => {
  /* const { id } = options;
  return findNode(editor, { match: { id }}); */
  try {
    const {
      id,
      reverse = false,
      voids = false,
    } = options;

    let root: NodeEntry = [editor, []];
    // console.log('root = ', root);

    const nodeEntries = Node.nodes(root[0], {
      reverse,
      pass: ([n]) => (voids ? false : Editor.isVoid(editor, n)),
    });

    // console.log('  nodeEntries = ', nodeEntries);
    for (const [node, path] of nodeEntries) {
      // console.log('    node = ', node);
      if ((node as any).id === id) {
        // console.log('      checked');
        return [node as any, path];
      }
    }
  } catch (error) {
    return undefined;
  }
};
