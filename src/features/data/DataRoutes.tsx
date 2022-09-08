import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import PanelWithLeftMenu from '../../shared/components/layout/PanelWithLeftMenu';
import WizardPanel from '../../shared/components/layout/WizardPanel';
import DatabaseListContainer from './databases/DatabaseListContainer';
import DatabaseDetailsContainer from './databases/DatabaseDetailsContainer';
import DatabaseConnectionContainer from './databases/DatabaseConnectionContainer';
import DatabaseEditContainer from './databases/DatabaseEditContainer';
import SchemaListContainer from './schemas/SchemaListContainer';
import SchemaDetailsContainer from './schemas/SchemaDetailsContainer';
import TableListContainer from './tables/TableListContainer';
import TableDetailsContainer from './tables/TableDetailsContainer';
import HasAccess from '../../shared/routing/HasAccess';

function DataComponent() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <Redirect to={`${path}/d`} />
      </Route>
      { /* Databases */ }
      <Route exact path={`${path}/d`}>
        <PanelWithLeftMenu>
          <DatabaseListContainer />
        </PanelWithLeftMenu>
      </Route>
      <Route path={`${path}/d/connect`}>
        <HasAccess>
          <WizardPanel>
            <DatabaseConnectionContainer />
          </WizardPanel>
        </HasAccess>
      </Route>
      <Route path={`${path}/d/v/:viewId`}>
        <PanelWithLeftMenu>
          <DatabaseListContainer />
        </PanelWithLeftMenu>
      </Route>
      <Route path={`${path}/d/:databaseId/edit`}>
        <HasAccess>
          <WizardPanel>
            <DatabaseEditContainer />
          </WizardPanel>
        </HasAccess>
      </Route>
      <Route path={`${path}/d/:databaseId`}>
        <PanelWithLeftMenu>
          <DatabaseDetailsContainer />
        </PanelWithLeftMenu>
      </Route>
      { /* Schemas */ }
      <Route exact path={`${path}/s`}>
        <PanelWithLeftMenu>
          <SchemaListContainer />
        </PanelWithLeftMenu>
      </Route>
      <Route path={`${path}/s/v/:viewId`}>
        <PanelWithLeftMenu>
          <SchemaListContainer />
        </PanelWithLeftMenu>
      </Route>
      <Route path={`${path}/s/:schemaId`}>
        <PanelWithLeftMenu>
          <SchemaDetailsContainer />
        </PanelWithLeftMenu>
      </Route>
      { /* Tables */ }
      <Route exact path={`${path}/t`}>
        <PanelWithLeftMenu>
          <TableListContainer />
        </PanelWithLeftMenu>
      </Route>
      <Route path={`${path}/t/v/:viewId`}>
        <PanelWithLeftMenu>
          <TableListContainer />
        </PanelWithLeftMenu>
      </Route>
      <Route path={`${path}/t/:tableId`}>
        <PanelWithLeftMenu>
          <TableDetailsContainer />
        </PanelWithLeftMenu>
      </Route>
    </Switch>
  );
}

export default DataComponent;
