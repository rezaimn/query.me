import React, { FunctionComponent } from 'react';
import { Menu, Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import './AdminLeftMenu.scss';
import LeftMenuItem from '../../shared/components/layout/LeftMenuItem';

type AdminLeftMenuComponentProps = {

};

const AdminLeftMenuComponent: FunctionComponent<AdminLeftMenuComponentProps> = ({
}: AdminLeftMenuComponentProps) => {
  return (
    <div className="admin-left-menu">
      <div className="admin-left-menu__header">
        <Icon icon={IconNames.COG} />
        Administration
      </div>
      <Menu className="admin-left-menu__domains" data-cy='adminLeftMenu'>
        <LeftMenuItem icon={IconNames.OFFICE} label="Account" link="/a/o"></LeftMenuItem>
        { /* <LeftMenuItem icon={IconNames.CUBE} label="Workspaces" link="/a/w"></LeftMenuItem> */ }
        <LeftMenuItem icon={IconNames.USER} label="User Management" link="/a/u"></LeftMenuItem>
        { /* <LeftMenuItem icon={IconNames.ARCHIVE} label="Usage & Logs" link="/a/ul"></LeftMenuItem>
        <LeftMenuItem icon={IconNames.CREDIT_CARD} label="Billing" link="/a/b"></LeftMenuItem> */ }
      </Menu>
    </div>
  )
};

export default AdminLeftMenuComponent;
