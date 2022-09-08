import React, {lazy} from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';

import PanelWithLeftMenu from '../../shared/components/layout/PanelWithLeftMenu';
import UserListContainer from './users/UserListContainer';
import AccountContainer from './account/AccountContainer';
import CompleteProfileContainer from './account/CompleteProfileContainer';
import ProfileComponent from '../profile/ProfileRoutes';
import HasAccess from '../../shared/routing/HasAccess';

function AdminComponent() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <HasAccess>
          <Redirect to={`${path}/u`} />
        </HasAccess>
      </Route>
      { /* Account */ }
      <Route exact path={`${path}/o`}>
        <HasAccess>
          <PanelWithLeftMenu>
            <AccountContainer />
          </PanelWithLeftMenu>
        </HasAccess>
      </Route>
      { /* Users */ }
      <Route exact path={`${path}/u`}>
        <HasAccess>
          <PanelWithLeftMenu>
            <UserListContainer />
          </PanelWithLeftMenu>
        </HasAccess>
      </Route>
      <Route exact path={`${path}/profile/:UID`}>
        <ProfileComponent />
      </Route>
      <Route exact path={`${path}/complete_profile`}>
        <CompleteProfileContainer />
      </Route>
    </Switch>
  );
}

export default AdminComponent;
