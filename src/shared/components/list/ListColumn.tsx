import React, { FunctionComponent } from 'react';

import './ListColumn.scss';
import { IListColumn } from 'shared/models';

type ListColumnComponentProps = {
  properties: IListColumn;
  main?: boolean;
  skeleton?: boolean;
};

export const ListColumnComponent: FunctionComponent<ListColumnComponentProps> = ({
  properties, main, skeleton, children
}) => {
  return (
    <div
      className={`list-column bp3-text-overflow-ellipsis bp3-fill ${properties && properties.align ? properties.align : ''} ${skeleton ? 'bp3-skeleton' : ''} ${main ? 'main' : ''}`}
      data-cy='listColumn'
      style={{
        width: properties && properties.width,
        minWidth: properties && properties.minWidth,
        paddingLeft: properties && properties.paddingLeft
      }}
    >
        {children}
    </div>
  );
}
