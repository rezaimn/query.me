import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  bem,
  localizeString,
  plotlyTraceToCustomTrace,
  traceTypeToPlotlyInitFigure,
  hasValidCustomConfigVisibilityRules,
} from '../../../../../../libs/react-chart-editor';
import {
  shamefullyClearAxisTypes,
  shamefullyAdjustAxisRef,
  shamefullyAdjustGeo,
  shamefullyAddTableColumns,
  shamefullyCreateSplitStyleProps,
  shamefullyAdjustSplitStyleTargetContainers,
  shamefullyDeleteRelatedAnalysisTransforms,
  shamefullyAdjustSizeref,
  shamefullyAdjustAxisDirection,
  shamefullyAdjustMapbox,
  PROPERTIES_LINKED_TO_SQL_BLOCK
} from '../../../../../../libs/react-chart-editor';
import { EDITOR_ACTIONS } from '../../../../../../libs/react-chart-editor';
import isNumeric from 'fast-isnumeric';
import { nestedProperty } from './nested_property';
import { categoryLayout, traceTypes } from '../../../../../../libs/react-chart-editor';
import { ModalProvider } from '../../../../../../libs/react-chart-editor';
import { DEFAULT_FONTS } from '../../../../../../libs/react-chart-editor';
import { Editor } from 'slate';

import DefaultEditor from './DefaultEditor';

type EditorControlsProps = {
  graphDiv?: any;
  dictionaries?: any;
  locale?: any;
  plotly?: any;
  advancedTraceTypeSelector?: any;
  srcConverters?: any;
  dataSourceComponents?: any;
  dataSourceOptions?: any;
  dataSources?: any;
  traceTypesConfig?: any;
  showFieldTooltips?: any;
  glByDefault?: any;
  mapBoxAccess?: any;
  fontOptions?: any;
  chartHelp?: any;
  customConfig?: any;
  beforeUpdateTraces?: any;
  afterUpdateTraces?: any;
  onUpdate?: any;
  beforeUpdateLayout?: any;
  afterUpdateLayout?: any;
  beforeAddTrace?: any;
  makeDefaultTrace?: any;
  afterAddTrace?: any;
  beforeDeleteTrace?: any;
  afterDeleteTrace?: any;
  beforeDeleteAnnotation?: any;
  afterDeleteAnnotation?: any;
  beforeDeleteImage?: any;
  afterDeleteImage?: any;
  beforeDeleteShape?: any;
  afterDeleteShape?: any;
  className?: string;
  children?: any;
  slateEditor: Editor;
};

type EditorControlsState = {
};

function move(container: any, payload: any) {
  const movedEl = container[payload.fromIndex];
  const replacedEl = container[payload.toIndex];
  container[payload.toIndex] = movedEl;
  container[payload.fromIndex] = replacedEl;
}

class EditorControls extends Component<EditorControlsProps, EditorControlsState> {
  localize: (key: string) => string;
  plotSchema: any;

  static propTypes: {
  }

  static defaultProps: {
  }

  static childContextTypes: {

  }

  constructor(props: any, context: any) {
    super(props, context);

    this.localize = (key: string) => localizeString(this.props.dictionaries || {}, this.props.locale, key);

    // we only need to compute this once.
    if (this.props.plotly) {
      this.plotSchema = this.props.plotly.PlotSchema.get();
    }
  }

  getChildContext() {
    const gd = this.props.graphDiv || {};
    return {
      advancedTraceTypeSelector: this.props.advancedTraceTypeSelector,
      config: gd._context,
      srcConverters: this.props.srcConverters,
      data: gd.data,
      dataSourceComponents: this.props.dataSourceComponents,
      dataSourceOptions: this.props.dataSourceOptions,
      dataSources: this.props.dataSources,
      dictionaries: this.props.dictionaries || {},
      localize: this.localize,
      frames: gd._transitionData ? gd._transitionData._frames : [],
      fullData: gd._fullData,
      fullLayout: gd._fullLayout,
      graphDiv: gd,
      layout: gd.layout,
      locale: this.props.locale,
      onUpdate: this.handleUpdate.bind(this),
      plotSchema: this.plotSchema,
      plotly: this.props.plotly,
      traceTypesConfig: this.props.traceTypesConfig,
      showFieldTooltips: this.props.showFieldTooltips,
      glByDefault: this.props.glByDefault,
      mapBoxAccess: this.props.mapBoxAccess,
      fontOptions: this.props.fontOptions,
      chartHelp: this.props.chartHelp,
      customConfig: this.props.customConfig,
      hasValidCustomConfigVisibilityRules: hasValidCustomConfigVisibilityRules(
        this.props.customConfig
      ),
    };
  }

