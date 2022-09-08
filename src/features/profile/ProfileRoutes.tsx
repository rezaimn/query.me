import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import ProfileDetailsContainer from './ProfileDetailsContainer';

function ProfileComponent() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <ProfileDetailsContainer />
      </Route>
    </Switch>
  );
}

export default ProfileComponent;
