import React, { FunctionComponent } from 'react';

import './PseudoDrawer.scss';

type PseudoDrawerProps = {
  isOpen: boolean;
}

export const PseudoDrawer: FunctionComponent<PseudoDrawerProps> = ({
  isOpen, children
}) => {
  return (
    <div className="pseudo-drawer">
      {isOpen && children}
    </div>
  )
};
