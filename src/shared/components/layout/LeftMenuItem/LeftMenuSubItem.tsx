import React, { FunctionComponent } from 'react';
import { Icon } from '@blueprintjs/core';
import { IconName } from '@blueprintjs/icons';

import './LeftMenuSubItem.scss';

type ActionClickedCallback = () => void;

type LeftMenuSubItemComponentProps = {
  icon?: IconName;
  label: string;
  onSelect?: ActionClickedCallback;
};

const LeftMenuSubItemComponent: FunctionComponent<LeftMenuSubItemComponentProps> = ({
  icon, label, onSelect
}) => {
  const onHandleSelect = () => {
    onSelect && onSelect();
  };

  return (
    <div
      className={`left-menu-sub-item ${onSelect ? 'selectable' : ''}`}
      onClick={onHandleSelect}
    >
      <Icon icon={icon} />
      <div className="left-menu-sub-item__label">{label}</div>
    </div>
  );
};

export default LeftMenuSubItemComponent;
