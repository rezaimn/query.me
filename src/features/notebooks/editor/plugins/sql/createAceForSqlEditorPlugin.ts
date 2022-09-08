import { Editor, Element, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import {
  getPlatePluginWithOverrides,
  TNode,
  WithOverride,
} from '@udecode/plate-core';
import { isElement } from '@udecode/plate'
import { ELEMENT_SQL } from './types';

interface IWithSqlEditor {

}

const matchSql = (node: any) => isElement(node) && (node as any).type === ELEMENT_SQL;

const matchBlock = (editor: any) => (node: any) => Editor.isBlock(editor, node);

export const withSqlEditor = ({}: IWithSqlEditor = {}): WithOverride<ReactEditor> => (editor) => {
  /*
   * Handle DEL / BACKSPACE around SQL Element
   */
  const { deleteForward, deleteBackward } = editor;

  editor.deleteBackward = (unit: any) => { // BACKSPACE
    const { selection }: any = editor;

    if (!selection) {
      return deleteBackward(unit);
    }

    const newPath: any = Editor.before(editor, selection);

    if (newPath) {
      const [previous]: any = Editor.nodes(editor, {
        at: newPath,
        match: matchSql,
        mode: 'highest'
      }); // node above current selection

      const [current]: any = Editor.nodes(editor, {
        at: selection,
        match: matchBlock(editor),
        mode: 'lowest'
      });

      if (previous && current) {
        // merge content of Block after SQL block into SQL block
        const [previousNode, previousPath]: any = previous;
        // current Block that will be merged
        const [currentNode, currentPath]: any = current;

        const { children } = currentNode;

        let text = children[0].text ? children[0].text : "";

        try {
          if (!text.trim()) {
            Transforms.removeNodes(editor, {at: selection, voids: false});
            return;
          }

          /*Transforms.setNodes(
            editor,
            {
              // children: [{text: ' '}],
              'sql': previousNode.sql + "!!!"
            },
            {
              at: previousPath,
            }
          );*/

          if (previousNode && previousNode.id) {
            // @TODO - Fix hack
            const { ace }: any = window;
            const aceEditor = ace.edit('code_editor_' + previousNode.id).getSession();

            if (!aceEditor) {
              return;
            }

            aceEditor.insert(
              {
                row: aceEditor.getLength() + 1,
                column: 0
              }, ("\n" + text)
            );
          }

          Transforms.removeNodes(editor, {at: selection, voids: false});
        } catch (error) {
          console.log('Delete Backward SQL Editor error', error);
        }

        return; // Stop propagation - prevent deletion
      }
    }

    deleteBackward(unit);
  }

  editor.deleteForward = (unit: any) => { // DELETE
    const { selection }: any = editor;

    if (!selection) {
      return deleteForward(unit);
    }

    const newPath: any = Editor.after(editor, selection);

    if (newPath) {
      const [next]: any = Editor.nodes(editor, {
        at: newPath,
        match: matchSql,
        mode: 'highest'
      }); // node below current selection

      if (next) {
        // prevent deletion of SQL Block
        return;
      }
    }


    deleteForward(unit);
  }

  return editor;
};

/**
 * @see {@link withSqlEditor}
 */
export const createAceForSqlEditorPlugin = getPlatePluginWithOverrides(withSqlEditor);
