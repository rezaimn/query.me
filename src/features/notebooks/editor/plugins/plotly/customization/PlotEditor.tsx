import React, { Component, Ref, Requireable } from 'react';
import createPlotComponent from 'react-plotly.js/factory';
import { PlotParams } from 'react-plotly.js';
import { DEFAULT_FONTS } from 'react-chart-editor';
import PropTypes from 'prop-types';
import { Position } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Editor } from 'slate';

import EditorControls from './EditorControls';
import { LeftDrawer } from '../../../../../../shared/components/layout/LeftDrawer';
import { DrawerContainer } from '../../../../../../shared/components/layout/Drawer';

type PlotlyEditorProps = {
  label: string;
  children?: any; // PropTypes.any,
  layout?: any; // PropTypes.object,
  data: any[]; // PropTypes.array,
  config?: any; // PropTypes.object,
  dataSourceOptions?: any[]; // PropTypes.array,
  dataSources?: any; // PropTypes.object,
  frames?: any; // PropTypes.array,
  onUpdate?: (data: any, layout: any, frames: any) => void; // PropTypes.func,
  onRender?: (data: any, layout: any, frames: any) => void; // PropTypes.func,
  plotly?: any; // PropTypes.object,
  useResizeHandler?: boolean; // PropTypes.bool,
  debug?: boolean; // PropTypes.bool,
  advancedTraceTypeSelector?: boolean; // PropTypes.bool,
  locale?: string; // PropTypes.string,
  traceTypesConfig?: any; // PropTypes.object,
  dictionaries?: any; // PropTypes.object,
  divId?: string; // PropTypes.string,
  hideControls?: boolean; // PropTypes.bool,
  showFieldTooltips?: boolean; // PropTypes.bool,
  srcConverters?: { // PropTypes.shape({
    toSrc: () => any; // PropTypes.func.isRequired,
    fromSrc: (input: any) => void // PropTypes.func.isRequired,
  };
  makeDefaultTrace?: () => void; // PropTypes.func,
  glByDefault?: boolean; // PropTypes.bool,
  fontOptions?: any[]; // PropTypes.array,
  chartHelp?: any; // PropTypes.object,
  customConfig?: any; // PropTypes.object,
  editorControlsDisplayed: boolean;
  onDisplayEditorControls: (displayed: boolean) => void;
  editGraphEnabled: boolean;
  onSetEditGraphEnabled: (editGraphEnabled: boolean) => void;
  slateEditor: Editor;
  ref: any;
};

type PlotlyEditorState = {
  graphDiv: any;
};

class PlotlyEditor extends Component<PlotlyEditorProps, PlotlyEditorState> {
  static propTypes: {
    label: Requireable<string>;
    children: Requireable<any>;
    layout: Requireable<any>;
    data: Requireable<any[]>;
    config: Requireable<any>;
    dataSourceOptions: Requireable<any[]>;
    dataSources: Requireable<any>;
    frames: Requireable<any[]>;
    onUpdate: Requireable<Function>;
    onRender: Requireable<Function>;
    plotly: Requireable<any>;
    useResizeHandler: Requireable<boolean>;
    debug: Requireable<boolean>;
    advancedTraceTypeSelector: Requireable<boolean>;
    locale: Requireable<string>;
    traceTypesConfig: Requireable<object>;
    dictionaries: Requireable<any>;
    divId: Requireable<string>;
    hideControls: Requireable<boolean>;
    showFieldTooltips: Requireable<boolean>;
    srcConverters: Requireable<any>;
    makeDefaultTrace: Requireable<Function>;
    glByDefault: Requireable<boolean>;
    fontOptions: Requireable<any[]>;
    chartHelp: Requireable<any>;
    customConfig: Requireable<any>;
    editorControlsDisplayed: Requireable<boolean>;
    onDisplayEditorControls: Requireable<Function>;
    editGraphEnabled: Requireable<boolean>;
    onSetEditGraphEnabled: Requireable<Function>;
    slateEditor: Requireable<any>;
  };

  static defaultProps: {
    hideControls: boolean;
    showFieldTooltips: boolean;
    fontOptions: any;
  };

  // PlotComponent: React.ComponentType<PlotParams>;
  PlotComponent: React.ComponentType<any>;
  plotlyComponentRef: React.RefObject<any>;

  constructor(props: any) {
    super(props);
    this.state = {
      graphDiv: {
        data: [],
        layout: {},
        frames: []
      }
    };
    this.PlotComponent = createPlotComponent(props.plotly);
    this.handleRender = this.handleRender.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.onCloseDetails = this.onCloseDetails.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.plotlyComponentRef = React.createRef<any>();
  }

  componentDidUpdate(prevProps: any) {
    const previousData = JSON.stringify(this.state.graphDiv.data);
    const previousLayout = JSON.stringify(this.state.graphDiv.layout);
    const previousFrames = JSON.stringify(this.state.graphDiv.frames);
    const currentData = JSON.stringify(prevProps.data);
    const currentLayout = JSON.stringify(prevProps.layout);
    const currentFrames = JSON.stringify(prevProps.frames);
    if (
      previousData !== currentData ||
      previousLayout !== currentLayout ||
      previousFrames !== currentFrames
    ) {
      this.setState(({graphDiv}) => ({
        graphDiv: {
          ...graphDiv,
          data: prevProps.data,
          layout: prevProps.layout,
          frames: prevProps.frames,
          _transitionData: {
            _frames: prevProps.frames
          }
        }
      }));
    }
  }

