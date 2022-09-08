import React, { FunctionComponent, Fragment, useState } from 'react';
import { Classes, Button, Intent } from '@blueprintjs/core';

type ActionCallback = () => void;

type ConfirmDialogComponentProps = {
  message: string;
  pending: boolean;
  onConfirm: ActionCallback;
  onClose: ActionCallback;
};

const ConfirmDialogComponent: FunctionComponent<ConfirmDialogComponentProps> = ({
  message, pending, onConfirm, onClose
}: ConfirmDialogComponentProps) => {
  const [ actionExecuted, setActionExecuted ] = useState(false);

  if (actionExecuted && !pending) {
    onClose();
    setActionExecuted(false);
  }

  const onTriggerConfirm = () => {
    setActionExecuted(true);
    onConfirm();
  };

  return (
    <Fragment>
      <div className={Classes.DIALOG_BODY}>
        {message}
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button
            onClick={onClose}
          >Cancel</Button>
          <Button
            intent={Intent.PRIMARY}
            loading={pending}
            onClick={onTriggerConfirm}
          >Confirm</Button>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmDialogComponent;
