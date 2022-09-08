import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  createDatabase,
} from '../../../shared/store/actions/databaseActions';
import { IState } from '../../../shared/store/reducers';
import { ApiStatus, IDatabaseForCreation } from '../../../shared/models';
import DatabaseConnectionComponent from './DatabaseConnection';
import {IUser} from "../../../shared/models/";

type CurrentUser = IUser | undefined | null;

type DatabaseConnectionContainerProps = {};

const DatabaseConnectionContainer: FunctionComponent<DatabaseConnectionContainerProps> = ({
}: DatabaseConnectionContainerProps) => {
  const [ creating, setCreating ] = useState(false);
  const creatingStatus = useSelector((state: IState) => state.databases.creatingStatus);
  const currentUser = useSelector((state: IState) => state.users.user);
  const dispatch = useDispatch();

  const onCreate = useCallback((database: IDatabaseForCreation) => {
    dispatch(createDatabase(database));
    setCreating(true);
  }, [ ]);

  return (
    <DatabaseConnectionComponent
      databaseCreating={creatingStatus === ApiStatus.LOADING}
      databaseCreationError={creatingStatus === ApiStatus.FAILED}
      onCreate={onCreate}
      currentUser={currentUser}
    />
  );
};

export default DatabaseConnectionContainer;