  handleUpdate({type, payload}: {type: string; payload: any}) {
    let {graphDiv} = this.props;

    switch (type) {
      case EDITOR_ACTIONS.UPDATE_TRACES:
        if (this.props.beforeUpdateTraces) {
          this.props.beforeUpdateTraces(payload);
        }

        graphDiv.data = JSON.parse(JSON.stringify(graphDiv.data));
        graphDiv.layout = JSON.parse(JSON.stringify(graphDiv.layout));
        // graphDiv.frames = JSON.parse(JSON.stringify(graphDiv.frames));

        shamefullyAdjustSizeref(graphDiv, payload);
        shamefullyAdjustAxisDirection(graphDiv, payload);
        shamefullyClearAxisTypes(graphDiv, payload);
        shamefullyAdjustAxisRef(graphDiv, payload);
        shamefullyAddTableColumns(graphDiv, payload);
        shamefullyAdjustSplitStyleTargetContainers(graphDiv, payload);
        if (!this.props.mapBoxAccess) {
          shamefullyAdjustMapbox(graphDiv, payload);
        }

        for (let i = 0; i < payload.traceIndexes.length; i++) {
          for (const attr in payload.update) {
            const traceIndex = payload.traceIndexes[i];

            const splitTraceGroup = payload.splitTraceGroup
              ? payload.splitTraceGroup.toString()
              : null;

            let props = [nestedProperty(graphDiv.data[traceIndex], attr)];
            const value = payload.update[attr];

            if (splitTraceGroup) {
              props = shamefullyCreateSplitStyleProps(graphDiv, attr, traceIndex, splitTraceGroup);
            }

            props.forEach((p) => {
              if (value !== void 0) {
                p.set(value);
              }
            });

          }

          // reset field if the selected sql block changes
          if (payload.update.sqlBlock) {
            const traceIndex = payload.traceIndexes[i];
            const traceData = graphDiv.data[traceIndex];
            Object.keys(traceData).forEach((traceDataKey) => {
              if (PROPERTIES_LINKED_TO_SQL_BLOCK.includes(traceDataKey)) {
                const p = nestedProperty(traceData, traceDataKey);
                const columnName = p.obj[`${traceDataKey}src`];
                const { values } = p.obj;
                const columnValues = values[columnName];
                const currentValues = p.get();
                if (!Object.keys(values).includes(columnName)) {
                  p.set(null);
                } else if (JSON.stringify(columnValues) !== JSON.stringify(currentValues)) {
                  p.set(columnValues);
                }
              }
            });
          }
        }

        if (this.props.afterUpdateTraces) {
          this.props.afterUpdateTraces(payload);
        }
        if (this.props.onUpdate) {
          this.props.onUpdate(
            graphDiv.data.slice(),
            graphDiv.layout,
            graphDiv._transitionData._frames
          );
        }
        break;

      case EDITOR_ACTIONS.UPDATE_LAYOUT:
        graphDiv.data = JSON.parse(JSON.stringify(graphDiv.data));
        graphDiv.layout = JSON.parse(JSON.stringify(graphDiv.layout));
        // graphDiv.frames = JSON.parse(JSON.stringify(graphDiv.frames));

        shamefullyAdjustGeo(graphDiv, payload);

        if (this.props.beforeUpdateLayout) {
          this.props.beforeUpdateLayout(payload);
        }
        for (const attr in payload.update) {
          const prop = nestedProperty(graphDiv.layout, attr);
          const value = payload.update[attr];
          if (value !== void 0) {
            prop.set(value);
          }
        }
        if (this.props.afterUpdateLayout) {
          this.props.afterUpdateLayout(payload);
        }
        if (this.props.onUpdate) {
          this.props.onUpdate(
            graphDiv.data,
            Object.assign({}, graphDiv.layout),
            graphDiv._transitionData._frames
          );
        }
        break;

      case EDITOR_ACTIONS.ADD_TRACE:
        graphDiv.data = JSON.parse(JSON.stringify(graphDiv.data));
        graphDiv.layout = JSON.parse(JSON.stringify(graphDiv.layout));
        // graphDiv.frames = JSON.parse(JSON.stringify(graphDiv.frames));

        if (this.props.beforeAddTrace) {
          this.props.beforeAddTrace(payload);
        }

        // can't use default prop because plotly.js mutates it:
        // https://github.com/plotly/react-chart-editor/issues/509
        if (graphDiv.data.length === 0) {
          graphDiv.data.push(
            this.props.makeDefaultTrace
              ? this.props.makeDefaultTrace()
              : {
                  type: `scatter${this.props.glByDefault ? 'gl' : ''}`,
                  mode: 'markers',
                }
          );
        } else {
          const prevTrace = graphDiv.data[graphDiv.data.length - 1];
          const prevTraceType = plotlyTraceToCustomTrace(prevTrace);
          graphDiv.data.push(
            traceTypeToPlotlyInitFigure(
              prevTraceType,
              prevTrace.type && prevTrace.type.endsWith('gl') ? 'gl' : ''
            )
          );
        }

        if (this.props.afterAddTrace) {
          this.props.afterAddTrace(payload);
        }
        if (this.props.onUpdate) {
          this.props.onUpdate(
            graphDiv.data.slice(),
            graphDiv.layout,
            graphDiv._transitionData._frames
          );
        }
        break;

      case EDITOR_ACTIONS.DELETE_TRACE:
        if (payload.traceIndexes && payload.traceIndexes.length) {
          graphDiv.data = JSON.parse(JSON.stringify(graphDiv.data));
          graphDiv.layout = JSON.parse(JSON.stringify(graphDiv.layout));
          // graphDiv.frames = JSON.parse(JSON.stringify(graphDiv.frames));

          if (this.props.beforeDeleteTrace) {
            this.props.beforeDeleteTrace(payload);
          }

          shamefullyAdjustAxisRef(graphDiv, payload);
          shamefullyDeleteRelatedAnalysisTransforms(graphDiv, payload);

          graphDiv.data.splice(payload.traceIndexes[0], 1);
          if (this.props.afterDeleteTrace) {
            this.props.afterDeleteTrace(payload);
          }
          if (this.props.onUpdate) {
            this.props.onUpdate(
              graphDiv.data.slice(),
              graphDiv.layout,
              graphDiv._transitionData._frames
            );
          }
        }
        break;

      case EDITOR_ACTIONS.DELETE_ANNOTATION:
        if (isNumeric(payload.annotationIndex)) {
          graphDiv.data = JSON.parse(JSON.stringify(graphDiv.data));
          graphDiv.layout = JSON.parse(JSON.stringify(graphDiv.layout));
          // graphDiv.frames = JSON.parse(JSON.stringify(graphDiv.frames));

          if (this.props.beforeDeleteAnnotation) {
            this.props.beforeDeleteAnnotation(payload);
          }
          graphDiv.layout.annotations.splice(payload.annotationIndex, 1);
          if (this.props.afterDeleteAnnotation) {
            this.props.afterDeleteAnnotation(payload);
          }
          if (this.props.onUpdate) {
            this.props.onUpdate(
              graphDiv.data,
              Object.assign({}, graphDiv.layout),
              graphDiv._transitionData._frames
            );
          }
        }
        break;

      case EDITOR_ACTIONS.DELETE_SHAPE:
        if (isNumeric(payload.shapeIndex)) {
          graphDiv.data = JSON.parse(JSON.stringify(graphDiv.data));
          graphDiv.layout = JSON.parse(JSON.stringify(graphDiv.layout));
          // graphDiv.frames = JSON.parse(JSON.stringify(graphDiv.frames));

          if (this.props.beforeDeleteShape) {
            this.props.beforeDeleteShape(payload);
          }
          graphDiv.layout.shapes.splice(payload.shapeIndex, 1);
          if (this.props.afterDeleteShape) {
            this.props.afterDeleteShape(payload);
          }
          if (this.props.onUpdate) {
            this.props.onUpdate(
              graphDiv.data,
              Object.assign({}, graphDiv.layout),
              graphDiv._transitionData._frames
            );
          }
        }
        break;

      case EDITOR_ACTIONS.DELETE_IMAGE:
        if (isNumeric(payload.imageIndex)) {
          graphDiv.data = JSON.parse(JSON.stringify(graphDiv.data));
          graphDiv.layout = JSON.parse(JSON.stringify(graphDiv.layout));
          // graphDiv.frames = JSON.parse(JSON.stringify(graphDiv.frames));

          if (this.props.beforeDeleteImage) {
            this.props.beforeDeleteImage(payload);
          }
          graphDiv.layout.images.splice(payload.imageIndex, 1);
          if (this.props.afterDeleteImage) {
            this.props.afterDeleteImage(payload);
          }
          if (this.props.onUpdate) {
            this.props.onUpdate(
              graphDiv.data,
              Object.assign({}, graphDiv.layout),
              graphDiv._transitionData._frames
            );
          }
        }
        break;

      case EDITOR_ACTIONS.DELETE_RANGESELECTOR:
        if (isNumeric(payload.rangeselectorIndex)) {
          graphDiv.data = JSON.parse(JSON.stringify(graphDiv.data));
          graphDiv.layout = JSON.parse(JSON.stringify(graphDiv.layout));
          // graphDiv.frames = JSON.parse(JSON.stringify(graphDiv.frames));

          graphDiv.layout[payload.axisId].rangeselector.buttons.splice(
            payload.rangeselectorIndex,
            1
          );
          if (this.props.onUpdate) {
            this.props.onUpdate(
              graphDiv.data,
              Object.assign({}, graphDiv.layout),
              graphDiv._transitionData._frames
            );
          }
        }
        break;

      case EDITOR_ACTIONS.DELETE_MAPBOXLAYER:
        if (isNumeric(payload.mapboxLayerIndex)) {
          graphDiv.data = JSON.parse(JSON.stringify(graphDiv.data));
          graphDiv.layout = JSON.parse(JSON.stringify(graphDiv.layout));
          // graphDiv.frames = JSON.parse(JSON.stringify(graphDiv.frames));

          graphDiv.layout[payload.mapboxId].layers.splice(payload.mapboxLayerIndex, 1);
          if (this.props.onUpdate) {
            this.props.onUpdate(
              graphDiv.data,
              Object.assign({}, graphDiv.layout),
              graphDiv._transitionData._frames
            );
          }
        }
        break;

      case EDITOR_ACTIONS.DELETE_TRANSFORM:
        if (isNumeric(payload.transformIndex) && payload.traceIndex < graphDiv.data.length) {
          graphDiv.data = JSON.parse(JSON.stringify(graphDiv.data));
          graphDiv.layout = JSON.parse(JSON.stringify(graphDiv.layout));
          // graphDiv.frames = JSON.parse(JSON.stringify(graphDiv.frames));

          if (graphDiv.data[payload.traceIndex].transforms.length === 1) {
            delete graphDiv.data[payload.traceIndex].transforms;
          } else {
            graphDiv.data[payload.traceIndex].transforms.splice(payload.transformIndex, 1);
          }
          if (this.props.onUpdate) {
            this.props.onUpdate(
              graphDiv.data.slice(),
              graphDiv.layout,
              graphDiv._transitionData._frames
            );
          }
        }
        break;

      case EDITOR_ACTIONS.MOVE_TO:
        // checking if fromIndex and toIndex is a number because
        // gives errors if index is 0 (falsy value)
        if (payload.path && !isNaN(payload.fromIndex) && !isNaN(payload.toIndex)) {
          graphDiv.data = JSON.parse(JSON.stringify(graphDiv.data));
          graphDiv.layout = JSON.parse(JSON.stringify(graphDiv.layout));
          // graphDiv.frames = JSON.parse(JSON.stringify(graphDiv.frames));

          if (payload.path === 'data') {
            move(graphDiv.data, payload);
          }

          if (payload.path === 'layout.images') {
            move(graphDiv.layout.images, payload);
          }

          if (payload.path === 'layout.shapes') {
            move(graphDiv.layout.shapes, payload);
          }

          if (payload.path === 'layout.annotations') {
            move(graphDiv.layout.annotations, payload);
          }

          if (payload.path === 'layout.mapbox.layers') {
            move(graphDiv.layout[payload.mapboxId].layers, payload);
          }

          const updatedData = payload.path.startsWith('data')
            ? graphDiv.data.slice()
            : graphDiv.data;
          const updatedLayout = payload.path.startsWith('layout')
            ? Object.assign({}, graphDiv.layout)
            : graphDiv.layout;

          if (this.props.onUpdate) {
            this.props.onUpdate(updatedData, updatedLayout, graphDiv._transitionData._frames);
          }
        }
        break;

      default:
        throw new Error(this.localize('must specify an action type to handleEditorUpdate'));
    }
  }

