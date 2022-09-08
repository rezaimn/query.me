import React, { useEffect, FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Spinner } from '@blueprintjs/core';
import {editDatabase, loadDatabase} from '../../../shared/store/actions/databaseActions';
import { IState } from '../../../shared/store/reducers';
import {IDatabase, ApiStatus, IDatabaseForCreation} from "../../../shared/models";
import DatabaseEditComponent from "./DatabaseEdit";
import './DatabaseEditContainer.scss';

type DatabaseEditContainerParams = {
  databaseId: string;
};

type DatabaseEditContainerProps = RouteComponentProps<DatabaseEditContainerParams>;

const DatabaseEditContainer: FunctionComponent<DatabaseEditContainerProps> = ({
  match
}: DatabaseEditContainerProps) => {
  const databaseId = match.params.databaseId;

  const database = useSelector((state: IState) => state.databases.database);
  const loadingStatus = useSelector((state: IState) => state.databases.loadingStatus);
  const updatingStatus = useSelector((state: IState) => state.databases.updatingStatus);
  const currentUser = useSelector((state: IState) => state.users.user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadDatabase(databaseId,0,0,false,false));
  }, [ dispatch, databaseId ]);

  const onEdit = (databaseData: IDatabaseForCreation) => {
    if (database && database.uid) {
      dispatch(editDatabase(database.uid, databaseData));
    }
  };

  const showDatabase = !!(database && database.uid === databaseId); // if uid is equal, show database

  if (!showDatabase) {
    return (
      <div className="loading-indicator">
        <Spinner size={35} />
      </div>
    );
  }

  return (
    <DatabaseEditComponent
      onEdit={onEdit}
      database={database}
      databaseUpdated={updatingStatus === ApiStatus.LOADED}
      currentUser={currentUser}
    />
  );
};

export default withRouter(DatabaseEditContainer);
