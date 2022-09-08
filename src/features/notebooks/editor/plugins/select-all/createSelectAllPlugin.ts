import { PlatePlugin } from '@udecode/plate-core';
import { getSelectAllOnKeyDown } from './getSelectAllOnKeyDown';
import { ISelectAll } from './types'

export const createSelectAllPlugin = (
  options: ISelectAll
): PlatePlugin => ({
  onKeyDown: getSelectAllOnKeyDown(options),
});
