import React, { FunctionComponent } from 'react';
import { Button, Intent, ButtonGroup } from '@blueprintjs/core';
import { IconName } from '@blueprintjs/icons';

import './HeaderNavigationButtonGroup.scss';

type HeaderNavigationButtonGroupProps = {
  icons: IconName[];
  labels?: string[];
  intents?: Intent[];
};

const HeaderNavigationGroupButton: FunctionComponent<HeaderNavigationButtonGroupProps> = ({ 
  icons, labels, intents
}: HeaderNavigationButtonGroupProps) => {
  return (
    <div className="navigation-item">
      <ButtonGroup>
        {
          labels && labels.map((label, index) => (
            <Button
              key={index}
              icon={icons[index]}
              intent={intents && intents[index] ? intents[index] : undefined}
            >{label}</Button>
          ))
        }
      </ButtonGroup>
    </div>
  );
}

export default HeaderNavigationGroupButton;
