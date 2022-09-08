import { PlatePlugin, getRenderElement } from '@udecode/plate';
import { ELEMENT_LAYOUT, ELEMENT_LAYOUT_ITEM } from './defaults';

export const createLayoutPlugin = (options?: any): PlatePlugin => ({
  renderElement: getRenderElement([ELEMENT_LAYOUT, ELEMENT_LAYOUT_ITEM]),
});
