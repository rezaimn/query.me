import { Transforms, Editor, Location } from 'slate';
import { getBlockAbove, queryNode, getLastNode, QueryNodeOptions } from '@udecode/plate-common';
import { KeyboardHandler } from '@udecode/plate-core';
import isHotkey from 'is-hotkey';
import { ISelectAll } from './types';

export const getSelectAllOnKeyDown = ({
  rules = [{ hotkey: 'mod+shift+a' }],
}: ISelectAll = {}): KeyboardHandler => (editor) => (event) => {
  const entry = getBlockAbove(editor);
  if (!entry) return;

  rules.forEach(({ hotkey, query }: { hotkey: string; query: QueryNodeOptions | undefined }) => {
    if (isHotkey(hotkey, event as any) && queryNode(entry, query)) {
      event.preventDefault();

      const lastNodePath = getLastNode(editor, 1)?.[1]; // get last node in editor

      if (!lastNodePath) {
        return;
      }

      const lastNodeRange = Editor.range(editor, lastNodePath as Location);

      const anchor = { path: [0 ,0, 0], offset: 0 }; // first node of the editor
      let focus = lastNodeRange.focus;

      if (anchor && focus) {
        const range = { anchor, focus };

        Transforms.select(editor, range);
      }
    }
  });
};
