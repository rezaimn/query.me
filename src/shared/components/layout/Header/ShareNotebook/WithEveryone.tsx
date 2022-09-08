import React, { Fragment, FunctionComponent, useCallback, useMemo, useState } from 'react';
import {
  Button,
  Classes,
  Colors,
  Dialog,
  Icon,
  Intent,
  Switch,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import debounce from 'lodash/debounce';
import SelectAction from './SelectAction';

type Callback = (value: any) => void;

interface IWithEveryoneProps {
  isPublic: boolean;
  onChange: Callback;
}

interface WithEveryoneDialogProps {
  onClose: Callback;
  onConfirm: Callback;
}

const WithEveryoneDialog: FunctionComponent<WithEveryoneDialogProps> = ({
  onClose,
  onConfirm,
}: WithEveryoneDialogProps) => {
  return (
    <Fragment>
      <div className={Classes.DIALOG_BODY}>
        By clicking on "<b>Confirm</b>",
        you understand that <b>anyone</b> with the link can view this notebook.
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={onClose}>Cancel</Button>
          <Button intent={Intent.PRIMARY} onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </Fragment>
  )
};
/*
 * @TODO - refactor - add WithEveryoneContainer
 */
const WithEveryone: FunctionComponent<IWithEveryoneProps> = ({ isPublic, onChange }: IWithEveryoneProps) => {
  const [ checked, setChecked ] = useState<boolean>(isPublic);
  const [ showDialog, setShowDialog ] = useState<boolean>(false);
  const debounceOnChange = useMemo(() => debounce(onChange, 400), [ ]);

  const ForEveryoneLabel = useMemo(() => (
    <>
      <Icon icon={IconNames.GLOBE} color={Colors.GRAY1} /> Everyone on the internet
    </>
  ), [ ]);

  const handleOnChange = useCallback((event: any) => {
    const value = event.target.checked;

    if (value) {
      setShowDialog(true);
    } else {
      setChecked(value);
      debounceOnChange(value);
    }
  }, [ ]);

  const onCloseDialog = useCallback((event: any) => {
    setShowDialog(false);
  }, [ ]);

  const onConfirmDialog = useCallback((event: any) => {
    /*
     * set Notebook to public
     */
    setChecked(true);
    debounceOnChange(true);
    setShowDialog(false); // close dialog
  }, [ ]);

  return (
    <div className="share-notebook__popover__content">
      <Switch
        className="share-notebook__popover__everyone"
        inline={true}
        large={true}
        labelElement={ForEveryoneLabel}
        checked={checked}
        onChange={handleOnChange}
      />
      <SelectAction />
      <Dialog
        autoFocus={true}
        enforceFocus={true}
        isOpen={showDialog}
        usePortal={true}
        title="Confirm action"
        icon={<Icon icon={IconNames.WARNING_SIGN} intent={Intent.WARNING} />}
      >
        <WithEveryoneDialog
          onClose={onCloseDialog}
          onConfirm={onConfirmDialog} />
      </Dialog>
    </div>
  );
}

export default WithEveryone;
