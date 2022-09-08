import { Editor, Element, Path, Point, Transforms, Text } from 'slate';
import { ReactEditor } from 'slate-react';
import {
  getAbove,
  getBlockAbove,
  getNode,
  insertNodes,
  setNodes,
  isElement,
  isType,
} from '@udecode/plate';
import {ELEMENT_SQL} from './types';

const getElementPath = (editor: any, element: any) => ReactEditor.findPath(editor, element);

const addBlock = (slateEditor: any, newPath: Point | undefined) => {
  if (!newPath) {
    return;
  }

  let children: any = [{ text: '' }];
  insertNodes(slateEditor, {
    type: 'p', // paragraph
    children: children,
  }, {
    at: newPath
  });

  ReactEditor.focus(slateEditor as ReactEditor);
  const startPoint = Editor.start(slateEditor, newPath);
  Transforms.select(slateEditor, startPoint);
};

const addBlockAfter = (slateEditor: any, path: Path) => {
  if (!slateEditor.selection) {
    slateEditor.selection = Editor.range(slateEditor, path);
  }
  let newPath = Editor.after(slateEditor, path);

  addBlock(slateEditor, newPath);
};

const addBlockBefore = (slateEditor: any, path: Path) => {
  if (!slateEditor.selection) {
    slateEditor.selection = Editor.range(slateEditor, path);
  }
  let newPath = Editor.before(slateEditor, path);

  addBlock(slateEditor, newPath);
};

export const exitEditorStartCmd = (slateEditor: any, element: any) => {
  return {
    name: 'exit-editor-start',
    bindKey: { win: 'Ctrl-Shift-Enter', mac: 'Command-Shift-Enter' },
    exec: function (editor: any) {
      const currentLine = editor.getSession().selection.cursor.row;
      if (currentLine === 0) {
        const path = getElementPath(slateEditor, element);
        addBlockBefore(slateEditor, path);
      }
    }
  }
};

export const exitEditorEndCmd = (slateEditor: any, element: any) => {
  return {
    name: 'exit-editor-end',
    bindKey: { win: 'Ctrl-Enter', mac: 'Command-Enter' },
    exec: function (editor: any) {
      const totalLines = editor.getSession().getLength();
      const currentLine = editor.getSession().selection.cursor.row;

      if (totalLines - 1 === currentLine) { // last line of the editor
        const path = getElementPath(slateEditor, element);
        addBlockAfter(slateEditor, path);
      }
    }
  }
};

/*
 * Transition from AceEditor to SlateEditor (block before)
 */
export const onArrowUpKeypress = (slateEditor: any, element: any) => {
  return {
    name: 'arrow-up-keypress', // overwritten golineup from Ace
    bindKey: { win: 'Up', mac: 'Up' },
    exec: function exec(editor: any, args: any) {
      const currentLine = editor.getSession().selection.cursor.row;
      const currentColumn = editor.getSession().selection.cursor.column;

      editor.navigateUp(args.times);

      if (currentLine === 0) {
        /*
         * - if we're in editor's 1st line
         * - and there is a block before the current Slate block
         * - focus on that element and move cursor there
         */
        // if (slateEditor.selection) {
          const path = getElementPath(slateEditor, element);
          const newPath = Editor.before(slateEditor, path);

          if (newPath) {
            editor.blur();

            const range = Editor.range(slateEditor, newPath);
            const selection = {
              anchor: {
                offset: currentColumn <= range.anchor.offset ?
                currentColumn :
                  range.anchor.offset,
                path: newPath.path
              },
              focus: {
                offset: currentColumn <= range.anchor.offset ?
                currentColumn :
                  range.anchor.offset,
                path: newPath.path
              }
            };

            ReactEditor.focus(slateEditor);
            // Transforms.move(slateEditor, { distance: 1, unit: 'line', reverse: true });

            Transforms.select(slateEditor, selection);
          }
        // }
      }
    }
  }
};

/*
 * Trigger request execution from shortcut
 */
export const onExecuteKeypress = (onExecuteSql: Function) => {
  return {
    name: 'execute-keypress', // overwritten golineup from Ace
    bindKey: { win: 'Ctrl-Enter', mac: 'Command-Enter' },
    exec: function exec(editor: any, args: any) {
      onExecuteSql && onExecuteSql();
    }
  };
};

export const onAddNewBlockKeypress = (element: any) => {
  return {
    name: 'add-new-block-keypress', // overwritten golineup from Ace
    bindKey: { win: 'Ctrl-.', mac: 'Command-.' },
    exec: function exec(editor: any, args: any) {
      if (editor.selection) {
        document.getElementById('action_' + element.uid)?.click();
      }
    },
  };
};
/*
 * Transition from AceEditor to SlateEditor (block after)
 */
