import React, { FunctionComponent } from 'react';
import {Icon, Intent } from '@blueprintjs/core';
import './SquareIndicator.scss';

type SquareIndicatorComponentProps = {
  icon: any;
  intent?: Intent;
  color?: string;
  iconSize?: number;
  width?: number;
  height?: number;
};

export const SquareIndicatorComponent: FunctionComponent<SquareIndicatorComponentProps> = ({
                                                                                             icon, intent, color, iconSize = 18, width, height,
                                                                                           }) => {
  return (
    <div
      className={`square-indicator ${intent ? intent : ''}`}
      style={{ width: width, minWidth: width, height: height, backgroundColor: color }}
    >
      <Icon icon={icon} iconSize={iconSize} color={color}/>
    </div>
  );
};
