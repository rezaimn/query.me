import React, { ComponentType, RefObject, useMemo, useRef, useState, useEffect, useCallback, forwardRef } from 'react';
import { Position } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import createPlotComponent from 'react-plotly.js/factory';
import { PlotParams } from 'react-plotly.js';

import './NewPlotlyEditor.scss';
import { UnderlinedTabs, UnderlinedTab } from '../../../../../../shared/components/layout/UnderlinedTabs';
import { SetupControls } from './setup/SetupControls';
import { PlotlyEditorProvider } from './PlotlyEditorContext';

type OnUpdateCallback = (newData: any, newLayout: any, newFrames: any) => void;

interface NewPlotlyEditorControlsProps /* extends RenderElementProps */ {
  data: any;
  dataSources: any;
  onUpdate: OnUpdateCallback;
}

export const NewPlotlyEditorControls = forwardRef(({
  data, dataSources, onUpdate
}: NewPlotlyEditorControlsProps, ref) => {
  const leftPanelsRef = useRef();

  return (
    <PlotlyEditorProvider dataSources={dataSources}>
      <UnderlinedTabs
        ref={leftPanelsRef}
        defaultActiveTab="tabSetup"
        noTopBorder={true}
        tabSelectorHeight="3px"
        tabsMargin="0"
      >
        <UnderlinedTab id="tabSetup" title="SETUP">
          <div className="controls__setup">
            <SetupControls data={data} onUpdate={onUpdate} />
          </div>
        </UnderlinedTab>
        <UnderlinedTab id="tabStyles" title="STYLES">
          <div className="controls__styles">
            Styles
          </div>
        </UnderlinedTab>
      </UnderlinedTabs>
    </PlotlyEditorProvider>
  );
});
