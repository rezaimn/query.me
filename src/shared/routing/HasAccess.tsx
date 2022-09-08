import React, { Fragment, FunctionComponent } from "react";
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Spinner } from '@blueprintjs/core';

import { IState } from '../store/reducers';
import { isLoggedIn, isGuest } from '../utils/auth';

import './HasAccess.scss';

/*
 * Handle logic to check if the current user has access to route.
 *
 * Guest user should not have access.
 */
const HasAccess: FunctionComponent = ({ children }: any) => {
  const currentUser = useSelector((state: IState) => state.users.user);

  if (!currentUser) {
    return (
      <div className="spinner">
        <Spinner size={30} />
      </div>
    );
  } else if (isLoggedIn(currentUser) === false || (isLoggedIn(currentUser) && isGuest(currentUser))) {
    return <Redirect to="/app" />
  }

  return (
    <Fragment>
      {children}
    </Fragment>
  );
};

export default HasAccess;
