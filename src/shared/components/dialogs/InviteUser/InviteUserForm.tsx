import React, {FunctionComponent, useEffect, useState} from 'react';
import { Classes, FormGroup, Button, Intent } from '@blueprintjs/core';
import { useForm } from 'react-hook-form';

import './InviteUserForm.scss';
import { IRole } from '../../../models';
import MultiSelect from '../../../../shared/components/form/MultiSelect';
import SuggestSelect from '../../form/SuggestSelect';

type InviteCallback = (data: any) => void;
type ActionCallback = (value?: any) => void;
type Defaults = {[key: string]: string};


type InviteUserFormComponentProps = {
  roles: IRole[];
  defaults?: Defaults;
  pending?: boolean;
  onInvite: InviteCallback;
  onClose: ActionCallback;
};

const InviteUserFormComponent: FunctionComponent<InviteUserFormComponentProps> = ({
  roles, defaults, pending, onInvite, onClose
}: InviteUserFormComponentProps) => {
  const { register, handleSubmit, errors, control } = useForm();
  const [ actionExecuted, setActionExecuted ] = useState(false);

  useEffect(() => {
    if (actionExecuted && !pending) {
      onClose(true); // user invited
    }
  }, [ actionExecuted, pending ]);

  const handleInvite = (data: any) => {
    onInvite({
      ...data,
      roles: [data.roles], // it has to be an array
      first_name: "",
      last_name: "",
    });
    setActionExecuted(true);
  };
  const options = roles?.map((role: any) => ({ name: role.name, value: role.id, id: role.id }));

  return (
    <form onSubmit={handleSubmit(handleInvite)}>
      <div className={`${Classes.DIALOG_BODY} invite-user`}>
        <FormGroup
          label="Email"
          labelFor="invitation-email-input"
        >
          <input
            className={`${Classes.INPUT} invite-user__form__email`}
            defaultValue={(defaults && defaults.email)}
            name="email"
            id="invitation-email-input"
            ref={register({
              required: true,
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Entered value does not match email format"
              }
            })}
          />
          { errors.email && (<span className="input-error">Email is required</span>) }
        </FormGroup>
        <FormGroup
          label="Roles"
          labelFor="invitation-roles-input"
        >
          <SuggestSelect
            id="invitation-roles-input"
            name="roles"
            errorMessage="Please select a role"
            formConfig={{ control, errors }}
            rules={{ required: true }}
            placeholder="Search for a role name"
            options={options} />
        </FormGroup>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button
            intent={Intent.PRIMARY}
            loading={pending}
            type="submit"
          >Invite</Button>
        </div>
      </div>
    </form>
  );
};

export default InviteUserFormComponent;
