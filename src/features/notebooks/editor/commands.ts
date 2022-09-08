import { getPlatePluginType } from '@udecode/plate-core';
import { createEditor, Editor, Node, Path, Transforms } from 'slate';
import { Slate, ReactEditor } from 'slate-react';
import { SELECT_ACTIONS } from './inline-toolbar/components/Selectable';
import { generateBlockDefaultName } from './utils';
import {
  SPEditor,
  ELEMENT_LI,
  ELEMENT_UL,
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  getNode,
  setNodes,
  insertNodes,
  wrapNodes,
  unwrapNodes,
  getParent,
  isElement,
  isType
} from '@udecode/plate';

const getSelectedElementIndex = (selectedElementId: number, editor: any) => {
  return editor.children.findIndex((element: any) => element.id === selectedElementId);
};

export function onCommand(
  path: Path,
  action: string,
  options?: any,
  editor?: Editor,
  index?: number
) {
  if (!editor) {
    return;
  }

  const spEditor = editor as SPEditor;

  if (action === SELECT_ACTIONS.ADD_BLOCK) {
    const { type } = options;
    let tempPath = [...path];
    let newPath: any = Editor.after(editor, tempPath);

    if (options.node && tempPath[0] !== getSelectedElementIndex(options.node.id,editor)) {
      tempPath[0] = getSelectedElementIndex(options.node.id, editor);
      const startPoint = Editor.start(editor, tempPath);
      Transforms.select(editor, startPoint);
    }
    if (!newPath) {
      tempPath[0] = tempPath[0] + 1;
      tempPath = tempPath.slice(0, 1);
    }

    let pathOnly = newPath?.path.slice(0, 1);
    let children: any = [{ text: '' }];
    let additionalOptions = {};
    let actualType = type;
    if (type === 'h1' || type === 'h2') {
      children = [{ text: '', bold: true }];
    } else if (type === 'sql' || type === 'plotly' || type === 'parameter') {
      children = [{ text: ' ' }];
    } else if (type === 'img') {
      children = [{ text: ' ' }];
      const { url } = options;
      additionalOptions = { url };
    } else if (type === 'media_embed') {
      children = [{ text: ' ' }];
      const { mediaEmbed } = options;
      additionalOptions = { mediaEmbed };
    } else if (type === 'ul' || type === 'ol') {
      actualType = 'p';
    }

    const name = generateBlockDefaultName(type, editor);
    insertNodes(editor, {
      type: getPlatePluginType(spEditor, actualType || 'p'),
      name: name,
      newBlock: true,
      ...additionalOptions,
      children: children
    }, {
      at: pathOnly ? pathOnly : tempPath,
    });
    ReactEditor.focus(editor as ReactEditor);
    if (pathOnly) {
      const startPoint = Editor.start(editor, pathOnly);
      Transforms.select(editor, startPoint);
    }
    if (type === ELEMENT_UL || type === ELEMENT_OL) {
      wrapNodes(
        editor,
        {
          type: getPlatePluginType(spEditor, ELEMENT_LI),
          children: [],
        },
        { at: pathOnly ? pathOnly : tempPath }
      );
      wrapNodes(
        editor,
        {
          type,
          children: [],
        },
        { at: pathOnly ? pathOnly : tempPath }
      );
    }
  }

  if (action === SELECT_ACTIONS.REMOVE_BLOCK) {
    const nodePath = ReactEditor.findPath(editor as ReactEditor, options.node);
    const parentEntry = getParent(editor, nodePath);
    if (!parentEntry) return;
    const [parentNode] = parentEntry;

    if (
      isElement(parentNode) &&
      isType(editor as SPEditor, parentNode, 'layout_item')
    ) {
      // The node to remove is in a layout
      const layoutItemNode = parentNode;
      const layoutNode = Editor.parent(editor, parentNode[1]);
      if (layoutNode[0].children.length === 1) {
        // This case shouldn't occur because of processing
        // previously done for (layoutNode as any).children.length === 2

        // Remove the target element then
        Transforms.removeNodes(editor, {
          at: layoutNode[1]
        });
      } else if (layoutNode[0].children.length === 2) {
        // After the removal, only one node will remain in the layout
        // so unwrap the remaining node from the layout

        // Remove the target element
        Transforms.removeNodes(editor, {
          at: layoutItemNode[1]
        });

        // Unwrap twice to remove both layout_item and layout level
        // since only one node remains in the layout

        unwrapNodes(
          editor,
          {
            at: layoutNode[1]
          }
        );

        unwrapNodes(
          editor,
          {
            at: layoutNode[1],
            match: (node) => node.type === 'layout_item'
          }
        );
      } else {
        Transforms.removeNodes(editor, {
          at: layoutItemNode[1]
        });
      }
    } else {
      // The node to remove isn't in a layout
      Transforms.removeNodes(editor, {
        at: nodePath
      });
    }
    ReactEditor.focus(editor as ReactEditor);
  }

  if (action === SELECT_ACTIONS.TURN_INTO_BLOCK) {
    const { type } = options;
    let actualType = type;
    const nodePath = ReactEditor.findPath(editor as ReactEditor, options.node);
    // Get the last value of the node from State. The one provided in options wasn't updated
    // in all cases (specially when using the app from tests).
    const node: any = getNode(editor, nodePath);
    if (type === 'sql') {
      // turn into SQL node
      const text = node.children[0].text;
      Transforms.removeNodes(editor, {
        at: nodePath
      });
      insertNodes(editor, {
        type: getPlatePluginType(spEditor, type || ELEMENT_PARAGRAPH),
        name: type === 'sql' ? 'Untitled query' : null,
        children: [{ text: ' ' }],
        sql: text
      }, {
        at: nodePath
      });
      ReactEditor.focus(editor as ReactEditor);
      if (nodePath) {
        const startPoint = Editor.start(editor, nodePath);
        Transforms.select(editor, startPoint);
      }
    } else if (type === ELEMENT_UL || type === ELEMENT_OL) {
      if (node.type !== ELEMENT_UL && node.type !== ELEMENT_OL) {
        wrapNodes(
          editor,
          {
            type: getPlatePluginType(spEditor, ELEMENT_LI),
            children: [],
          },
          { at: nodePath }
        );
        wrapNodes(
          editor,
          {
            type,
            children: [],
          },
          { at: nodePath }
        );
      } else {
        setNodes(
          editor,
          {
            type,
          },
          { at: nodePath }
        );
      }
    } else {
      if (node.type === 'sql') {
        // turn from SQL node
        const text = node.sql;
        const lines = text.split('\n').reverse();
        Transforms.removeNodes(editor, {
          at: nodePath
        });
        insertNodes(editor, {
          type,
          children: [ { text: lines.join('\n') } ]
        }, {
          at: nodePath
        });
        ReactEditor.focus(editor as ReactEditor);
        if (nodePath) {
          const startPoint = Editor.start(editor, nodePath);
          Transforms.select(editor, startPoint);
        }
      } else if (node.type === ELEMENT_UL || node.type === ELEMENT_OL) {
        const children = node.children;
        unwrapNodes(
          editor,
          {
            at: nodePath
          }
        );

        let currentPath = nodePath;
        for (const child of children) {
          unwrapNodes(
            editor,
            {
              at: currentPath
            }
          );
          const afterPath = Editor.after(editor, currentPath);
          if (!afterPath) {
            break;
          }
          currentPath = afterPath?.path.slice(0, 2);
        }
      } else {
        setNodes(editor, {
          ...node,
          type
        }, {
          at: nodePath
        });
      }
    }
  }

  if (action === SELECT_ACTIONS.DUPLICATE_BLOCK) {
    const { node } = options;
    const nodePath = ReactEditor.findPath(editor as ReactEditor, options.node);

    const newPath = Editor.after(editor, nodePath);

    insertNodes(editor, {
      ...node,
      // sanitize node
      comment_threads: [],
      block_id: null,
      id: new Date().getTime(),
      uid: null,
      results: []
    }, { at: newPath });

    ReactEditor.focus(editor as ReactEditor);
    if (newPath) {
      const startPoint = Editor.start(editor, newPath);
      Transforms.select(editor, startPoint);
    }
  }
}
