import React, { FunctionComponent, SyntheticEvent } from 'react';
import { Icon, Colors, Spinner, Intent } from '@blueprintjs/core';
import { IconNames, IconName } from '@blueprintjs/icons';

import './TabHeader.scss';

type OnSelectTabCallback = (id: string) => void;

type TabHeaderComponentProps = {
  id: string;
  label: string;
  icon?: IconName;
  status?: string;
  active?: boolean;
  closable?: boolean;
  stopPropagation?: boolean;
  onSelectTab: OnSelectTabCallback;
};

const getColor = (active = false, status: string = '') => {
  if (status === 'failed') {
    return Colors.RED4;
  }

  if (status === 'running') {
    return Colors.GREEN4;
  }

  if (active) {
    return Colors.BLUE4;
  }

  return Colors.GRAY3;
};

const getIcon = (active = false, status: string = '', icon: IconName = IconNames.TIME) => {
  if (status === 'failed') {
    return IconNames.ERROR;
  }

  return icon;
};

const TabHeader: FunctionComponent<TabHeaderComponentProps> = ({
  id, label, icon, status, active, closable = true, stopPropagation, onSelectTab
}) => {
  const handleSelectTab = (event: SyntheticEvent) => {
    onSelectTab && onSelectTab(id);
    if (stopPropagation) {
      event.stopPropagation();
    }
  }
  return (
    <div
      className={`tab-header ${active ? 'active' : ''} ${status ? status : ''}`}
      onClick={handleSelectTab}
    >
      {
        icon && status !== 'running' && (
          <Icon icon={getIcon(active, status, icon)} color={getColor(active, status)} iconSize={11} className="tab-header__icon" />
        )
      }
      {
        icon && status === 'running' && (
          <Spinner intent={Intent.SUCCESS} size={11} className="tab-header__icon" />
        )
      }
      {label}
      { closable && <Icon icon={IconNames.CROSS} color={getColor(active, status)} iconSize={12} /> }
    </div>
  );
}

export default TabHeader;
