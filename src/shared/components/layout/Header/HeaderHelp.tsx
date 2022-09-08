import React, { FunctionComponent } from 'react';
import { Popover, Menu, MenuDivider, MenuItem, Position, Icon, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import HeaderNavigationItem from './HeaderNavigationItem';
import {IUser} from "../../../models";
import { showIntercom } from "../../../utils/intercom";
import config from "../../../../config";
import './HeaderHelp.scss';

type CurrentUser = IUser | undefined | null;

type HeaderHelpProps = {
  currentUser: CurrentUser;
};

const headerHelpMenu = (currentUser: CurrentUser) => (
  <Menu>
    <MenuItem
      icon={IconNames.MANUAL}
      text="Documentation"
      href={config.app.url + '/docs'}
      target="_blank" />
    <MenuItem
      icon={IconNames.CLEAN} text="Product Updates"
      href={config.app.url + '/release-notes'}
      target="_blank" />
    <MenuItem
      icon={IconNames.INFO_SIGN}
      text="Terms & Policies"
      href={config.app.url + '/legal'}
      target="_blank" />
    <MenuDivider />
    <MenuItem icon={IconNames.CHAT} text="Support Chat" onClick={() => showIntercom(currentUser)} />
    <MenuDivider />
    <MenuItem
      className="header-help__version"
      text={ config.app.version }
      disabled={true} />
  </Menu>
)

const HeaderHelp: FunctionComponent<HeaderHelpProps> = ({ currentUser }: HeaderHelpProps) => {
  const helpMenu = headerHelpMenu(currentUser);

  return (
    <div className="header-help">
      <Popover
        content={helpMenu}
        position={Position.BOTTOM_LEFT}
      >
        <HeaderNavigationItem icon={IconNames.HELP} />
      </Popover>
    </div>
  )
}

export default HeaderHelp;
