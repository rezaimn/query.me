import React, {FunctionComponent, useCallback, useState} from 'react';
import { useHistory } from 'react-router-dom';
import { Icon, Button, MenuItem } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Select, ItemRenderer } from '@blueprintjs/select';
import { Helmet } from 'react-helmet';

import './DatabaseConnection.scss';
import { IDatabaseForCreation, IDatabaseKind } from '../../../shared/models';
import { PanelTitle } from '../../../shared/components/layout/PanelTitle';
import { databaseTypes } from '../../../shared/utils/databases';
import DatabaseItem from './DatabaseItem';
import HelpComponent from "./Help";
import AddEditForm from "./AddEditForm";
import { showIntercom } from "../../../shared/utils/intercom";
import {IUser} from "../../../shared/models/";

type CurrentUser = IUser | undefined | null;

const popularDatabases = databaseTypes.filter(type => {
  return (
    type.backend === 'bigquery' ||
    type.backend === 'mssql' ||
    type.backend === 'mysql' ||
    type.backend === 'postgresql' ||
    type.backend === 'redshift' ||
    type.backend === 'snowflake' ||
    type.backend === 'exa'
  );
});

type OnCreateCallback = (database: IDatabaseForCreation) => void;

type DatabaseConnectionProps = {
  databaseCreating: boolean;
  databaseCreationError: boolean;
  onCreate: OnCreateCallback;
  currentUser: CurrentUser;
};

const DatabaseKindSelect = Select.ofType<IDatabaseKind>();

const renderDatabaseKind: ItemRenderer<IDatabaseKind> = (databaseKind, { handleClick, modifiers, query }) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      key={databaseKind.backend}
      onClick={handleClick}
      text={databaseKind.name}
    />
  );
};

const DatabaseConnectionComponent: FunctionComponent<DatabaseConnectionProps> = ({
  databaseCreating, databaseCreationError, onCreate, currentUser
}: DatabaseConnectionProps) => {
  const [ createInProgress, setCreateInProgress ] = useState(false);
  const [ step, setStep ] = useState(0);
  const [ databaseKind, setDatabaseKind ] = useState<IDatabaseKind | null>(null);
  const history = useHistory();

  const clearDatabaseKindState = useCallback(() => {
    setDatabaseKind(null);
  }, [ ]);

  if (createInProgress && !databaseCreating) {
    if (!databaseCreationError) {
      setCreateInProgress(false);
      history.push('/d/d');
    }
  }

  const onSelectDatabaseKind = (kind: IDatabaseKind) => {
    setDatabaseKind(kind);
    setStep(2);
  };

  const onCreateConnection = (database: any) => {
    onCreate({
      ...database,
      engine: databaseKind?.backend
    } as IDatabaseForCreation);
    setCreateInProgress(true);
  };

  const gotoStep = useCallback((step: number) => {
    if (step === 0) clearDatabaseKindState();
    setStep(step);
  }, [ ]);

  const renderStep1 = () => {
    return (
      <div className="database-connection__select-database">
        <div className="database-connection__select-database__title">
          Select a database to connect to query.me
        </div>
        <div className="database-connection__select-database__popular">
          {
            popularDatabases.map(db => (
              <DatabaseItem
                key={db.backend}
                kind={db}
                onSelect={onSelectDatabaseKind}
              ></DatabaseItem>
            ))
          }
        </div>
        <div className="database-connection__select-database__list">
          <div className="database-connection__select-database__list__hint">
            Your database is missing? <a role="button" href="#" onClick={() => showIntercom(currentUser)}>Request support for it.</a>
          </div>
        </div>
      </div>
    );
  }

  const renderStep2 = () => {
    const footer = (
      <div className="database-connection__toolbar">
        <Button
          icon={IconNames.CHEVRON_LEFT}
          className="database-connection__toolbar__button--back"
          onClick={() => gotoStep(0)}
        >Back</Button>
        <Button
          className="database-connection__toolbar__button"
          intent="primary"
          loading={databaseCreating}
          type="submit"
        >Connect</Button>
      </div>
    );

    return (
      <AddEditForm
        database={databaseKind}
        onSubmit={onCreateConnection}
        footer={footer} />
    );
  };

  return (
    <div className="database-connection">
      <Helmet>
        <title>
          {databaseKind ? `Connect to ${databaseKind.name}` : 'Connect to a Database'}
        </title>
      </Helmet>
      <HelpComponent currentUser={currentUser}/>
      <PanelTitle>
        <Icon icon={IconNames.DATABASE} />
        {databaseKind ? `Connect to ${databaseKind.name}` : 'Connect to a Database'}
      </PanelTitle>

      {
        (step === 0) ? (
          renderStep1()
        ) : (
          renderStep2()
        )
      }
    </div>
  )
};

export default DatabaseConnectionComponent;
