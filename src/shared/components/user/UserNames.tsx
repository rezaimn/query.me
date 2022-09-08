import React, { FunctionComponent } from 'react';

import { UserNames } from '../../models';

import './UserNames.scss';

type UserNamesProps = {
  user: UserNames
};

const UserNamesComponent: FunctionComponent<UserNamesProps> = ({
  user
}) => {
  return user ? (
    (user.first_name && user.last_name) ? (
      <div>{user.first_name} {user.last_name}</div>
    ) : (
      <div>Unknown user</div>
    )
  ) : (
    <div></div>
  );
}

export default UserNamesComponent;
