import React, { ComponentType, RefObject, useMemo, useRef, useImperativeHandle, useCallback, forwardRef } from 'react';
import { Position } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import createPlotComponent from 'react-plotly.js/factory';
import { PlotParams } from 'react-plotly.js';

import './NewPlotlyEditor.scss';
import { LeftDrawer } from '../../../../../../shared/components/layout/LeftDrawer';
import { DrawerContainer } from '../../../../../../shared/components/layout/Drawer';
import { NewPlotlyEditorControlsContainer } from './NewPlotlyEditorControlsContainer'

interface NewPlotlyEditorProps /* extends RenderElementProps */ {
  label: string;
  editGraphEnabled: boolean;
  plotly: any;
  data: any;
  layout: any;
  frames: any;
  onRender?: any;
  editorControlsDisplayed: boolean;
  onSetEditGraphEnabled: any;
  onDisplayEditorControls: any;
  divId?: string;
  config: any;
  debug: boolean;
  useResizeHandler: boolean;
  slateEditor: any;
  onUpdate: any;
  advancedTraceTypeSelector: any;
}

export const NewPlotlyEditor = forwardRef(({
  label,
  editGraphEnabled,
  plotly,
  data,
  layout,
  frames,
  onRender,
  editorControlsDisplayed,
  onSetEditGraphEnabled,
  onDisplayEditorControls,
  divId,
  config,
  debug,
  useResizeHandler,
  slateEditor,
  onUpdate,
  advancedTraceTypeSelector
}: NewPlotlyEditorProps, ref) => {
  const plotlyComponentRef = useRef<any>();

  const PlotComponent = useMemo(() => createPlotComponent(plotly), [ plotly ]) as ComponentType<PlotParams | { ref: RefObject<any> }>;

  /*
  This is necessary since we can have not full configured elements
  into the transforms array
  */
  const cleanedData = useMemo(() => {
    if (!data) return data;

    return data.map((dataItem: any) => ({
      ...dataItem,
      transforms: dataItem.transforms ?
        dataItem.transforms.filter((transform: any) => {
          if (transform.type === 'filter') {
            return !!transform.operation;
          }
          if (transform.type === 'sort') {
            return !!transform.order;
          }
        }) :
        dataItem.transforms
    }))
  }, [ data ]);

  useImperativeHandle(ref,
    () => ({
      handleResize
    }));

  const handleResize = useCallback(() => {
    if (plotlyComponentRef.current && plotlyComponentRef.current.resizeHandler) {
      plotlyComponentRef.current.resizeHandler();
    }
  }, [ plotlyComponentRef ]);

  const handleRender = useCallback((fig: any, graphDiv: any) => {
    if (onRender) {
      onRender(graphDiv.data, graphDiv.layout, graphDiv._transitionData._frames);
    }
  }, [ onRender ]);

  const onToggle = useCallback(() => {
    onSetEditGraphEnabled(true);
    setTimeout(() => {
      onDisplayEditorControls(!editorControlsDisplayed);
    }, 200);
  }, [ onSetEditGraphEnabled, onDisplayEditorControls, editorControlsDisplayed ]);

  const onCloseDetails = useCallback(() => {
    onDisplayEditorControls(false);
    setTimeout(() => {
      onSetEditGraphEnabled(false);
    }, 200);
  }, []);

  return (
    <div className="plotly_editor">
      {
        editGraphEnabled && (
          <LeftDrawer>
            <DrawerContainer
              label={label}
              icon={IconNames.CHART}
              position={Position.LEFT}
              isOpen={editorControlsDisplayed}
              noIconBackground={true}
              width="300px"
              headerClassName="plotly_editor_controls_header"
              canOutsideClickClose={false}
              closeIcon={IconNames.CROSS}
              closeIconSize={16}
              pseudoDrawer={true}
              onClose={onCloseDetails}
            >
              <div
                className="editor_controls_wrapper"
                onClick={(event: any) => event.stopPropagation()}
              >
                <NewPlotlyEditorControlsContainer
                  data={data}
                  onUpdate={onUpdate}
                />
              </div>
            </DrawerContainer>
          </LeftDrawer>
        )
      }

      <div
        className="plotly_editor_plot"
        style={{width: '100%', height: '100%'}}
      >
        { cleanedData && (
          <PlotComponent
            ref={plotlyComponentRef} 
            data={cleanedData}
            layout={layout}
            frames={frames}
            config={config}
            useResizeHandler={useResizeHandler}
            debug={debug}
            onInitialized={handleRender}
            onUpdate={handleRender}
            style={{width: '100%', height: '100%'}}
            divId={divId}
          />
        ) }
      </div>
    </div>
  );
});
