import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Divider,
  Popover,
  Position,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import CopyLink from './CopyLink';
import WithEveryone from './WithEveryone';
import WithWorkspaceContainer from './WithWorkspace';
import { IState } from "../../../../store/reducers";
import {
  loadNotebookSharingSettings,
  loadedNotebookSharingSettings, saveNotebook, shareNotebookWithWorkspace,
} from '../../../../store/actions/notebookActions';
import config from '../../../../../config';
import './ShareNotebook.scss';
import WithUserContainer from "./WithUser";

type OnChangeCallback = (value: any) => void;

interface IShareNotebookProps {
  uid: string | undefined | null;
}

interface IShareNotebookPopover {
  notebookUid: string;
  isPublic: boolean;
  onIsPublicChange: OnChangeCallback;
  url: string;
}

const ShareNotebookPopover: FunctionComponent<IShareNotebookPopover> = ({
  notebookUid,
  isPublic,
  onIsPublicChange,
  url
}: IShareNotebookPopover) => {
  const dispatch = useDispatch();

  useEffect(() => {
    /*
     * load / remove Sharing Settings after every open / close
     */
    if (notebookUid) {
      dispatch(loadNotebookSharingSettings(notebookUid));
    }

    return () => {
      dispatch(loadedNotebookSharingSettings(null));
    };
    /*
     * only change use effect if notebookUid is changed,
     * but not currentSharingSettings because that will cause an infinite loop
     */
  }, [ notebookUid ]);

  return (
    <div className="share-notebook__popover">
      <h4 className="bp3-heading share-notebook__popover__title">Share this notebook:</h4>
      <WithEveryone isPublic={isPublic} onChange={onIsPublicChange} />
      <Divider />
      <WithWorkspaceContainer />
      <Divider />
      <WithUserContainer />
      <Divider />
      <CopyLink url={url} isPublic={isPublic} />
    </div>
  );
};

const ShareNotebook: FunctionComponent<IShareNotebookProps> = ({ uid }: IShareNotebookProps) => {
  const url = uid ? `${config.app.url}/n/${uid}` : '';
  const notebook = useSelector((state: IState) => state.notebooks.notebook);
  const currentUser = useSelector((state: IState) => state.users.user);
  const currentSharingSettings = useSelector((state: IState) => state.notebooks.currentSharingSettings);
  const isPublic = notebook?.is_public || false;
  const dispatch = useDispatch();
  const sharingSettingsRef: any = useRef();
  const [ sharingSettingsIcon, setSharingSettingsIcon ] = useState<any>(null);

  useEffect(() => {
    /*
     * in order to access the currentSharingSettings inside toggleIsPublic,
     * we had to save the currentSharingSettings into a ref;
     *
     * https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback
     */
    sharingSettingsRef.current = currentSharingSettings;
  }, [ currentSharingSettings ]);

  useEffect(() => {
    if (notebook && currentSharingSettings) {
      /*
       * We only set the icon value if currentSharingSettings exists in order to avoid unsetting the icon if
       *   sharing settings was removed (on close popover).
       */
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

      if (notebook.is_public) {
        // we include notebook as well because sometimes currentSharingSettings and notebook.is_public is out of sync
        setSharingSettingsIcon(IconNames.GLOBE);
      } else if (
        currentSharingSettings.shared_with_workspace.edit ||
        currentSharingSettings.shared_with_workspace.view) {
        setSharingSettingsIcon(IconNames.OFFICE);
      } else if (sharedWithOtherUsers) {
        setSharingSettingsIcon(IconNames.PEOPLE);
      } else {
        setSharingSettingsIcon(IconNames.LOCK);
      }
    }
  }, [ notebook, currentUser, currentSharingSettings ]);

  useEffect(() => {
    /*
     * load Sharing Settings
     */
    if (uid) {
      dispatch(loadNotebookSharingSettings(uid));
    }
  }, [ uid ]);

  const toggleIsPublic = useCallback((value: boolean) => {
    if (uid) {
      dispatch(saveNotebook(uid as string, { is_public: value }));

      const sharingSettings = sharingSettingsRef.current;
      if (
        value &&
        sharingSettings && !(
          sharingSettings.shared_with_workspace.edit ||
          sharingSettings.shared_with_workspace.view)
      ) {
        /*
         * If we share a notebook publicly and it is not share with the workspace already, share it
         */
        dispatch(shareNotebookWithWorkspace(uid, 'view'));
      }
    }
  }, [ uid, sharingSettingsRef ]);

  return (
    <div className="share-notebook">
      <Popover
        content={
          <ShareNotebookPopover
            onIsPublicChange={toggleIsPublic}
            isPublic={isPublic}
            url={url}
            notebookUid={uid as string} />
        }
        position={Position.BOTTOM_LEFT}
      >
        <Button
          icon={sharingSettingsIcon}
          text="Share"
        />
      </Popover>
    </div>
  );
};

export default ShareNotebook;
