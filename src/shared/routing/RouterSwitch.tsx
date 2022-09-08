import React, { Suspense } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import routes from './Routes';

/**
 * To handle Auth0 locally (at the level of the frontend), we
 * need to specify the following for routes:
 *
 * ```
 * <Route
 *   path={route.path}
 *   component={withAuthenticationRequired(route.component, {
 *     onRedirecting: () => <div>Loading routes</div>
 *   })}
 *   key={route.path}
 * />
 * ```
 * 
 * `withAuthenticationRequired` must be imported:
 * 
 * ```
 * import { withAuthenticationRequired } from '../security/auth0';
 * ```
 */

function RouterSwitch()  {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        {
          routes.map(route => 
            <Route
              path={route.path}
              component={route.component}
              key={route.path}
            />
          )
        }
      </Switch>
    </Suspense>
  );
}

export default withRouter(RouterSwitch);
