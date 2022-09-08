import React, { Fragment, FunctionComponent, useState, useCallback } from 'react';
import { HelpTitle } from '../../../shared/components/layout/HelpTitle';
import { Help } from '../../../shared/components/layout/Help';
import HelpSectionTitle from '../../../shared/components/help/HelpSectionTitle';
import HelpSectionContent from '../../../shared/components/help/HelpSectionContent';
import {IUser} from "../../../shared/models/";
import {showIntercom} from "../../../shared/utils/intercom";
import config from "../../../config";
import InviteUserDialogContainer from '../../../shared/components/dialogs/InviteUser/InviteUserDialog';

import './Help.scss';

type CurrentUser = IUser | undefined | null;

type HelpProps = {
  currentUser: CurrentUser;
};

const HelpComponent: FunctionComponent<HelpProps> = ({currentUser}: HelpProps) => {
  const [ showInviteDialog, setShowInviteDialog ] = useState(false);

  const onOpenInviteDialog = useCallback(() => {
    setShowInviteDialog(!showInviteDialog);
  }, [ showInviteDialog, setShowInviteDialog ]);

  const onCloseInviteDialog = useCallback(() => {
    setShowInviteDialog(false);
  }, [ setShowInviteDialog ]);

  return (
    <Fragment>
      <HelpTitle>
        Getting Connected
      </HelpTitle>
      <Help>
        <HelpSectionTitle label="Don't know your credentials" />
        <HelpSectionContent>
          <div className="database-add-edit__invite" onClick={() => onOpenInviteDialog()}>Invite a team member</div>
        </HelpSectionContent>

        <HelpSectionTitle label="Firewall?" />
        <HelpSectionContent>
          Allow connections from this IP address:

          <ul>
            <li>18.156.113.81/32</li>
          </ul>
        </HelpSectionContent>

        <HelpSectionTitle label="Useful Links" />
        <HelpSectionContent>
          <ul className="no-margin-top">
            <li><a href={config.app.url + '/docs/data'} target="_blank">Documentation</a></li>
            <li><a href={config.app.url + '/docs/security'} target="_blank">Security</a></li>
            <li><a role="button" href="#" onClick={() => showIntercom(currentUser)}>Contact Support</a></li>
          </ul>
        </HelpSectionContent>
      </Help>
      <InviteUserDialogContainer
        show={showInviteDialog}
        onClose={onCloseInviteDialog} />
    </Fragment>
  )
};

export default HelpComponent;
