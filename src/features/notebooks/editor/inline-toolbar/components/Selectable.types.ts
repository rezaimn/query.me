import React from 'react';
import { IStyle } from '@uifabric/styling';
import { IStyleFunctionOrObject } from '@uifabric/utilities';
import { Element, Path, Editor } from 'slate';
import { RenderElementProps } from 'slate-react';
import { INotebook, INotebookPage, INotebookPageBlock } from '../../../../../shared/models';

export interface ElementWithBlockId extends Element {
  id: string;
  block_id: string;
}

export interface SelectableProps
  extends Pick<RenderElementProps, 'attributes'> {
  /**
   * Additional class name to provide on the root element, in addition to the slate-Selectable class.
   */
  className?: string;

  /**
   * Call to provide customized styling that will layer on top of the variant rules.
   */
  styles?: IStyleFunctionOrObject<SelectableStyleProps, SelectableStyles>;

  type: string;

  children?: any;

  componentRef?: any;

  dragIcon?: React.ReactNode;

  element: ElementWithBlockId;

  path: Path;

  onCommand: (editor: Editor, path: Path, action: string, options?: any) => void;

  createNewPageAndAddCurrentBlockToIt: (notebook:INotebook|null,block: INotebookPageBlock, currentPage: INotebookPage) => void;

  moveCurrentBlockToSelectedPage: (currentPage: INotebookPage | null, targetPage: INotebookPage, block: INotebookPageBlock) => void;
}

export interface SelectableStyleProps {
  className?: string;
  direction: '' | 'top' | 'bottom' | 'left' | 'right';
  isDragging: boolean;

  // TODO: tbd
  selected?: boolean;
}

export interface SelectableStyles {
  /**
   * Contains the gutter left, block, dropline.
   */
  root?: IStyle;

  /**
   * Block and gutter.
   */
  blockAndGutter?: IStyle;

  /**
   * Block.
   */
  block?: IStyle;

  /**
   * Gutter at the left side of the editor.
   * It has the height of the block
   */
  gutterLeft?: IStyle;

  /**
   * Gutter at the right side of the editor.
   * It has the height of the block
   */
  gutterRight?: IStyle;


  /**
   * Small container at the top of the right gutter
   * its purpose is to allow the popover to be positioned underneath it
   * It has the height of 20px
   */
  gutterTopIconContainer?: IStyle;

  /**
  *
  */
  blockSectionFullScreen?: IStyle;

  /**
   * iconContainer.
   */
  iconContainer?: IStyle;

  /**
   * Block toolbar wrapper in the gutter left.
   * It has the height of a line of the block.
   */
  blockToolbarWrapper?: IStyle;

  /**
   * Block toolbar in the gutter.
   */
  blockToolbar?: IStyle;

  /**
   * Block toolbar in the gutter in full screen mode
   */
  blockToolbarFullScreen?: IStyle;
  /**
   * Button to dnd the block, in the block toolbar.
   */
  dragButton?: IStyle;

  /**
   * Icon of the drag button, in the drag icon.
   */
  dragIcon?: IStyle;

  /**
   * Show a dropline above or below the block when dragging a block.
   */
  dropLine?: IStyle;
}

export interface DragItemBlock {
  id: string;
  type: string;
}

export type DropDirection = 'top' | 'bottom' | 'left' | 'right' | undefined;
