import React, { ComponentType, RefObject, useMemo, useRef, useState, useEffect, useCallback, forwardRef } from 'react';
import { Position } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

// import './SetupControls.scss';
import { SetupToolbarControls } from './SetupToolbarControls';
import { SetupLayers } from './SetupLayers';

type OnUpdateCallback = (newData: any, newLayout: any, newFrames: any) => void;

interface SetupControlsProps /* extends RenderElementProps */ {
  data: any;
  onUpdate: OnUpdateCallback;
}

export const SetupControls = forwardRef(({
  data, onUpdate
}: SetupControlsProps, ref) => {
  const onNewLayer = useCallback(() => {
    onUpdate(data.concat([ {} ]), null, null);
  }, [ data ]);

  const handleChange = useCallback((newData) => {
    onUpdate(newData, null, null);
  }, []);

  return (
    <div>
      <SetupToolbarControls onNewLayer={onNewLayer} />
      <SetupLayers data={data} onChange={handleChange} />
    </div>
  )
});
