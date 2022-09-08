import React, { FunctionComponent } from 'react';

import './LeftMenuSubHeader.scss';

type LeftMenuSubHeaderComponentProps = {
  label: string;
};

const LeftMenuSubHeaderComponent: FunctionComponent<LeftMenuSubHeaderComponentProps> = ({
  label
}: LeftMenuSubHeaderComponentProps) => {
  return (
    <div className="left-menu-sub-header">
      <span className="left-menu-sub-header__label">{label}</span>
    </div>
  );
};

export default LeftMenuSubHeaderComponent;
