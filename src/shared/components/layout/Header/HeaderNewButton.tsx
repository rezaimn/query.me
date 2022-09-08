import React, { FunctionComponent, Fragment, useState, useCallback } from 'react';
import { Popover, Menu, MenuItem, Position, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import InviteUserDialogContainer from '../../dialogs/InviteUser/InviteUserDialog';
import HeaderNavigationButton from './HeaderNavigationButton';

type OnAddNotebookCallback = () => void;
type OnOpenInviteDialogCallback = () => void;

type HeaderNewButtonProps = {
  onAddNotebook: OnAddNotebookCallback;
};

const newButtonMenu = (onAddNotebook: OnAddNotebookCallback, onOpenInviteDialog: OnOpenInviteDialogCallback) => (
  <Menu>
    <MenuItem text="Notebook" icon={IconNames.MANUAL} onClick={() => onAddNotebook()} />
    <MenuItem text="Database connection" icon={IconNames.DATABASE} href="/d/d/connect" />
    <MenuItem text="User" icon={IconNames.USER} onClick={() => onOpenInviteDialog()} />
  </Menu>
)

const HeaderNewButton: FunctionComponent<HeaderNewButtonProps> = ({ onAddNotebook }: HeaderNewButtonProps) => {
  const [ showInviteDialog, setShowInviteDialog ] = useState(false);

  const onOpenInviteDialog = useCallback(() => {
    setShowInviteDialog(!showInviteDialog);
  }, [ showInviteDialog, setShowInviteDialog ]);

  const onCloseInviteDialog = useCallback(() => {
    setShowInviteDialog(false);
  }, [ setShowInviteDialog ]);

  const newBtnMenu = newButtonMenu(onAddNotebook, onOpenInviteDialog);

  return (
    <Fragment>
      <div className="header-new-button">
        <Popover
          content={newBtnMenu}
          position={Position.BOTTOM_LEFT}
        >
          <HeaderNavigationButton
            icon={IconNames.ADD}
            label="New"
            intent={Intent.PRIMARY} />
        </Popover>
      </div>
      <InviteUserDialogContainer
        show={showInviteDialog}
        onClose={onCloseInviteDialog} />
    </Fragment>
  )
}

export default HeaderNewButton;
