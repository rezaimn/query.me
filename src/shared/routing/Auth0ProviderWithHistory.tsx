import React, { FunctionComponent, Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '../security/auth0';

export type AppState = {
  returnTo?: string;
};

type Auth0ProviderWithHistoryProps = {
};

type AuthenticationCheckerProps = {
  auth0Initialized: boolean;
};

const auth0Audience = '';
const auth0ClientId = '';
const auth0Domain = '';

const AuthenticationChecker: FunctionComponent<AuthenticationCheckerProps> = ({
  auth0Initialized, children
}) => {
  const [authenticationChecked, setAuthenticationChecked] = useState(false);
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if (auth0Initialized && !authenticationChecked) {
    if (!isAuthenticated) {
      loginWithRedirect();
    } else {
      setAuthenticationChecked(true);
    }
  }
  return authenticationChecked ? (
    <Fragment>{children}</Fragment>
  ) : (
    <div>Loading...</div>
  );
};

const Auth0ProviderWithHistory: FunctionComponent<Auth0ProviderWithHistoryProps> = ({
  children
}) => {
  const history = useHistory();
  const [auth0Initialized, setAuth0Initialized] = useState(false);

  const onRedirectCallback = async (appState: AppState) => {
    history.push(appState?.returnTo || window.location.pathname);
  };

  const onInitialized = () => {
    setAuth0Initialized(true);
  };

  /* return auth0Domain && auth0ClientId ? (
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
      onInitialized={onInitialized}
      audience={auth0Audience}
      cacheLocation="localstorage"
    >
      <AuthenticationChecker auth0Initialized={auth0Initialized}>
        {children}
      </AuthenticationChecker>
    </Auth0Provider>
  ) : (<div>Auth0 not configured</div>); */
  return (<div>disabled</div>);
};

export default Auth0ProviderWithHistory;
