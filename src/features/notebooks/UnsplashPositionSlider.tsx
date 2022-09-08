import { Slider } from '@blueprintjs/core';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { INotebookPageCoverImage } from '../../shared/models';
import './UnsplashPositionSlider.scss';
import { coverImageVerticalPositionDefault } from './constants';

type ChangeCoverImagePositionCallback = (position: number) => void;

type UnsplashPositionSliderProps = {
  onChangeCoverImagePosition: ChangeCoverImagePositionCallback;
  coverImage: INotebookPageCoverImage;
};

const UnsplashPositionSlider: FunctionComponent<UnsplashPositionSliderProps> = ({ onChangeCoverImagePosition, coverImage }: UnsplashPositionSliderProps) => {
  const [coverImagePosition, setCoverImagePosition] = useState<any>(coverImage && coverImage.position && coverImage.position.y ?
    coverImage.position.y : coverImageVerticalPositionDefault);
  useEffect(() => {
    setCoverImagePosition(coverImage?.position?.y || coverImageVerticalPositionDefault);
  }, [coverImage]);
  const positionLabel = (val: number) => {
    return `${Math.round(val)}%`;
  };

  return (
    <div className='unsplash-footer'>
      <div className='cover-image-slider'>
        <span className='slider-title'>Vertical Position: </span>
        <Slider
          min={0}
          max={100}
          stepSize={1}
          labelStepSize={100}
          onRelease={(position: number) => {
            setCoverImagePosition(position);
            onChangeCoverImagePosition(position);
          }}
          labelRenderer={positionLabel}
          value={coverImagePosition}
          vertical={false}
        />
      </div>
    </div>
  );
};

export default UnsplashPositionSlider;
