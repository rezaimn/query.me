import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import PanelWithLeftMenu from '../../shared/components/layout/PanelWithLeftMenu';
import NotebookListContainer from './NotebookListContainer';
import NotebookDetailsContainer from './NotebookDetailsContainer';
import NotebookAliasContainer from './NotebookAliasContainer';
import { GetNotebooksType } from './constants';

function NotebooksComponent() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <PanelWithLeftMenu>
          <NotebookListContainer type={GetNotebooksType.ALL} pageTitle={'All Notebooks'}/>
        </PanelWithLeftMenu>
      </Route>
      <Route exact path={`${path}/recent`}>
        <PanelWithLeftMenu>
          <NotebookListContainer  type={GetNotebooksType.RECENT} pageTitle={'Recently Viewed Notebooks'}/>
        </PanelWithLeftMenu>
      </Route>
      <Route exact path={`${path}/my-notebooks`}>
        <PanelWithLeftMenu>
          <NotebookListContainer type={GetNotebooksType.CREATED_BY_USER} pageTitle={'My Notebooks'}/>
        </PanelWithLeftMenu>
      </Route>
      <Route path={`${path}/v/:viewId`}>
        <PanelWithLeftMenu>
          <NotebookListContainer/>
        </PanelWithLeftMenu>
      </Route>
      <Route exact path={`${path}/a/:notebookName`}>
        <NotebookAliasContainer />
      </Route>
      <Route exact path={`${path}/a/:notebookName/:pageName`}>
        <NotebookAliasContainer />
      </Route>
      <Route exact path={`${path}/:notebookId`}>
        <PanelWithLeftMenu displayTitle={false} large={true}>
          <NotebookDetailsContainer/>
        </PanelWithLeftMenu>
      </Route>
      <Route exact path={`${path}/:notebookId/:pageId`}>
        <PanelWithLeftMenu displayTitle={false} large={true}>
          <NotebookDetailsContainer/>
        </PanelWithLeftMenu>
      </Route>
      <Route exact path={`${path}/:notebookId/:pageId/:blockId`}>
        <PanelWithLeftMenu displayTitle={false} large={true}>
          <NotebookDetailsContainer/>
        </PanelWithLeftMenu>
      </Route>
      <Route exact path={`${path}/:notebookId/:pageId/:blockId/embed`}>
        <PanelWithLeftMenu displayTitle={false} large={true}>
          <NotebookDetailsContainer></NotebookDetailsContainer>
        </PanelWithLeftMenu>
      </Route>
    </Switch>
  );
}

export default NotebooksComponent;
