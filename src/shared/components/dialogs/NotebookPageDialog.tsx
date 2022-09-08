import React, { FunctionComponent, useState } from 'react';
import { Classes, FormGroup, Button, Intent } from '@blueprintjs/core';
import { useForm } from 'react-hook-form';

import './NotebookPageDialog.scss';
import { INotebookPage } from '../../../shared/models';

type SaveCallback = (data: any) => void;
type ActionCallback = () => void;

type PageDialogComponentProps = {
  page?: INotebookPage | null;
  pending?: boolean;
  onSave: SaveCallback;
  onClose: ActionCallback;
};

const PageDialogComponent: FunctionComponent<PageDialogComponentProps> = ({
  page, pending, onSave, onClose
}: PageDialogComponentProps) => {
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
    <form onSubmit={handleSubmit(handleSave)} className="page__form__name">
      <div className={`${Classes.DIALOG_BODY} page`}>
        <FormGroup
          label="Name"
          labelFor="page-name-input"
        >
          <input
            className={`${Classes.INPUT} page__form__name`}
            name="name"
            id="page-name-input"
            defaultValue={page ? page.name : ''}
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
          >{ page ? 'Save' : 'Create' }</Button>
        </div>
      </div>
    </form>
  );
};

export default PageDialogComponent;
