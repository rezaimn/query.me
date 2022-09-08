import React, { FunctionComponent } from 'react';
import { IconNames } from '@blueprintjs/icons';
import './HeaderSettingsButton.scss';

import HeaderNavigationButton from "./HeaderNavigationButton";

type OnClickCallback = () => void;

type HeaderSettingsButtonProps = {
  onClick: OnClickCallback;
};

const HeaderSettingsButton: FunctionComponent<HeaderSettingsButtonProps> = ({
  onClick,
}: HeaderSettingsButtonProps) => {
  return (
    <div className="header-settings-button">
      <HeaderNavigationButton
        icon={IconNames.SETTINGS}
        label=""
        minimal={true}
        onClick={onClick} />
    </div>
  );
}

export default HeaderSettingsButton;
