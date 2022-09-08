import { DropTargetMonitor, XYCoord } from 'react-dnd';
import { DragItemBlock, DropDirection } from '../components/Selectable.types';

/**
 * If dragging a block A over another block B:
 * get the direction of block A relative to block B.
 */
export const getHoverDirection = (
  dragItem: DragItemBlock,
  monitor: DropTargetMonitor,
  ref: any,
  hoverId: string
): DropDirection => {
  if (!ref.current) return;

  const dragId = dragItem.id;

  // Don't replace items with themselves
  if (dragId === hoverId) return;

  // Determine rectangle on screen
  const hoverBoundingRect = ref.current?.getBoundingClientRect();

  // Get vertical middle
  const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

  // Get horizontal middle
  const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

  // Determine mouse position
  const clientOffset = monitor.getClientOffset();
  if (!clientOffset) return;

  // Get pixels to the top
  const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
  const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;

  // Only perform the move when the mouse has crossed half of the items height
  // When dragging downwards, only move when the cursor is below 50%
  // When dragging upwards, only move when the cursor is above 50%

  const marginsForDirection = {
    left: 110,
    right: 230
  };

  // Necessary if blocks is small (i.e. within an item layout for example)
  if (hoverBoundingRect.width < 700) {
    marginsForDirection.right = 60;
  }

  // Disabled left and right direction to disable layout support
  // Uncomment the following lines to enable it

  // Dragging downwards
  /* if (hoverClientX <= marginsForDirection.left) {
    return 'left';
  }
  if (hoverClientX > hoverBoundingRect.width - marginsForDirection.right) {
    return 'right';
  } */
  // if (dragId < hoverId && hoverClientY < hoverMiddleY) {
  if (hoverClientY < hoverMiddleY) {
    return 'top';
  }

  // Dragging upwards
  // if (dragId > hoverId && hoverClientY > hoverMiddleY) {
  if (hoverClientY >= hoverMiddleY) {
    return 'bottom';
  }
};
