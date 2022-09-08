import React, { FunctionComponent } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { IconName } from '@blueprintjs/icons';

import './CoverImageButton.scss';

type CoverImageButtonProps = {
  icon?: IconName;
  label: string;
  intent?: Intent;
  minimal?: boolean;
  style?: Object;
};

const CoverImageButton: FunctionComponent<CoverImageButtonProps> = ({
  icon, label, intent, minimal, style
}: CoverImageButtonProps) => {
  return (
    <div className="cover-image-button">
      <Button
        id='cover-image-menu-btn'
        icon={icon}
        intent={intent ? intent : undefined}
        minimal={minimal}
        style={style}>
          {label}
      </Button>
    </div>
  );
}

export default CoverImageButton;
