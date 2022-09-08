import React, { Fragment, FunctionComponent, useCallback, useState } from 'react';
import {
  Button
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import InviteUserDialogContainer from '../../../shared/components/dialogs/InviteUser/InviteUserDialog';

interface IInviteUserProps {

}

const InviteUserButton: FunctionComponent<IInviteUserProps> = ({}: IInviteUserProps) => {
  const [ show, setShow ] = useState(false);

  const onClick = useCallback(() => {
    setShow(!show);
  }, [ show ]);

  const onClose = useCallback(() => {
    setShow(false);
  }, [ ]);

  return (
    <Fragment>
      <Button
        icon={IconNames.ADD}
        intent="primary"
        onClick={onClick}
        >Invite User</Button>
      <InviteUserDialogContainer
        show={show}
        onClose={onClose} />
    </Fragment>
  )
};

export default InviteUserButton;
