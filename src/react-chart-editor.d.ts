import * as Plotly from 'plotly.js';
// import { FunctionComponent } from 'react';

declare module 'react-chart-editor' {
  interface Figure {
    data: Plotly.Data[];
    layout: Partial<Plotly.Layout>;
    frames: Plotly.Frame[] | null;
  }

  type EditorControlsProps = {
    graphDiv?: any;
    dataSources?: any;
    dataSourceOptions?: any[];
    plotly: Plotly;

    /**
     * Callback executed when when a plot is updated due to new data or layout, or when user interacts with a plot.
     * @param figure Object with three keys corresponding to input props: data, layout and frames.
     * @param graphDiv Reference to the DOM node into which the figure was rendered.
     */
    // onUpdate?: (figure: Readonly<Figure>, graphDiv: Readonly<HTMLElement>) => void;
    onUpdate?: (data: Plotly.Data[], layout: Partial<Plotly.Layout>, frames?: Plotly.Frame[]) => void;

    advancedTraceTypeSelector: any;
    locale?: any;
    traceTypesConfig?: any;
    dictionaries?: any;
    showFieldTooltips?: any;
    srcConverters?: any;
    makeDefaultTrace?: any;
    glByDefault?: any;
    mapBoxAccess?: boolean;
    fontOptions?: any;
    chartHelp?: any;
    customConfig?: any;
  }

  export class EditorControls extends React.Component<EditorControlsProps> {
  }

  export class DEFAULT_FONTS {}

  // PanelMenuWrapper

  type PanelMenuWrapperProps = {
    menuPanelOrder: any;
  }

  export class PanelMenuWrapper extends React.Component<PanelMenuWrapperProps> {
  }

  // default_panels

  type DefaultPanelsProps = {
    group: string;
    name: string;
  }

  export class GraphCreatePanel extends React.Component<DefaultPanelsProps> {
  }

  export class GraphTransformsPanel extends React.Component<DefaultPanelsProps> {
  }

  export class GraphSubplotsPanel extends React.Component<DefaultPanelsProps> {
  }

  export class StyleLayoutPanel extends React.Component<DefaultPanelsProps> {
  }

  export class StyleAxesPanel extends React.Component<DefaultPanelsProps> {
  }

  export class StyleMapsPanel extends React.Component<DefaultPanelsProps> {
  }

  export class StyleLegendPanel extends React.Component<DefaultPanelsProps> {
  }

  export class StyleNotesPanel extends React.Component<DefaultPanelsProps> {
  }

  export class StyleShapesPanel extends React.Component<DefaultPanelsProps> {
  }

  export class StyleSlidersPanel extends React.Component<DefaultPanelsProps> {
  }

  export class StyleImagesPanel extends React.Component<DefaultPanelsProps> {
  }

  export class StyleTracesPanel extends React.Component<DefaultPanelsProps> {
  }

  export class StyleColorbarsPanel extends React.Component<DefaultPanelsProps> {
  }

  export class StyleUpdateMenusPanel extends React.Component<DefaultPanelsProps> {
  }

  // default_panels/StyleColorbarsPanel

  export const traceHasColorbar : Function;

  // import Logo from './components/widgets/Logo';

  type LogoProps = {
    src: string;
  }

  export class Logo extends React.Component<LogoProps> {
  }

  // import {TRANSFORMABLE_TRACES, TRACE_TO_AXIS} from './lib/constants';

  export const EDITOR_ACTIONS : {
    UPDATE_TRACES: string;
    ADD_TRACE: string;
    DELETE_TRACE: string;
    UPDATE_LAYOUT: string;
    DELETE_ANNOTATION: string;
    DELETE_SHAPE: string;
    DELETE_IMAGE: string;
    DELETE_RANGESELECTOR: string;
    DELETE_TRANSFORM: string;
    MOVE_TO: string;
    DELETE_MAPBOXLAYER: string;
  };
  
