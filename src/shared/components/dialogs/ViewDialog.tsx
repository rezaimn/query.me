import React, { FunctionComponent, useState } from 'react';
import { Classes, FormGroup, Button, Intent } from '@blueprintjs/core';
import { useForm } from 'react-hook-form';

import './ViewDialog.scss';
import { IView } from '../../../shared/models';

type SaveCallback = (data: any) => void;
type ActionCallback = () => void;

type ViewDialogComponentProps = {
  view?: IView | null;
  pending?: boolean;
  onSave: SaveCallback;
  onClose: ActionCallback;
};

const ViewDialogComponent: FunctionComponent<ViewDialogComponentProps> = ({
  view, pending, onSave, onClose
}: ViewDialogComponentProps) => {
  const { register, handleSubmit } = useForm();
  const [ actionExecuted, setActionExecuted ] = useState(false);

  if (actionExecuted && !pending) {
    onClose();
    setActionExecuted(false);
  }

  const handleSave = (data: any) => {
    onSave(data);
    setActionExecuted(true);
  };

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <div className={`${Classes.DIALOG_BODY} view`}>
        <FormGroup
          label='Name'
          labelFor="invitation-email-input"
        >
          <input
            className={`${Classes.INPUT} view__form__email`}
            name="name"
            id="name-input"
            autoFocus={true}
            defaultValue={view ? view.name : ''}
            ref={register({ required: true })}
          />
        </FormGroup>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button
            onClick={onClose}
          >Cancel</Button>
          <Button
            intent={Intent.PRIMARY}
            loading={pending}
            type="submit"
          >{ view ? 'Save' : 'Create' }</Button>
        </div>
      </div>
    </form>
  );
};

export default ViewDialogComponent;
