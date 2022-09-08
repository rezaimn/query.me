import React, { FunctionComponent, useState } from 'react';
import { Link, useRouteMatch, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Tag, Icon, Colors, Menu, MenuItem, MenuDivider, Popover, Position, Dialog, ButtonGroup, Button } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import TimeAgo from 'react-timeago';
import {Helmet} from "react-helmet";

import './Account.scss';
import { LeftMenu } from '../../../shared/components/layout/LeftMenu';
import { PanelTitle } from '../../../shared/components/layout/PanelTitle';
import { PanelTitleToolbar } from '../../../shared/components/layout/PanelTitleToolbar';
import { IOrganization } from '../../../shared/models';
import { IState } from "../../../shared/store/reducers";
import { isAdmin } from '../../../shared/utils/auth';
import AdminLeftMenuComponent from '../AdminLeftMenu';
import EditOrganizationDialogComponent from '../../../shared/components/dialogs/EditOrganizationDialog';
import LabelledText from '../../../shared/components/form/LabelledText';

type OpenEditOrganizationCallback = (user: IOrganization) => void;
type SaveOrganizationCallback = (user: Partial<IOrganization>) => void;

type AccountComponentProps = {
  organization: IOrganization | null;
  organizationLoading: boolean;
  onSaveOrganization: SaveOrganizationCallback;
};

const AccountComponent: FunctionComponent<AccountComponentProps> = ({
  organization, organizationLoading, onSaveOrganization
}: AccountComponentProps) => {
  const [ editOrganization, setEditOrganization ] = useState<IOrganization | null>(null);
  const currentUser = useSelector((state: IState) => state.users.user);

  const openEditOrganizationDialog = (organization: IOrganization) => {
    setEditOrganization(organization);
  };

  const closeEditOrganizationDialog = () => {
    setEditOrganization(null);
  }

  const saveOrganization = (updatedUser: Partial<IOrganization>) => {
    onSaveOrganization({
      ...updatedUser,
      uid: editOrganization?.uid
    });
    closeEditOrganizationDialog();
  };

  const rowMenuContent = (
    <Menu>
      <MenuItem
        icon={IconNames.EDIT}
        text="Edit Organization"
        onClick={() => organization && openEditOrganizationDialog(organization)}
      ></MenuItem>
      { /* <MenuDivider />
      <MenuItem icon={IconNames.DELETE} text="Remove from Account"></MenuItem> */ }
    </Menu>
  );

  return (
    <div>
      <Helmet>
        <title>
          Organization Settings
        </title>
      </Helmet>
      <LeftMenu>
        <AdminLeftMenuComponent></AdminLeftMenuComponent>
      </LeftMenu>
      <PanelTitle>
        <div className="organization__title">
          <Icon icon={IconNames.OFFICE} />
          <div>Account Settings</div>
        </div>
      </PanelTitle>
      <PanelTitleToolbar>
        {
          isAdmin(currentUser) && (
            <Popover
              content={rowMenuContent}
              position={Position.BOTTOM_RIGHT}
              className="organization__trigger"
            >
              <ButtonGroup className="organization__trigger__button">
                <Button rightIcon={IconNames.MORE}></Button>
              </ButtonGroup>
            </Popover>
          )
        }
      </PanelTitleToolbar>

      <div className="organization">
        <div className="organization__left">
          <LabelledText inline={true} label="Organization Name" labelUppercase={true} skeleton={organizationLoading}>
            {organization?.name}
          </LabelledText>
        </div>
        <div className="organization__right">
          <LabelledText
            inline={true}
            label="Created"
            labelUppercase={true}
            skeleton={organizationLoading}
          >
            {
              organization?.created_on_utc ? (
                <TimeAgo date={organization?.created_on_utc} />
              ) : (
                <div></div>
              )
            }
          </LabelledText>
          <LabelledText
            inline={true}
            label="Modified"
            labelUppercase={true}
            skeleton={organizationLoading}
          >
            {
              organization?.changed_on_utc ? (
                <TimeAgo date={organization?.changed_on_utc} />
              ) : (
                <div></div>
              )
            }
          </LabelledText>
          <LabelledText
            inline={true}
            label="Created by"
            labelUppercase={true}
            skeleton={organizationLoading}
          >
            {
              organization?.created_by ?
                (organization?.created_by.first_name || organization?.created_by.last_name) ?
                  `${organization?.created_by.first_name} ${organization?.created_by.last_name}` :
                  organization?.created_by.email :
              ''
            }
          </LabelledText>
        </div>
      </div>
      <Dialog
        autoFocus={true}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        enforceFocus={true}
        isOpen={!!editOrganization}
        usePortal={true}
        onClose={closeEditOrganizationDialog}
        title="Edit organization"
        icon={IconNames.OFFICE}
      >
        {
          editOrganization && (
            <EditOrganizationDialogComponent
              organization={editOrganization}
              onSave={saveOrganization}
              onClose={closeEditOrganizationDialog}
            ></EditOrganizationDialogComponent>
          )
        }
      </Dialog>
    </div>
  )
};

export default AccountComponent;