  handleResize() {
    if (this.plotlyComponentRef.current && this.plotlyComponentRef.current.resizeHandler) {
      this.plotlyComponentRef.current.resizeHandler();
    }
  }

  handleRender(fig: any, graphDiv: any) {
    this.setState({graphDiv});
    if (this.props.onRender) {
      this.props.onRender(graphDiv.data, graphDiv.layout, graphDiv._transitionData._frames);
    }
  }

  onToggle() {
    this.props.onSetEditGraphEnabled(true);
    setTimeout(() => {
      this.props.onDisplayEditorControls(!this.props.editorControlsDisplayed);
    }, 200);
  }

  onCloseDetails() {
    this.props.onDisplayEditorControls(false);
    setTimeout(() => {
      this.props.onSetEditGraphEnabled(false);
    }, 200);
  }

  render() {
    return (
      <div className="plotly_editor">
        {
          this.props.editGraphEnabled && (
            <LeftDrawer>
              <DrawerContainer
                label={this.props.label}
                icon={IconNames.CHART}
                position={Position.LEFT}
                isOpen={this.props.editorControlsDisplayed}
                noIconBackground={true}
                width="400px"
                headerClassName="plotly_editor_controls_header"
                canOutsideClickClose={false}
                closeIcon={IconNames.TICK}
                closeIconSize={16}
                onClose={this.onCloseDetails}
              >
                <div className="editor_controls_wrapper" onClick={(event: any) => event.stopPropagation()}>
                  <EditorControls
                    graphDiv={this.state.graphDiv}
                    dataSources={this.props.dataSources}
                    dataSourceOptions={this.props.dataSourceOptions}
                    plotly={this.props.plotly}
                    onUpdate={this.props.onUpdate}
                    advancedTraceTypeSelector={this.props.advancedTraceTypeSelector}
                    locale={this.props.locale}
                    traceTypesConfig={this.props.traceTypesConfig}
                    dictionaries={this.props.dictionaries}
                    showFieldTooltips={this.props.showFieldTooltips}
                    srcConverters={this.props.srcConverters}
                    makeDefaultTrace={this.props.makeDefaultTrace}
                    glByDefault={this.props.glByDefault}
                    mapBoxAccess={Boolean(this.props.config && this.props.config.mapboxAccessToken)}
                    fontOptions={this.props.fontOptions}
                    chartHelp={this.props.chartHelp}
                    customConfig={this.props.customConfig}
                    slateEditor={this.props.slateEditor}
                  >
                    {this.props.children}
                  </EditorControls>
                </div>
              </DrawerContainer>
            </LeftDrawer>
          )
        }

        <div className="plotly_editor_plot" style={{width: '100%', height: '100%'}}>
          <this.PlotComponent
            ref={this.plotlyComponentRef} 
            data={this.state.graphDiv.data}
            layout={this.state.graphDiv.layout}
            frames={this.state.graphDiv.frames}
            config={this.props.config}
            useResizeHandler={this.props.useResizeHandler}
            debug={this.props.debug}
            onInitialized={this.handleRender}
            onUpdate={this.handleRender}
            style={{width: '100%', height: '100%'}}
            divId={this.props.divId}
          />
        </div>
      </div>
    );
  }
}

PlotlyEditor.propTypes = {
  label: PropTypes.string,
  children: PropTypes.any,
  layout: PropTypes.object,
  data: PropTypes.array,
  config: PropTypes.object,
  dataSourceOptions: PropTypes.array,
  dataSources: PropTypes.object,
  frames: PropTypes.array,
  onUpdate: PropTypes.func,
  onRender: PropTypes.func,
  plotly: PropTypes.object,
  useResizeHandler: PropTypes.bool,
  debug: PropTypes.bool,
  advancedTraceTypeSelector: PropTypes.bool,
  locale: PropTypes.string,
  traceTypesConfig: PropTypes.object,
  dictionaries: PropTypes.object,
  divId: PropTypes.string,
  hideControls: PropTypes.bool,
  showFieldTooltips: PropTypes.bool,
  srcConverters: PropTypes.shape({
    toSrc: PropTypes.func.isRequired,
    fromSrc: PropTypes.func.isRequired,
  }),
  makeDefaultTrace: PropTypes.func,
  glByDefault: PropTypes.bool,
  fontOptions: PropTypes.array,
  chartHelp: PropTypes.object,
  customConfig: PropTypes.object,
  editorControlsDisplayed: PropTypes.bool,
  onDisplayEditorControls: PropTypes.func,
  editGraphEnabled: PropTypes.bool,
  onSetEditGraphEnabled: PropTypes.func,
  slateEditor: PropTypes.object
};

PlotlyEditor.defaultProps = {
  hideControls: false,
  showFieldTooltips: false,
  fontOptions: DEFAULT_FONTS,
};

export default PlotlyEditor;
