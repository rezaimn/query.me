import React, { FunctionComponent } from 'react';
import { NavLink } from 'react-router-dom';
import { Colors, Button, Classes, Intent } from '@blueprintjs/core';
import { IconName } from '@blueprintjs/icons';

import './HeaderNavigationItem.scss';

type ActionCallback = () => void;

type HeaderNavigationItemProps = {
  icon: IconName;
  intent?: Intent;
  label?: string;
  size?: string;
  active?: boolean;
  link?: string;
  onAction?: ActionCallback;
};

const HeaderNavigationItem: FunctionComponent<HeaderNavigationItemProps> = ({
  icon, label, size, link, onAction, intent
}: HeaderNavigationItemProps) => {
  return link ? (
    <NavLink to={link} activeClassName="active" className="navigation-item__link">
      <Button
        icon={icon}
        className={`navigation-item bp3-large ${size === 'small' ? 'small' : ''} ${Classes.MINIMAL}`}
        intent={intent ? intent : undefined}
        color={Colors.GRAY1}
        text={label}
      ></Button>
    </NavLink>
  ) : (
    <Button
      icon={icon}
      className={`navigation-item bp3-large ${size === 'small' ? 'small' : ''} ${Classes.MINIMAL}`}
      intent={intent ? intent : undefined}
      color={Colors.GRAY1}
      text={label}
      onClick={onAction}
    ></Button>
  );
  /* return link ? (
    <NavLink to={link} activeClassName="active" className={`navigation-item ${size === 'small' ? 'small' : ''}`}>
      <Icon icon={icon} iconSize={sizeValue} color={Colors.GRAY1} />
      {
        label && (
          <span className="navigation-item__label">{label}</span>
        )
      }
    </NavLink>
  ) : (
    <div className={`navigation-item ${size === 'small' ? 'small' : ''}`}>
      <Icon icon={icon} iconSize={sizeValue} color={Colors.GRAY1} />
      {
        label && (
          <span className="navigation-item__label">{label}</span>
        )
      }
    </div>
  ); */
}

export default HeaderNavigationItem;
