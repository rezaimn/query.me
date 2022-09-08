import React, { FunctionComponent, useMemo, useState } from 'react';
import { Classes, FormGroup, Button, Intent } from '@blueprintjs/core';
import { useForm } from 'react-hook-form';

import { IRole, IUser } from '../../models';

import './EditUserDialog.scss';
import FormSelectElement from "../form/FormSelectElement";

type SaveCallback = (data: any) => void;
type ActionCallback = () => void;

type EditUserDialogComponentProps = {
  user: IUser;
  canEdit?: boolean; /* only admins can update roles */
  roles: IRole[];
  pending?: boolean;
  onSave: SaveCallback;
  onClose: ActionCallback;
};

const toRoleOption = (role: any) => ({ label: role.name, value: '' + role.id, id: role.id });

const EditUserDialogComponent: FunctionComponent<EditUserDialogComponentProps> = ({
  user,
  canEdit = false,
  pending,
  onSave,
  onClose,
  roles,
}: EditUserDialogComponentProps) => {
  const { register, handleSubmit, errors, control } = useForm();
  const [ actionExecuted, setActionExecuted ] = useState(false);

  if (actionExecuted && !pending) {
    onClose();
    setActionExecuted(false);
  }

  const handleSave = (data: any) => {
    const { roles } = data; // roles is actually 1 role right now, it's not a multiselect
    onSave({
      ...data,
      roles: roles ? [ roles ] : undefined
    });
    setActionExecuted(true);
  };

  const options = useMemo(() => roles?.map(toRoleOption), [ roles ]);
  const defaultValue = useMemo(() => user.main_roles?.map(toRoleOption)[0], [ user ]);

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <div className={`${Classes.DIALOG_BODY} edit-user`}>
        <div className="edit-user__form__names">
          <FormGroup
            label="First name"
            labelFor="user-first-name-input"
          >
            <input
              className={`${Classes.INPUT} edit-user__form__first-name`}
              defaultValue={user.first_name}
              name="first_name"
              id="user-first-name-input"
              ref={register({ required: true })}
            />
          </FormGroup>
          <FormGroup
            label="Last name"
            labelFor="invitation-last-name-input"
          >
            <input
              className={`${Classes.INPUT} edit-user__form__last-name`}
              defaultValue={user.last_name}
              name="last_name"
              id="user-last-name-input"
              ref={register({ required: true })}
            />
          </FormGroup>
        </div>
        {
          canEdit && (
            <FormSelectElement
              id="roles"
              label="Roles"
              options={options}
              placeholder="Enter a role name"
              errorMessage="Role is required"
              defaultValue={defaultValue}
              formConfig={{ control, errors }}
              rules={{ required: true }} />
          )
        }
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

export default EditUserDialogComponent;