  export const DEFAULT_FONTS : {label:string, value: string}[];
  
  export const RETURN_KEY : string;
  export const ESCAPE_KEY : string;
  export const COMMAND_KEY : string;
  export const CONTROL_KEY : string;
  
  // matches gd._fullLayout._subplots categories except for xaxis & yaxis which
  // are in fact cartesian types
  export const TRACE_TO_AXIS : {
    cartesian: string[];
    ternary: string[]
    gl3d: string[]
    geo: string[]
    mapbox: string[]
    polar: string[]
  };
  
  // Note: scene, and xaxis/yaxis were added for convenience sake even though they're not subplot types
  export const SUBPLOT_TO_ATTR : {
    cartesian: {data: string[], layout: string[]};
    xaxis: {data: string, layout: string};
    yaxis: {data: string, layout: string};
    x: {data: string, layout: string};
    y: {data: string, layout: string};
    ternary: {data: string, layout: string};
    gl3d: {data: string, layout: string};
    scene: {data: string, layout: string};
    geo: {data: string, layout: string};
    mapbox: {data: string, layout: string};
    polar: {data: string, layout: string};
  };
  
  export const TRANSFORMS_LIST : string[];
  
  export const TRANSFORMABLE_TRACES : string[];
  
  export const TRACES_WITH_GL : string[];
  
  export const COLORS : {
    charcoal: string;
    white: string;
    mutedBlue: string;
    safetyOrange: string;
    cookedAsparagusGreen: string;
    brickRed: string;
    mutedPurple: string;
    chestnutBrown: string;
    raspberryYogurtPink: string;
    middleGray: string;
    curryYellowGreen: string;
    blueTeal: string;
    editorLink: string;
    black: string;
  };
  
  export const DEFAULT_COLORS : string;

  // lib

  export const bem : (block: any, element?: any, modifiers?: any) => string;

  export const localizeString : (dictionaries: any, locale: string, key: string) => string;

  export const plotlyTraceToCustomTrace : (trace: any) => string;

  export const traceTypeToPlotlyInitFigure : (traceType: any, gl: string) => {type: string; autocolorscale: boolean };

  export const hasValidCustomConfigVisibilityRules : (customConfig: any) => boolean;

  // shame

  export const shamefullyClearAxisTypes : (graphDiv: any, {traceIndexes: any, update: any}) => void;

  export const shamefullyAdjustAxisRef : (graphDiv: any, payload: any) => void;

  export const shamefullyAdjustGeo : ({layout: any}, {update: any}) => void;

  export const shamefullyAddTableColumns : (graphDiv: any, {traceIndexes: any, update: any}) => void

  export const shamefullyCreateSplitStyleProps : (graphDiv: any, attr: any, traceIndex: any, splitTraceGroup: any) => any;

  export const shamefullyAdjustSplitStyleTargetContainers : (graphDiv: any, {traceIndexes: any, update: any}) => void;

  export const shamefullyDeleteRelatedAnalysisTransforms : (graphDiv: any, payload: any) => void;

  export const shamefullyAdjustSizeref : (gd: any, {update: any}) => void;

  export const shamefullyAdjustAxisDirection : (gd: any, {update: any}) => void;

  export const shamefullyAdjustMapbox : (gd: any, payload: any) => void;

  // lib/traceTypes

  export const categoryLayout : (_: any) => any[];

  export const traceTypes : (_: any) => {value: string; label: string; category: any;}[];

  // components/containers

  type ModalProviderProps = {
  }

  export class ModalProvider extends React.Component<ModalProviderProps> {
  }


