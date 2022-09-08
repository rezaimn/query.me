import { Editor, Location, Range, Text, Path, Transforms, Element } from 'slate';
import { ReactEditor } from 'slate-react';
import { getNode, getNodes, isElement } from '@udecode/plate';

/*
Returns the `boundingClientRect` of the passed selection.
*/
export const getSelectionRect = (selected: any) => {
  const _rect = selected.getRangeAt(0).getBoundingClientRect();
  // selected.getRangeAt(0).getBoundingClientRect()
  let rect = _rect && _rect.top ? _rect : selected.getRangeAt(0).getClientRects()[0];
  if (!rect) {
    if (selected.anchorNode && selected.anchorNode.getBoundingClientRect) {
      rect = selected.anchorNode.getBoundingClientRect();
      rect.isEmptyline = true;
    } else {
      return null;
    }
  }
  return rect;
};

/*
Returns the native selection node.
*/
export const getSelection = (root: any) => {
  let t = null;
  if (root.getSelection) {
    t = root.getSelection();
  } else if (root.document.getSelection) {
    t = root.document.getSelection();
  } else if (root.document.selection) {
    t = root.document.selection.createRange().text;
  }
  return t;
};

/*
Recursively finds the DOM Element of the block where the cursor is currently present.
If not found, returns null.
*/
export const getSelectedBlockNode = (root: any) => {
  const selection = root.getSelection();
  if (selection.rangeCount === 0) {
    return null;
  }
  let node = selection.getRangeAt(0).startContainer;
  do {
    if (node.getAttribute && node.getAttribute('data-block') === 'true') {
      return node;
    }
    node = node.parentNode;
  } while (node !== null);
  return null;
};

export const getSelectedSqlLinesInBlock = (
  editor: Editor, blockId: string
): string | null => {
  if (editor.selection) {
    const { path } = editor.selection.anchor;
    const node = getNode(editor, [ path[0], path[1] ]) as any;

    if (!node || node.type !== 'sql' || node.id !== blockId) {
      return null;
    }
    return getSelectedSqlLinesAt(editor, editor.selection);
  }
  return null;
};

export const getBlocksOfType = (
  editor: Editor, type: string
) => {
  return getNodes(editor, { match: (n) => n.type === type });
};

export const getSelectedSqlLinesAt = (
  editor: Editor, at: Location,
  options: {
    voids?: boolean
  } = {}
): string => {
  const { voids = false } = options
  const range = Editor.range(editor, at)
  const [start, end] = Range.edges(range)
  let text = ''

  for (const [node, path] of Editor.nodes(editor, {
    at: range,
    match: Text.isText,
    voids,
  })) {
    let t = node.text

    if (Path.equals(path, end.path)) {
      t = t.slice(0, end.offset)
    }

    if (Path.equals(path, start.path)) {
      t = t.slice(start.offset)
    }

    text += text ? '\n' + t : t
  }

  return text
}

export const updateElementProps = (editor: any, element: any, key: string, value: any) => {
  const path = ReactEditor.findPath(editor, element);

  if (!path) {
    return;
  }

  try {
    Transforms.setNodes(
      editor,
      {
        [key]: value
      },
      {
        at: path,
      }
    );
  } catch (error) {
    console.log('Update Element Props error', error);
  }
};

const DEFAULT_NAME_REGEX = /(query_[0-9]+)|(chart_[0-9]+)|(parameter_[0-9]+)/;
const DEFAULT_NAME_WITHOUT_INDEX_REGEX = /query_|chart_|parameter_/;

export const generateBlockDefaultName = (type: string, editor: Editor) => {
  const matchingBlocks = Editor.nodes(editor, {
    at: [0],
    match: (node: any) => isElement(node) && node.type === type,
    mode: 'highest'
  });

  let blockNameIndex = 0;
  let extractedBlockNameIndex = 0;
  for (const [matchingBlock] of matchingBlocks) {
    blockNameIndex++;
    const name = (matchingBlock as any).name as string;
    if (DEFAULT_NAME_REGEX.test(name)) {
      const matchingBlockNameIndex = Number(name.replace(DEFAULT_NAME_WITHOUT_INDEX_REGEX, ''));
      if (matchingBlockNameIndex > extractedBlockNameIndex) {
        extractedBlockNameIndex = matchingBlockNameIndex + 1;
      }
    }
  }
  blockNameIndex++;
  if (extractedBlockNameIndex > blockNameIndex) {
    blockNameIndex = extractedBlockNameIndex;
  }
  return  type === 'sql' ? `query_${blockNameIndex}` :
  (type === 'plotly' ? `chart_${blockNameIndex}` :
      (type === 'parameter' ? `parameter_${blockNameIndex}` : null));
};
export const removeLink = (editor:any) => {
  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) && isElement(n) && n.type === 'a',
  })
};

export const isJsonString = (str: string) => {
  if(str){
    try {
      const json = JSON.parse(str);
      return (typeof json === 'object');
    } catch (e) {
      return false;
    }
  }
  return false;
}
