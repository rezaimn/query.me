import React, { ComponentType, RefObject, useMemo, useRef, useState, useEffect, useCallback, forwardRef } from 'react';
import { Position } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import createPlotComponent from 'react-plotly.js/factory';
import { PlotParams } from 'react-plotly.js';
import { useSelector } from 'react-redux';

import './NewPlotlyEditor.scss';
import { UnderlinedTabs, UnderlinedTab } from '../../../../../../shared/components/layout/UnderlinedTabs';
import { SetupControls } from './setup/SetupControls';
import { PlotlyEditorProvider } from './PlotlyEditorContext';
import { IState } from '../../../../../../shared/store/reducers';
import { NewPlotlyEditorControls } from './NewPlotlyEditorControls';

type OnUpdateCallback = (newData: any, newLayout: any, newFrames: any) => void;

interface NewPlotlyEditorControlsContainerProps /* extends RenderElementProps */ {
  data: any;
  onUpdate: OnUpdateCallback;
}

export const NewPlotlyEditorControlsContainer = ({
  data, onUpdate
}: NewPlotlyEditorControlsContainerProps) => {
  const notebook = useSelector((state: IState) => state.notebooks.notebook);
  const dataSources = useMemo(() => {
    return notebook?.pages
      .map(page => page.blocks)
      .reduce((acc, blocks) => {
        return acc.concat(blocks)
      }, [])
      .filter(block => block.type === 'sql')
  }, [ notebook ]);

  return (
    <NewPlotlyEditorControls
      data={data}
      dataSources={dataSources}
      onUpdate={onUpdate}
    />
  );
};
