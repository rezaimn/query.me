import React, { FunctionComponent } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { IconName } from '@blueprintjs/icons';

import './HeaderNavigationButton.scss';

type OnClickCallback = (value?: any) => void;

type HeaderNavigationButtonProps = {
  icon?: IconName;
  label: string;
  intent?: Intent;
  minimal?: boolean;
  pending?: boolean;
  onClick?: OnClickCallback;
};

const HeaderNavigationButton: FunctionComponent<HeaderNavigationButtonProps> = ({ 
  icon, label, intent, minimal, pending, onClick,
}: HeaderNavigationButtonProps) => {
  return (
    <div className="navigation-item">
      <Button
        icon={icon}
        loading={pending}
        intent={intent ? intent : undefined}
        minimal={minimal}
        onClick={onClick ? onClick : undefined}
      >
        {label}
      </Button>
    </div>
  );
}

export default HeaderNavigationButton;
