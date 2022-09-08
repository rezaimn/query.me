import { PlatePlugin, getRenderElement } from '@udecode/plate';
import { ELEMENT_SQL } from './types';

export const createSqlPlugin = (options?: any): PlatePlugin => ({
  renderElement: getRenderElement(ELEMENT_SQL),
});
