import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { loadCurrentOrganization, saveOrganization } from '../../../shared/store/actions/organizationActions';
import { IState } from '../../../shared/store/reducers';
import { ApiStatus, IOrganization } from '../../../shared/models';
import AccountComponent from './Account';

const AccountContainer = () => {
  const organization = useSelector((state: IState) => state.organizations.organization);
  const loadingStatus = useSelector((state: IState) => state.organizations.loadingStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadCurrentOrganization());
  }, [ dispatch ]);

  const onSaveOrganization = (organization: Partial<IOrganization>) => {
    dispatch(saveOrganization(organization));
  };

  return (
    <AccountComponent
      organization={organization}
      organizationLoading={loadingStatus === ApiStatus.LOADING}
      onSaveOrganization={onSaveOrganization}
    />
  );
};

export default withRouter(AccountContainer);