  render() {
    return (
      <div
        className={
          bem('editor_controls') +
          ' plotly-editor--theme-provider' +
          `${this.props.className ? ` ${this.props.className}` : ''}`
        }
      >
        <ModalProvider>
          {this.props.graphDiv &&
            this.props.graphDiv._fullLayout &&
            (this.props.children ? this.props.children : <DefaultEditor slateEditor={this.props.slateEditor} />)}
        </ModalProvider>
      </div>
    );
  }
}

EditorControls.propTypes = {
  advancedTraceTypeSelector: PropTypes.bool,
  afterAddTrace: PropTypes.func,
  afterDeleteAnnotation: PropTypes.func,
  afterDeleteShape: PropTypes.func,
  afterDeleteImage: PropTypes.func,
  afterDeleteTrace: PropTypes.func,
  afterUpdateLayout: PropTypes.func,
  afterUpdateTraces: PropTypes.func,
  beforeAddTrace: PropTypes.func,
  beforeDeleteAnnotation: PropTypes.func,
  beforeDeleteShape: PropTypes.func,
  beforeDeleteImage: PropTypes.func,
  beforeDeleteTrace: PropTypes.func,
  beforeUpdateLayout: PropTypes.func,
  beforeUpdateTraces: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  srcConverters: PropTypes.shape({
    toSrc: PropTypes.func.isRequired,
    fromSrc: PropTypes.func.isRequired,
  }),
  dataSourceComponents: PropTypes.object,
  dataSourceOptions: PropTypes.array,
  dataSources: PropTypes.object,
  dictionaries: PropTypes.object,
  graphDiv: PropTypes.object,
  locale: PropTypes.string,
  onUpdate: PropTypes.func,
  plotly: PropTypes.object,
  showFieldTooltips: PropTypes.bool,
  traceTypesConfig: PropTypes.object,
  makeDefaultTrace: PropTypes.func,
  glByDefault: PropTypes.bool,
  mapBoxAccess: PropTypes.bool,
  fontOptions: PropTypes.array,
  chartHelp: PropTypes.object,
  customConfig: PropTypes.object,
  slateEditor: PropTypes.object
};

