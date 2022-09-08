import { DropTargetMonitor, useDrop } from 'react-dnd';
import { findNode, isExpanded } from '@udecode/plate-common';
import { Path, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { DragItemBlock } from '../types';
import { getHoverDirection } from '../utils/getHoverDirection';
import { getNewDirection } from '../utils/getNewDirection';
import { findNodeById } from './findNode';

export const useDropBlockOnEditor = (
  editor: ReactEditor,
  {
    blockRef,
    id,
    dropLine,
    setDropLine,
  }: {
    blockRef: any;
    id: string;
    dropLine: string;
    setDropLine: Function;
  }
) => {
  return useDrop({
    accept: 'block',
    drop: (dragItem: DragItemBlock, monitor: DropTargetMonitor) => {
      // debugger;
      const direction = getHoverDirection(dragItem, monitor, blockRef, id);
      if (!direction) return;

      const dragEntry = findNode(editor, {
        at: [],
        match: { id: dragItem.id },
      });
      // const dragEntry = findNodeById(editor, { id: dragItem.id });
      console.log('>> useDrop')
      if (!dragEntry) return;
      const [, dragPath] = dragEntry;
      console.log('  >> dragPath = ', dragPath)

      ReactEditor.focus(editor);

      let dropPath: Path | undefined;
      console.log('  >> direction = ', direction)
      if (direction === 'bottom') {
        dropPath = findNode(editor, { at: [], match: { id } })?.[1];
        // dropPath = findNodeById(editor, { id });
        console.log('  >> dropPath = ', dropPath)
        if (!dropPath) return;

        if (Path.equals(dragPath, Path.next(dropPath))) return;
      }

      if (direction === 'top') {
        const nodePath = findNode(editor, { at: [], match: { id } })?.[1];
        // const nodePath = findNodeById(editor, { id });
        console.log('  >> nodePath = ', nodePath)

        if (!nodePath) return;
        dropPath = [
          ...nodePath.slice(0, -1),
          nodePath[nodePath.length - 1] - 1,
        ];
        console.log('  >> nodePath = ', nodePath)

        if (Path.equals(dragPath, dropPath)) return;
      }

      if (direction) {
        const _dropPath = dropPath as Path;

        const before =
          Path.isBefore(dragPath, _dropPath) &&
          Path.isSibling(dragPath, _dropPath);
        const to = before ? _dropPath : Path.next(_dropPath);
        console.log('  >> before = ', before)
        console.log('  >> _dropPath = ', _dropPath)
        console.log('  >> Path.next(_dropPath) = ', Path.next(_dropPath))
        console.log('  >> to = ', to)
        console.log('  >> dragPath = ', dragPath)

        Transforms.moveNodes(editor, {
          at: dragPath,
          to: Array.isArray(to) ? to : [to],
          // to: to,
        });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    hover(item: DragItemBlock, monitor: DropTargetMonitor) {
      const direction = getHoverDirection(item, monitor, blockRef, id);
      const dropLineDir = getNewDirection(dropLine, direction);
      if (dropLineDir) setDropLine(dropLineDir);

      if (direction && isExpanded(editor.selection)) {
        ReactEditor.focus(editor);
        Transforms.collapse(editor);
      }
    },
  });
};
