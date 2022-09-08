import React, { FunctionComponent, SyntheticEvent } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon, Colors, Menu, MenuItem } from '@blueprintjs/core';
import { IconName, IconNames } from '@blueprintjs/icons';

import './LeftMenuItem.scss';

type ActionClickedCallback = () => void;

type LeftMenuItemComponentProps = {
  icon?: IconName;
  label: string;
  active?: boolean;
  link?: string;
  notExactLink?: boolean;
  skeleton?: boolean;
  toolbar?: boolean;
  onSelect?: ActionClickedCallback;
  onEdit?: ActionClickedCallback;
  onRemove?: ActionClickedCallback;
};

const LeftMenuItemComponent: FunctionComponent<LeftMenuItemComponentProps> = ({
  icon, label, active, link,
  notExactLink, skeleton, toolbar,
  children, onSelect, onEdit, onRemove
}) => {

  const stopPropagationForToolbar = (event: SyntheticEvent) => {
    event.stopPropagation();
  }

  const onHandleSelect = () => {
    onSelect && onSelect();
  };

  const onHandleEdit = () => {
    onEdit && onEdit();
  };

  const onHandleRemove = () => {
    onRemove && onRemove();
  };

  return link ? (
    <div className="left-menu-item__container">
      <NavLink to={link} exact={!notExactLink} activeClassName="active" className="left-menu-item">
        <MenuItem
          icon={icon}
          text={label}
          color={active ? Colors.BLUE3: Colors.GRAY4}
          className={`left-menu-item ${skeleton ? 'bp3-skeleton' : ''} ${active ? 'active' : ''}`}
        ></MenuItem>
      </NavLink>
      <div className={`left-menu-item__children ${active ? 'active' : ''}`}>
        {children}
      </div>
      {
        toolbar && (
          <div
            className="left-menu-item__toolbar"
            onClick={stopPropagationForToolbar}
          >
            <Icon icon={IconNames.EDIT} iconSize={14} onClick={onHandleEdit} />
            <Icon icon={IconNames.TRASH} iconSize={14} onClick={onHandleRemove} />
          </div>
        )
      }
    </div>
  ) : (
    <div className="left-menu-item__container">
      <div className={`left-menu-item  ${active ? 'active' : ''}`}>
        <MenuItem
          icon={icon}
          text={label}
          color={active ? Colors.BLUE3: Colors.GRAY4}
          className={`left-menu-item ${skeleton ? 'bp3-skeleton' : ''} ${active ? 'active' : ''}`}
          onClick={onHandleSelect}
        ></MenuItem>
      </div>
      <div className={`left-menu-item__children ${active ? 'active' : ''}`}>
        {children}
      </div>
      {
        toolbar && (
          <div data-cy='savedViewsToolbar'
            className="left-menu-item__toolbar"
            onClick={stopPropagationForToolbar}
          >
            <Icon icon={IconNames.EDIT} iconSize={14} onClick={onHandleEdit} />
            <Icon icon={IconNames.TRASH} iconSize={14} onClick={onHandleRemove} />
          </div>
        )
      }
    </div>
  );
};

export default LeftMenuItemComponent;
