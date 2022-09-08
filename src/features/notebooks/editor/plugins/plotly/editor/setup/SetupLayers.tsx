import React, { memo, useRef, useEffect, useCallback } from 'react';

import './SetupLayers.scss';
import { BlockPanel } from './BlockPanel';
import { SetupLayerContent } from './SetupLayerContent';

type OnChangeCallback = (data: any) => void;

interface SetupLayersProps /* extends RenderElementProps */ {
  data: any;
  onChange: OnChangeCallback;
}

export const InternalSetupLayers = ({
  data, onChange
}: SetupLayersProps) => {
  const dataRef = useRef(data);

  useEffect(() => {
    dataRef.current = data;
  }, [ data ]);

  const handleChange = (newData: any, index: number) => {
    const updatedData = dataRef.current.map((d: any, i: number) => i === index ? newData : d)
    onChange(updatedData);
  };

  const handleRemove = useCallback((index: number) => {
    const updatedData = [ ...dataRef.current ];
    updatedData.splice(index, 1);
    onChange(updatedData);
  }, [ data, onChange ]);

  return (
    <div className="setup-layers">
      { data?.map((d: any, index: number) => (
        <BlockPanel
          label={`Layer ${index + 1}`}
          key={index}
          onRemove={() => handleRemove( index)}
        >
          <SetupLayerContent
            data={d}
            index={index}
            onChange={(newData, index) => handleChange(newData, index)}
          />
        </BlockPanel>
      ))}
    </div>
  )
};

export const SetupLayers = memo(InternalSetupLayers);
