import React, { Fragment, FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Intent,
  Position,
  Toaster,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import {
  IDatabase,
  IDatabaseSharingSettings,
  IUser,
} from '../../../../shared/models';
import ShareDatabaseDialog from './ShareDatabaseDialog';
import { IState } from '../../../../shared/store/reducers';

interface IShareDatabaseProps {
  database: IDatabase;
  currentSharingSettings?: IDatabaseSharingSettings | null;
  currentUser?: IUser | null;
}

const sharingSettingsToaster = Toaster.create({
  position: Position.TOP
});

const ShareDatabaseButton: FunctionComponent<IShareDatabaseProps> = ({
  database,
}: IShareDatabaseProps) => {
  const [ shared, setShared ] = useState(false);
  const [ show, setShow ] = useState(false);
  const [ sharingSettingsIcon, setSharingSettingsIcon ] = useState<any>(null);

  const currentSharingSettings = useSelector((state: IState) => state.databases.currentSharingSettings);
  const currentUser = useSelector((state: IState) => state.users.user);

  useEffect(() => {
    /*
     * @TODO - move to a common place as it is almost* identical to the one from Notebooks
     */
    if (currentSharingSettings) {
      let currentUserUid = currentUser?.uid as string;
      let sharedWithOtherUsers = false;
      if (currentSharingSettings.shared_with_users.length) {
        /*
         * check if shared with users list contains other users than the current user
         */
        sharedWithOtherUsers = currentSharingSettings
          .shared_with_users
          .filter((u: any) => u.uid !== currentUserUid).length > 0;
      }

      if (
        currentSharingSettings.shared_with_workspace.edit ||
        currentSharingSettings.shared_with_workspace.use ||
        currentSharingSettings.shared_with_workspace.view) {
        setSharingSettingsIcon(IconNames.OFFICE);
      } else if (sharedWithOtherUsers) {
        setSharingSettingsIcon(IconNames.PEOPLE);
      } else {
        setSharingSettingsIcon(IconNames.LOCK);
      }
    }
  }, [ currentSharingSettings ]);

  const onClick = useCallback(() => {
    setShow(!show);
  }, [ show ]);

  const onClose = useCallback(() => {
    setShow(false);
    if (shared) {
      // if any share action happened, show a toast message after sharing settings modal was closed
      sharingSettingsToaster.show({
        message: "Sharing settings successfully updated.",
        intent: Intent.SUCCESS
      });
    }
  }, [ shared ]);

  const onShare = useCallback(() => {
    /*
     * if any share action happened, set shared to true
     */
    if (!shared) {
      setShared(true);
    }
  }, [ shared ]);

  return (
    <Fragment>
      <Button
        fill={false}
        minimal={false}
        icon={sharingSettingsIcon}
        onClick={onClick}
        >Share</Button>
      <ShareDatabaseDialog
        show={show}
        onClose={onClose}
        onShare={onShare}
        database={database} />
    </Fragment>
  )
};

export default ShareDatabaseButton;