export const onArrowDownKeypress = (slateEditor: any, element: any) => {
  return {
    name: 'arrow-down-keypress', // overwritten golinedown from Ace
    bindKey: { win: 'Down', mac: 'Down' },
    exec: function exec(editor: any, args: any) {
      const totalLines = editor.getSession().getLength();
      const currentLine = editor.getSession().selection.cursor.row;
      const currentColumn = editor.getSession().selection.cursor.column;

      editor.navigateDown(args.times);

      if (totalLines - 1 === currentLine) { // last line of the editor
        /*
         * - if we're in editor's last line
         * - and there is a block after the current Slate block
         * - focus on that element and move cursor there
         */
        // if (slateEditor.selection) {
          const path = getElementPath(slateEditor, element);
          const newPath = Editor.after(slateEditor, path);

          if (newPath) {
            editor.blur();

            const range = Editor.range(slateEditor, newPath);
            const selection = {
              anchor: {
                offset: currentColumn <= range.anchor.offset ?
                currentColumn :
                  range.anchor.offset,
                path: newPath.path
              },
              focus: {
                offset: currentColumn <= range.anchor.offset ?
                currentColumn :
                  range.anchor.offset,
                path: newPath.path
              }
            };

            ReactEditor.focus(slateEditor);
            // Transforms.move(slateEditor, { distance: 1, unit: 'line', reverse: false });

            Transforms.select(slateEditor, selection);
          }
        // }
      }
    }
  };
};

/*
 * Merge Slate Editor block into Ace editor (block after)
 */
export const onDeleteKeypress = (slateEditor: any, element: any) => {
  return {
    name: 'delete-keypress', // overwritten delete from Ace
    bindKey: {win: 'Delete', mac: 'Delete'},
    exec: function exec(editor: any, args: any) {
      const cursor = editor.getCursorPosition();
      const totalLines = editor.getSession().getLength();

      if ((totalLines - 1) === cursor.row) { // last line of the editor
        const currentLine = editor.getSession().getLine(cursor.row);

        if (cursor.column === currentLine.length) { // cursor is on the last position in Ace Editor
          /*
           * Delete Slate Block after
           */
          const path = getElementPath(slateEditor, element);
          const newPath = Editor.after(slateEditor, path); // Block after current element exists?

          if (newPath) {
            Editor.withoutNormalizing(slateEditor, () => {
              const at = slateEditor.selection;
              const match = (n: any) => Editor.isBlock(slateEditor, n);
              const voids = false; // @TODO - not sure if we need this
              const mode = 'lowest'; // search until the last hit

              if (!at) {
                return;
              }

              try {
                const next = Editor.next(slateEditor, {at, match, voids, mode});
                const [nextNode, nextPath]: any = next;

                const isNextSibling = Path.isSibling(path, nextPath);

                let text = "";
                if (isElement(nextNode) && isType(editor, nextNode, ELEMENT_SQL)) {
                  const {children, ...rest} = nextNode;

                  if (children[0].text) {
                    text = children[0].text + "\n";
                  }
                } else if (isElement(nextNode) && isType(editor, nextNode, ELEMENT_SQL)) {
                  const {sql, ...rest} = nextNode;

                  if (sql) {
                    text = sql + "\n";
                  }
                }

                // if no text found in the next Block, remove it instead of merging it
                if (!text) {
                  Transforms.removeNodes(slateEditor, {at: nextPath, voids});
                  return;
                }

                // if next Block is not a nested one (e.g. UL / LI), then remove it
                if (isNextSibling) {
                  Transforms.removeNodes(slateEditor, {at: nextPath, voids});
                } else {
                  // if Block is nested, remove the Block
                  // if Block parent remains empty, it will be removed by Slate Editor
                  Transforms.removeNodes(slateEditor, {at: nextPath.slice(0, 3), voids});
                }

                const scrollToLineNo = text.split("\n").length;
                editor.getSession().insert(cursor, text);
                editor.renderer.scrollToLine(cursor.row + scrollToLineNo);

                return; // Exit Execution
              } catch (error) {
                console.log('Error - Delete', error);
              }
            });
          }
        } else {
          editor.remove('right');
        }
      } else {
        editor.remove('right');
      }
    }
  };
};

/*
 * Merge Ace Editor into Slate Editor (block before)
 */
export const onBackspaceKeypress = (slateEditor: any, element: any) => {
  return {
    name: 'ctrl-backspace-keypress', // overwritten golineup from Ace
    bindKey: { win: 'Ctrl+Backspace', mac: 'Cmd+Backspace' },
    exec: function exec(editor: any, args: any) {
      const cursor = editor.getSession().selection.cursor;

      if (cursor.row === 0 && cursor.column === 0) {
        const path = getElementPath(slateEditor, element);
        const newPath = Editor.before(slateEditor, path); // Block before current element exists?

        if (newPath) {
          Editor.withoutNormalizing(slateEditor, () => {
            const allText = editor.getSession().getValue();

            const at = slateEditor.selection;
            const match = (n: any) => Editor.isBlock(slateEditor, n);
            const voids = false; // @TODO - not sure if we need this
            const mode = 'lowest'; // search until the last hit

            if (!at) {
              return;
            }

            try {
              const previous = Editor.previous(slateEditor, {at, match, voids, mode});
              const [previousNode, previousPath]: any = previous;

              if (isElement(previousNode) && isType(editor, previousNode, ELEMENT_SQL)) {
                Transforms.insertText(slateEditor, allText, {
                  at: newPath
                });
              } else if (isElement(previousNode) && isType(editor, previousNode, ELEMENT_SQL)) {
                console.log('this does not work yet! MERGE SQL with SQL');
                return;

                const { sql } = previousNode;
                setNodes(
                  slateEditor,
                  {
                    'sql': (sql || "") + allText
                  },
                  {
                    at: previousPath,
                  }
                );
              }

              Transforms.removeNodes(slateEditor, {
                at: path
              }); // remove Ace Editor
            } catch (error) {
              console.log('Error - Backspace', error);
            }
          });
        }
      }
    }
  };
};
