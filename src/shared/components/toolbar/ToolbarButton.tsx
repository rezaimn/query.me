import React, { FunctionComponent, SyntheticEvent } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { IconName } from '@blueprintjs/icons';

import './ToolbarButton.scss';

type ClickCallback = (event: SyntheticEvent) => void;

type ToolbarButtonComponentProps = {
  icon: IconName;
  label: string;
  onClick?: ClickCallback;
};

const ToolbarButtonComponent: FunctionComponent<ToolbarButtonComponentProps> = ({
  icon, label, onClick
}: ToolbarButtonComponentProps) => {
  return (
    <Button
      icon={icon}
      minimal={true}
      intent={Intent.PRIMARY}
      onClick={(event: SyntheticEvent) => onClick && onClick(event)}
    >{label}</Button>
  )
};

export default ToolbarButtonComponent;
