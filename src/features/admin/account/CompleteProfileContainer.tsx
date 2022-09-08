import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IState } from '../../../shared/store/reducers';
import {
  loadCurrentOrganization, saveOrganization
} from '../../../shared/store/actions/organizationActions';
import CompleteProfileComponent from './CompleteProfile';
import {loadCurrentUser, saveUser} from "../../../shared/store/actions/userActions";
import {ApiStatus} from "../../../shared/models";

interface ICompleteProfileContainerProps {

}

const CompleteProfileContainer: FunctionComponent<ICompleteProfileContainerProps> = ({

}: ICompleteProfileContainerProps) => {
  const [ save, setSave ] = useState(false);
  const [ saved, setSaved ] = useState(false);
  const organization = useSelector((state: IState) => state.organizations.organization);
  const updatingOrganization = useSelector((state: IState) => state.organizations.savingStatus);
  const currentUser = useSelector((state: IState) => state.users.user);
  const updatingUser = useSelector((state: IState) => state.users.savingStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadCurrentOrganization());
    dispatch(loadCurrentUser());

    return () => {
      dispatch(loadCurrentUser());
    };
  }, [ ]);

  useEffect(() => {
    if (save && updatingOrganization === ApiStatus.LOADED && updatingUser === ApiStatus.LOADED) {
      setSaved(true);
      setSave(false);
    }
  }, [ save, updatingOrganization, updatingUser ]);

  const onSubmit = useCallback((value: any) => {
    const { organization_name, ...rest } = value;
    dispatch(saveUser({
      uid: currentUser?.uid,
      accepted_terms_on: !currentUser?.accepted_terms_on ? new Date() : undefined,
      ...rest
    }));
    dispatch(saveOrganization({
      uid: organization?.uid,
      name: organization_name,
    }));

    setSave(true);
  }, [ currentUser, organization ]);

  return (
    <CompleteProfileComponent
      saved={saved}
      organization={organization}
      currentUser={currentUser}
      onSubmit={onSubmit} />
  )
};

export default CompleteProfileContainer;
