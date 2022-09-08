import { PlatePlugin, getRenderElement } from '@udecode/plate';
import { ELEMENT_PLOTLY } from './defaults';
// import { decorateCodeBlock } from './decorateCodeBlock';

export const createPlotlyPlugin = (options?: any): PlatePlugin => ({
  renderElement: getRenderElement(ELEMENT_PLOTLY),
  // voidTypes: [ELEMENT_PLOTLY],
  // decorate: decorateCodeBlock(),
});
