import React, { FunctionComponent, useState } from 'react';
import { Classes, FormGroup, Button, Intent } from '@blueprintjs/core';
import { useForm } from 'react-hook-form';

import { IOrganization } from '../../../shared/models';
import './EditOrganizationDialog.scss';

type SaveCallback = (data: any) => void;
type ActionCallback = () => void;

type EditOrganizationDialogComponentProps = {
  organization: IOrganization;
  pending?: boolean;
  onSave: SaveCallback;
  onClose: ActionCallback;
};

const EditOrganizationDialogComponent: FunctionComponent<EditOrganizationDialogComponentProps> = ({
  organization, pending, onSave, onClose
}: EditOrganizationDialogComponentProps) => {
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
      <div className={`${Classes.DIALOG_BODY} edit-organization`}>
        <div className="edit-organization__form__names">
          <FormGroup
            label="Name"
            labelFor="organization-name-input"
          >
            <input
              className={`${Classes.INPUT} edit-organization__form__name`}
              defaultValue={organization.name}
              name="name"
              id="organization-name-input"
              ref={register({ required: true })} 
            />
          </FormGroup>
        </div>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button
            intent={Intent.PRIMARY}
            loading={pending}
            type="submit"
          >Save</Button>
        </div>
      </div>
    </form>
  );
};

export default EditOrganizationDialogComponent;
