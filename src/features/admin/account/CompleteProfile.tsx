import React, { Fragment, FunctionComponent, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Helmet } from "react-helmet";
import {
  Button,
  Icon,
  Intent,
  Position,
  Toaster,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import FormElement from '../../../shared/components/form/FormElement';
import {
  IOrganization,
  IUser
} from '../../../shared/models';
import { isAdmin } from '../../../shared/utils/auth';
import {
  getCookie,
  setCookie,
} from '../../../shared/utils/cookieManager';

import './CompleteProfile.scss';

const completeProfileToaster = Toaster.create({
  position: Position.TOP
});

type Callback = (value?: any) => void;

interface ICompleteProfileComponentProps {
  organization: IOrganization | null;
  currentUser: IUser | null;
  onSubmit: Callback;
  saved: boolean;
}

const CompleteProfileComponent: FunctionComponent<ICompleteProfileComponentProps> = ({
  organization,
  currentUser,
  onSubmit,
  saved,
}: ICompleteProfileComponentProps) => {
  const { handleSubmit, errors, control } = useForm();
  const history = useHistory();
  const title = "Complete Your Profile";
  const currentUserUid = currentUser?.uid as string;

  useEffect(() => {
    const cookieName = 'qm_cpv_' + (currentUserUid);

    const cookie = getCookie(cookieName); // query.me complete profile visited

    if (!cookie) {
      setCookie(cookieName, "true", 365);
    } else {
      /*
       * if cookie exists it means user already visited this page, so redirect user to homepage
       */
      history.push('/app');
    }
  }, [ ]);

  useEffect(() => {
    if (saved) {
      history.push('/app');

      completeProfileToaster.show({
        message: 'Profile updated successfully!',
        intent: Intent.SUCCESS
      });
    }
  }, [ saved ]);

  if (!organization || !currentUser) {
    return null;
  }

  return (
    <Fragment>
      <Helmet>
        <title>
          Query.me | {title}
        </title>
      </Helmet>
      <div className="complete-profile">
        <div className="complete-profile__content">
          <div className="complete-profile__title">
            <Icon icon={IconNames.OFFICE} />
            <div>{title}</div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="complete-profile__content__form">
            <FormElement
              id="first_name"
              label="First Name"
              defaultValue={currentUser?.first_name}
              errorMessage="First name is required"
              formConfig={{ control, errors }}
              rules={{ required: true }}
              placeholder="Enter your first name"
            />
            <FormElement
              id="last_name"
              label="Last Name"
              defaultValue={currentUser?.last_name}
              errorMessage="Last name is required"
              formConfig={{ control, errors }}
              rules={{ required: true }}
              placeholder="Enter your last name"
            />
            {
              isAdmin(currentUser) && (
                <FormElement
                  id="organization_name"
                  label="Organization Name"
                  defaultValue={organization?.name}
                  errorMessage="Organization name is required"
                  formConfig={{ control, errors }}
                  rules={{ required: true }}
                  placeholder="Enter your organization name"
                />
              )
            }
            <div className="complete-profile__form__form-buttons">
              <Button
                className="complete-profile__form__submit-button"
                intent="primary"
                type="submit">Submit</Button>
            </div>
          </form>
        </div>

    </div>
    </Fragment>
  );
};

export default CompleteProfileComponent;
