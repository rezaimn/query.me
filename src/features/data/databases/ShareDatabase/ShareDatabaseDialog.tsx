import React, { FunctionComponent } from 'react';
import {
  Classes,
  Dialog
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { IDatabase } from '../../../../shared/models';
import WithWorkspaceContainer from './WithWorkspace';
import WithUserContainer from './WithUser';

import './ShareDatabaseDialog.scss';

type Callback = (value?: any) => void;

interface IShareDatabaseDialogContainerProps {
  show: boolean;
  onClose: Callback;
  onShare: Callback;
  database: IDatabase;
}

interface IShareDatabaseDialogProps {
  show: boolean;
  onClose: Callback;
  onShare: Callback;
  database: IDatabase;
}

const ShareDatabaseDialog: FunctionComponent<IShareDatabaseDialogProps> = ({
  show,
  onClose,
  onShare,
  database,
}: IShareDatabaseDialogProps) => {
  const title = database ? `Share "${database?.database_name}" database` : 'Share database';
  return (
    <Dialog
      className="share-database-dialog-container"
      autoFocus={true}
      canEscapeKeyClose={true}
      canOutsideClickClose={true}
      enforceFocus={true}
      usePortal={true}
      isOpen={show}
      onClose={onClose}
      title={title}
      icon={IconNames.DATABASE}
    >
      <div className={Classes.DIALOG_BODY + ' share-database-dialog'}>
        <WithWorkspaceContainer database={database} onShare={onShare} />
        <WithUserContainer database={database} onShare={onShare} />
      </div>
    </Dialog>
  );
};

const ShareDatabaseDialogContainer: FunctionComponent<IShareDatabaseDialogContainerProps> = ({
  show = false,
  onClose,
  onShare,
  database,
}: IShareDatabaseDialogContainerProps) => {
  return (
    <ShareDatabaseDialog
      show={show}
      onClose={onClose}
      onShare={onShare}
      database={database}
    />
  )
};

export default ShareDatabaseDialogContainer;
