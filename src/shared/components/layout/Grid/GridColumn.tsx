import React, { FunctionComponent } from 'react';

import './GridColumn.scss';

type GridColumnProps = {
  size: number
};

export const GridColumn: FunctionComponent<GridColumnProps> = ({
  size, children
}) => {
  return (
    <div className={`grid-column s${size ? size : ''}`}>
      {children}
    </div>
  );
};
