import React, { Fragment, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Popover, Menu, MenuDivider, MenuItem, Position, Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import './HeaderAvatar.scss';
import Avatar from "../../image/Avatar";
import config from "../../../../config";
import { IUser, IWorkspace } from "../../../models";
import { switchWorkspace } from '../../../store/actions/workspaceActions';


type CurrentUser = IUser | undefined | null;
type Workspaces = IWorkspace[] | undefined | null;

interface IWorkspacesPerOrganization {
  [key: string]: {
    organization: any,
    workspaces: IWorkspace[]
  }
}

type HeaderAvatarProps = {
  currentUser: CurrentUser;
  workspaces?: Workspaces;
};

const VoidElement: FunctionComponent = ({ children, ...atrributes }: any) => {
  return (
    <Fragment>{children}</Fragment>
  )
}

const workspaceMenuItems = (workspaces: Workspaces, onChangeWorkspace: Function) => {

  if (
    !workspaces ||
    (workspaces && workspaces.length <= 1)
  ) {
    return null;
  }

  const workspacesPerOrganization = workspaces
    .reduce((acc, workspace) => {
      const organization = workspace.organization;
      const key = organization.uid;

      if (!acc.hasOwnProperty(key)) {
        acc[key] = {
          organization: organization,
          workspaces: []
        }
      }
      acc[key].workspaces.push(workspace);

      return acc;
    }, {} as IWorkspacesPerOrganization)

  const totalOrg = Object.keys(workspacesPerOrganization).length;
  const lastOrgIndex = totalOrg - 1;
  return (
    <>
      <MenuItem
        icon={IconNames.APPLICATION}
        text="Workspaces"
        popoverProps={{ openOnTargetFocus: false }}>
        {
          Object
            .keys(workspacesPerOrganization)
            .map((key, index) => {
              const organization = workspacesPerOrganization[key].organization;
              const workspaces = workspacesPerOrganization[key].workspaces;

              return (
                <VoidElement key={"org_" + organization.uid}>
                  <MenuItem
                    key={organization.uid}
                    icon={IconNames.OFFICE}
                    text={organization.name}
                    className="header-avatar__organization-name"
                    disabled={true} />
                  {
                    workspaces.map(workspace => {
                      return (
                        <MenuItem
                          key={workspace.uid}
                          icon={IconNames.APPLICATION}
                          text={workspace.name}
                          onClick={() => onChangeWorkspace(workspace.uid)}
                          labelElement={workspace.is_active ? <Icon icon={IconNames.TICK} /> : undefined} />
                      )
                    })
                  }
                  { index !== lastOrgIndex ? <MenuDivider key={`divider_${index}`} /> : null }
                </VoidElement>
              )
            })
        }
      </MenuItem>
      <MenuDivider />
    </>
  )
}

const headerAvatarMenu = (currentUser: CurrentUser, workspaces: Workspaces, onChangeWorkspace: Function) => (
  <Menu>
      <li>
        <Link to={`/a/profile/${currentUser?.uid}`} className="bp3-menu-item bp3-popover-dismiss header-avatar__user-details">
          <div>
            <Icon icon={IconNames.USER} />
          </div>
          <div className="bp3-text-overflow-ellipsis bp3-fill">
            <strong>{currentUser?.first_name + " " + currentUser?.last_name}</strong> <br />
            {currentUser?.current_organization_name}
          </div>
        </Link>
      </li>
      <MenuDivider />

      { workspaceMenuItems(workspaces, onChangeWorkspace) }

      <MenuItem
        icon={IconNames.LOG_OUT}
        href={config.app.url + '/logout'}
        text="Log out" />
    </Menu>
)

const HeaderAvatar: FunctionComponent<HeaderAvatarProps> = ({ currentUser, workspaces }: HeaderAvatarProps) => {
  const dispatch = useDispatch();
  const onChangeWorkspace = (workspaceUid: string) => dispatch(switchWorkspace(workspaceUid));

  const avatarMenu = headerAvatarMenu(currentUser, workspaces, onChangeWorkspace);

  return (
    <div className="header-avatar">
      <Popover
        content={avatarMenu}
        position={Position.BOTTOM_LEFT}
      >
        <Avatar
          headerAvatar={true}
          rounded={true}
          inline={true}
          names={[ currentUser?.first_name || '', currentUser?.last_name || '' ]}
          image={currentUser?.avatar} />
      </Popover>
    </div>
  );
}

export default HeaderAvatar;
