import { PlatePlugin, getRenderElement } from '@udecode/plate';
import { ELEMENT_PARAMETER } from './defaults';

export const createParameterPlugin = (options?: any): PlatePlugin => ({
  renderElement: getRenderElement(ELEMENT_PARAMETER),
});
