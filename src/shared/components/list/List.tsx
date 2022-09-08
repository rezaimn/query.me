import React, { FunctionComponent } from 'react';

import './List.scss';

type ListComponentProps = {

};

export const ListComponent: FunctionComponent<ListComponentProps> = ({ children }) => {
  return (
    <div className="list">
      {children}
    </div>
  );
}
