import { PlatePlugin } from '@udecode/plate-core';
import { withShowBlockTypesMenu } from './with-show-block-types-menu';
import { IOpenPlusMenu } from './types';

export const createWithShowBlockTypePlugin = (
  options: IOpenPlusMenu,
): PlatePlugin => ({
  onKeyDown: withShowBlockTypesMenu(options),
});
