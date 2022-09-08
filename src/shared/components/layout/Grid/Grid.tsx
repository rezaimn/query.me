import React, { FunctionComponent } from 'react';

import './Grid.scss';

type GridProps = {
  size: number;
};

export const Grid: FunctionComponent<GridProps> = ({
  size, children
}) => {
  return (
    <div className={`grid ${size ? size : ''}`}>
      {children}
    </div>
  );
};
