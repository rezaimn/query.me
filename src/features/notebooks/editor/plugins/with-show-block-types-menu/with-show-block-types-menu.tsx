import { KeyboardHandler } from '@udecode/plate-core';
import isHotkey from 'is-hotkey';
import { IOpenPlusMenu } from './types';

export const withShowBlockTypesMenu = ({ rules = [{ hotkey: 'mod+.' }] }: IOpenPlusMenu = {}): KeyboardHandler => (editor) => (event) => {
  if (isHotkey('mod+.', event)) {
    event.preventDefault();
    if (editor.selection) {
      document.getElementById('action_' + editor?.children[editor?.selection.anchor.path[0]].uid)?.click();
    }
  }
};

