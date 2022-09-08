import React, { FunctionComponent, Fragment, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import {
  configureSecurityInterceptorWithTokens,
  configureDefaultErrorInterceptor
} from '../services/Api';
import config from "../../config";

type SecurityProviderProps = {
};

const SecurityProvider: FunctionComponent<SecurityProviderProps> = ({
  children
}) => {
  const [ securityConfigured, setSecurityConfigured ] = useState(false);
  const [ redirect, setRedirect ] = useState(false);
  useEffect(() => {
    const accessTokenInput = document.getElementById('access_token') as HTMLInputElement;
    if (!accessTokenInput) {
      setRedirect(true);
      return;
    }

    const csrfTokenInput = document.getElementById('csrf_token') as HTMLInputElement;
    configureSecurityInterceptorWithTokens({
      accessToken: accessTokenInput?.value,
      csrfToken: csrfTokenInput?.value
    });
    configureDefaultErrorInterceptor();

    setSecurityConfigured(true);
  }, []);

  if (redirect) {
    return (
      <Redirect to={config.app.url + "/logout"} />
    );
  }

  return (
    <Fragment>
      {
        securityConfigured && children
      }
    </Fragment>
  );
};

export default SecurityProvider;
