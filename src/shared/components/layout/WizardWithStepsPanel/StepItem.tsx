import React, { FunctionComponent } from 'react';
import { Icon, Colors } from '@blueprintjs/core';
import { IconNames, IconName } from '@blueprintjs/icons';

import './StepItem.scss';

type StepItemProps = {
  label: string;
  icon: IconName;
  active?: boolean;
};

export const StepItem: FunctionComponent<StepItemProps> = ({
  label, icon, active
}) => {
  return (
    <div className={`step-item ${active ? 'active' : ''}`}>
      <div className="step-item__holder">
        <Icon icon={IconNames.DOUBLE_CARET_VERTICAL} color={Colors.GRAY1} />
      </div>
      <div className="step-item__details">
        <div className="step-item__details__icon">
          <Icon icon={icon} color={active ? Colors.COBALT4 : Colors.GRAY3} />
          </div>
        <div className="step-item__details__label">{label}</div>
      </div>
      <div className="step-item__menu">
        <Icon icon={IconNames.MORE} color={Colors.GRAY1} />
      </div>
    </div>
  );
}

