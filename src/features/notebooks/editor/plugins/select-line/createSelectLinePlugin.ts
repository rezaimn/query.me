import { PlatePlugin } from '@udecode/plate-core';
import { getSelectLineOnKeyDown } from './getSelectLineOnKeyDown';
import { ISelectLine } from './types';

export const creatSelectLinePlugin = (
  options: ISelectLine
): PlatePlugin => ({
  onKeyDown: getSelectLineOnKeyDown(options),
});
