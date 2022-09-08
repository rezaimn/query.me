import React, { FunctionComponent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { PanelTitle } from "../../../shared/components/layout/PanelTitle";
import {IDatabase, IDatabaseForCreation} from "../../../shared/models";
import HelpComponent from "./Help";
import AddEditForm from "./AddEditForm";
import './DatabaseEdit.scss';
import {IUser} from "../../../shared/models/";

type CurrentUser = IUser | undefined | null;

type OnEditCallback = (database: IDatabaseForCreation) => void;

type DatabaseEditProps = {
  database: IDatabase | null;
  databaseUpdated: boolean;
  onEdit: OnEditCallback;
  currentUser: CurrentUser;
};

const DatabaseEditComponent: FunctionComponent<DatabaseEditProps> = ({
  database, databaseUpdated, onEdit, currentUser
}: DatabaseEditProps) => {
  const [ submit, setSubmit ] = useState(false);
  const history = useHistory();

  const onSubmit = (databaseData: Partial<IDatabase>) => {
    onEdit({
      ...databaseData,
      engine: (database && database.backend) || ''
    } as IDatabaseForCreation);

    setSubmit(true);
  }

  if (submit && databaseUpdated) {
    history.push('/d/d');
    setSubmit(false);
  }

  return (
    <div className="database-edit">
      <HelpComponent currentUser={currentUser}/>
      <PanelTitle>
        <Icon icon={IconNames.DATABASE} />
        { database && `Edit ${database.database_name}` }
      </PanelTitle>
      <div>
        {
          database &&
          <AddEditForm database={database} onSubmit={onSubmit} />
        }
      </div>
    </div>
  )
};

export default DatabaseEditComponent;
