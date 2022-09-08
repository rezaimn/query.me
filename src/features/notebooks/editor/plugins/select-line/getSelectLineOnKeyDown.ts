import { Transforms, Editor, Location } from 'slate';
import { getBlockAbove, queryNode, getLastNode, QueryNodeOptions } from '@udecode/plate-common';
import { KeyboardHandler } from '@udecode/plate-core';
import isHotkey from 'is-hotkey';
import { ISelectLine } from './types';

export const getSelectLineOnKeyDown = ({
  rules = [{ hotkey: 'mod+a' }],
}: ISelectLine = {}): KeyboardHandler => (editor) => (event) => {
  const entry = getBlockAbove(editor);
  if (!entry) return;

  rules.forEach(({ hotkey, query }: { hotkey: string; query: QueryNodeOptions | undefined }) => {
    if (isHotkey(hotkey, event as any) && queryNode(entry, query)) {
      event.preventDefault();

      const start = Editor.start(editor, editor.selection as Location);
      if (start) {
        const range = Editor.range(editor, start.path as Location);

        Transforms.select(editor, range);
      }
    }
  });
};
