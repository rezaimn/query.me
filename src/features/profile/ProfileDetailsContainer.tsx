import React, { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { loadCurrentUser, saveUser } from '../../shared/store/actions/userActions';
import { IState } from '../../shared/store/reducers';
import { ApiStatus, IUser } from '../../shared/models';
import ProfileDetailsComponent from './ProfileDetails';

type ProfileDetailsContainerProps = {

};

const ProfileDetailsContainer: FunctionComponent<ProfileDetailsContainerProps> = ({
}: ProfileDetailsContainerProps) => {
  const [ save, setSave ] = useState<boolean>(false);
  const currentUser = useSelector((state: IState) => state.users.user);
  const loadingStatus = useSelector((state: IState) => state.users.loadingStatus);
  const savingUser = useSelector((state: IState) => state.users.savingStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadCurrentUser());
  }, [ dispatch ]);

  useEffect(() => {
    /*
     * after saving, re-fetch user details
     */
    if (save === true && savingUser === ApiStatus.LOADED) {
      setSave(false);
      dispatch(loadCurrentUser());
    }
  }, [ save, savingUser ])

  const onSaveUser = (user: Partial<IUser>) => {
    dispatch(saveUser(user));
    setSave(true);
  };

  return (
    <ProfileDetailsComponent
      user={currentUser}
      userLoading={loadingStatus === ApiStatus.LOADING}
      onSaveUser={onSaveUser}
    ></ProfileDetailsComponent>
  );
};

export default withRouter(ProfileDetailsContainer);
