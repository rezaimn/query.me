import React, { ComponentType, FunctionComponent, RefObject, useMemo, useRef, useState, useEffect, useCallback, forwardRef } from 'react';
import { Icon, IconName, Button } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import './BlockPanel.scss';
import { SetupToolbarControls } from './SetupToolbarControls';
import { SetupLayers } from './SetupLayers';

interface BlockPanelHeader {
  label: string;
  icon: IconName;
  opened: boolean;
  onToggle: any;
  onRemove: any;
}

const BlockPanelHeader = ({
  label,
  icon,
  opened,
  onToggle,
  onRemove
}: BlockPanelHeader) => {
  const handleRemove = useCallback((event) => {
    event.stopPropagation();
    onRemove();
  }, [onRemove]);

  return (
    <div
      className={`block-panel__header ${opened ? 'opened' : null}`} 
      onClick={onToggle}
    >
      <div className="block-panel__header__toggle">
        <Icon
          icon={opened ? IconNames.CARET_DOWN: IconNames.CARET_UP}
        />
      </div>
      <Icon icon={icon} />
      <div className="block-panel__header__label">{label}</div>
      <Icon icon={IconNames.CROSS} onClick={handleRemove} />
    </div>
  )
}

type onRemoveCallback = () => void;

interface BlockPanelProps {
  label: string;
  onRemove: onRemoveCallback;
}

export const BlockPanel : FunctionComponent<BlockPanelProps> = ({
  label,
  onRemove,
  children
}) => {
  const [ opened, setOpened ] = useState(true);

  const onToggle = useCallback(() => {
    setOpened(opened => !opened);
  }, [setOpened]);

  return (
    <div className="block-panel">
      <BlockPanelHeader
        label={label}
        opened={opened}
        icon={IconNames.TIMELINE_LINE_CHART}
        onToggle={onToggle}
        onRemove={onRemove}
      />
      { opened && (<div className="block-panel__body">{children}</div>) }
    </div>
  )
};
