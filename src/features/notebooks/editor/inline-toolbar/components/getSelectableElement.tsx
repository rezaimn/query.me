import React, { forwardRef, useMemo } from 'react';
import { IStyleFunctionOrObject } from '@uifabric/utilities';
import { Editor, Path } from 'slate';
import {
  ReactEditor,
  RenderElementProps,
  useEditor,
  useReadOnly,
} from 'slate-react';
import { Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import { Selectable } from './Selectable';
import {
  ElementWithBlockId,
  SelectableStyleProps,
  SelectableStyles,
} from './Selectable.types';
import { INotebook, INotebookPage, INotebookPageBlock } from '../../../../../shared/models';

type CreateNewPageAndAddCurrentBlockToItCallback = (notebook: INotebook | null, block: INotebookPageBlock, currentPage: INotebookPage) => void;
type MoveCurrentBlockToSelectedPageCallback = (currentPage: INotebookPage | null, targetPage: INotebookPage, block: INotebookPageBlock) => void;

export interface GetSelectableElementOptions {
  component: any;
  type: string;
  styles?: IStyleFunctionOrObject<SelectableStyleProps, SelectableStyles>;
  level?: number;
  filter?: (editor: Editor, path: Path) => boolean;
  allowReadOnly?: boolean;
  // dragIcon?: React.ReactNode;
  onCommand: (editor: Editor, path: Path, action: string, options?: any) => void;
  createNewPageAndAddCurrentBlockToIt: CreateNewPageAndAddCurrentBlockToItCallback;
  moveCurrentBlockToSelectedPage: MoveCurrentBlockToSelectedPageCallback;
}

export const getSelectableElement = ({
  component: Component,
  type,
  styles,
  level,
  filter,
  allowReadOnly = false,
  onCommand,
  createNewPageAndAddCurrentBlockToIt,
  moveCurrentBlockToSelectedPage
}: GetSelectableElementOptions) => {
  return forwardRef(
    ({ attributes, element, ...props }: RenderElementProps, ref) => {
      const editor = useEditor();
      const readOnly = useReadOnly();
      const path = useMemo(() => ReactEditor.findPath(editor, element), [
        editor,
        element,
      ]);
      let filteredOut = useMemo(
        () => (filter && filter(editor, path)),
        [path, editor]
      );

      if (filteredOut) {
        return (
          <Component attributes={attributes} element={element} {...props} />
        );
      }
      return (
        <Selectable
          attributes={attributes}
          componentRef={ref}
          type={type}
          element={element as ElementWithBlockId}
          styles={styles}
          path={path}
          dragIcon={<Icon icon={IconNames.DRAG_HANDLE_VERTICAL} />}
          onCommand={onCommand}
          createNewPageAndAddCurrentBlockToIt={createNewPageAndAddCurrentBlockToIt}
          moveCurrentBlockToSelectedPage={moveCurrentBlockToSelectedPage}
        >
          <Component attributes={attributes} element={element} {...props} />
        </Selectable>
      );
    }
  );
};