EditorControls.defaultProps = {
  showFieldTooltips: false,
  locale: 'en',
  traceTypesConfig: {
    categories: (_: any) => categoryLayout(_),
    traces: (_: any) => traceTypes(_),
    complex: true,
  },
  fontOptions: DEFAULT_FONTS,
};

EditorControls.childContextTypes = {
  advancedTraceTypeSelector: PropTypes.bool,
  config: PropTypes.object,
  srcConverters: PropTypes.shape({
    toSrc: PropTypes.func.isRequired,
    fromSrc: PropTypes.func.isRequired,
  }),
  data: PropTypes.array,
  dataSourceComponents: PropTypes.object,
  dataSourceOptions: PropTypes.array,
  dataSources: PropTypes.object,
  dictionaries: PropTypes.object,
  frames: PropTypes.array,
  fullData: PropTypes.array,
  fullLayout: PropTypes.object,
  graphDiv: PropTypes.any,
  layout: PropTypes.object,
  locale: PropTypes.string,
  localize: PropTypes.func,
  onUpdate: PropTypes.func,
  plotly: PropTypes.object,
  plotSchema: PropTypes.object,
  traceTypesConfig: PropTypes.object,
  showFieldTooltips: PropTypes.bool,
  glByDefault: PropTypes.bool,
  mapBoxAccess: PropTypes.bool,
  fontOptions: PropTypes.array,
  chartHelp: PropTypes.object,
  customConfig: PropTypes.object,
  hasValidCustomConfigVisibilityRules: PropTypes.bool
};

export default EditorControls;