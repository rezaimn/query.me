import React, {FunctionComponent, useCallback, useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog
} from '@blueprintjs/core';

import { loadRoles } from '../../../../shared/store/actions/roleActions';
import { IState } from '../../../../shared/store/reducers';
import { IRole, IUser, ApiStatus } from '../../../../shared/models';
import { inviteUser } from '../../../../shared/store/actions/userActions';
import InviteUserFormComponent from './InviteUserForm';

type Callback = (value?: any) => void;

type Defaults = {[key: string]: string};

interface IInviteUserDialogContainerProps {
  show: boolean;
  onClose: Callback;
  defaults?: Defaults;
}

interface IInviteUserDialogProps {
  show: boolean;
  roles: IRole[];
  defaults?: Defaults;
  onClose: Callback;
  onInvite: Callback;
  pending: boolean; // invitation
}

const InviteUserDialog: FunctionComponent<IInviteUserDialogProps> = ({
  show,
  roles,
  defaults,
  onClose,
  onInvite,
  pending,
}: IInviteUserDialogProps) => {
  return (
    <Dialog
      autoFocus={true}
      canEscapeKeyClose={true}
      canOutsideClickClose={true}
      enforceFocus={true}
      usePortal={true}
      isOpen={show}
      onClose={onClose}
      title="Invite a new User"
      icon="user"
    >
      <InviteUserFormComponent
        roles={roles}
        defaults={defaults}
        onClose={onClose}
        onInvite={onInvite}
        pending={pending} />
    </Dialog>
  );
};

const InviteUserDialogContainer: FunctionComponent<IInviteUserDialogContainerProps> = ({
  show = false,
  onClose,
  defaults,
}: IInviteUserDialogContainerProps) => {
  const roles = useSelector((state: IState) => state.roles.roles);
  const invitingStatus = useSelector((state: IState) => state.users.invitingStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!roles || (roles && !roles.length)) {
      dispatch(loadRoles());
    }
  }, [ roles ]);

  const onUserInvite = useCallback((user: Partial<IUser>) => {
    dispatch(inviteUser(user));
  }, [ ]);

  return (
    <InviteUserDialog
      show={show}
      onClose={onClose}
      roles={roles}
      defaults={defaults}
      pending={invitingStatus === ApiStatus.LOADING}
      onInvite={onUserInvite} />
  )
};

export default InviteUserDialogContainer;