  type EditorProps = {
    data: Plotly.Data[];
    layout: Partial<Plotly.Layout>;
    frames?: Plotly.Frame[];
    config?: Partial<Plotly.Config>;
    dataSources?: any;
    dataSourceOptions?: any[];
    plotly: Plotly;
    /**
     * When provided, causes the plot to update only when the revision is incremented.
     */
    revision?: number;
    /**
     * Callback executed after plot is initialized.
     * @param figure Object with three keys corresponding to input props: data, layout and frames.
     * @param graphDiv Reference to the DOM node into which the figure was rendered.
     */
    onInitialized?: (figure: Readonly<Figure>, graphDiv: Readonly<HTMLElement>) => void;
    /**
     * Callback executed when when a plot is updated due to new data or layout, or when user interacts with a plot.
     * @param figure Object with three keys corresponding to input props: data, layout and frames.
     * @param graphDiv Reference to the DOM node into which the figure was rendered.
     */
    // onUpdate?: (figure: Readonly<Figure>, graphDiv: Readonly<HTMLElement>) => void;
    onUpdate?: (data: Plotly.Data[], layout: Partial<Plotly.Layout>, frames?: Plotly.Frame[]) => void;
    /**
     * Callback executed when component unmounts, before Plotly.purge strips the graphDiv of all private attributes.
     * @param figure Object with three keys corresponding to input props: data, layout and frames.
     * @param graphDiv Reference to the DOM node into which the figure was rendered.
     */
    onPurge?: (figure: Readonly<Figure>, graphDiv: Readonly<HTMLElement>) => void;
    /**
     * Callback executed when a plotly.js API method rejects
     * @param err Error
     */
    onError?: (err: Readonly<Error>) => void;
    /**
     * id assigned to the <div> into which the plot is rendered.
     */
    divId?: string;
    /**
     * applied to the <div> into which the plot is rendered
     */
    className?: string;
    /**
     * used to style the <div> into which the plot is rendered
     */
    style?: React.CSSProperties;
    /**
     * Assign the graph div to window.gd for debugging
     */
    debug?: boolean;
    /**
     * When true, adds a call to Plotly.Plot.resize() as a window.resize event handler
     */
    useResizeHandler?: boolean;
    advancedTraceTypeSelector?: boolean;

    onAfterExport?: () => void;
    onAfterPlot?: () => void;
    onAnimated?: () => void;
    onAnimatingFrame?: (event: Readonly<Plotly.FrameAnimationEvent>) => void;
    onAnimationInterrupted?: () => void;
    onAutoSize?: () => void;
    onBeforeExport?: () => void;
    onButtonClicked?: (event: Readonly<Plotly.ButtonClickEvent>) => void;
    onClick?: (event: Readonly<Plotly.PlotMouseEvent>) => void;
    onClickAnnotation?: (event: Readonly<Plotly.ClickAnnotationEvent>) => void;
    onDeselect?: () => void;
    onDoubleClick?: () => void;
    onFramework?: () => void;
    onHover?: (event: Readonly<Plotly.PlotMouseEvent>) => void;
    onLegendClick?: (event: Readonly<Plotly.LegendClickEvent>) => boolean;
    onLegendDoubleClick?: (event: Readonly<Plotly.LegendClickEvent>) => boolean;
    onRelayout?: (event: Readonly<Plotly.PlotRelayoutEvent>) => void;
    onRestyle?: (event: Readonly<Plotly.PlotRestyleEvent>) => void;
    onRedraw?: () => void;
    onSelected?: (event: Readonly<Plotly.PlotSelectionEvent>) => void;
    onSelecting?: (event: Readonly<Plotly.PlotSelectionEvent>) => void;
    onSliderChange?: (event: Readonly<Plotly.SliderChangeEvent>) => void;
    onSliderEnd?: (event: Readonly<Plotly.SliderEndEvent>) => void;
    onSliderStart?: (event: Readonly<Plotly.SliderStartEvent>) => void;
    onTransitioning?: () => void;
    onTransitionInterrupted?: () => void;
    onUnhover?: (event: Readonly<Plotly.PlotMouseEvent>) => void;
  }

  export default class Editor extends React.Component<EditorProps> {
  }
}
