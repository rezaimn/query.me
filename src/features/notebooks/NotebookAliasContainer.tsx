import React, { useEffect, FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, RouteComponentProps, useHistory } from 'react-router-dom';
import { Spinner } from '@blueprintjs/core';

import { IState } from '../../shared/store/reducers';
import { ApiStatus } from '../../shared/models';
import { loadNotebookAlias, unsetNotebook } from "../../shared/store/actions/notebookActions";

import './NotebookAliasContainer.scss';

type NotebookAliasContainerParams = {
  notebookName: string;
  pageName?: string;
};

type NotebookAliasContainerParamsProps = RouteComponentProps<NotebookAliasContainerParams>;

const NotebookAliasContainer: FunctionComponent<NotebookAliasContainerParamsProps> = ({
  match
}: NotebookAliasContainerParamsProps) => {
  const notebookName = match.params.notebookName;
  const pageName = match.params.pageName;
  const notebook = useSelector((state: IState) => state.notebooks.notebook);
  const loadingStatus = useSelector((state: IState) => state.notebooks.loadingStatus);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (!notebookName) {
      history.push('/n');
    } else {
      dispatch(loadNotebookAlias(notebookName));
    }
  }, [ notebookName ]);

  useEffect(() => {
    if (loadingStatus === ApiStatus.LOADED) {
      if (!notebook) {
        history.push('/n');
      } else {
        if (pageName) {
          const page = notebook.pages.find((page: any) => page.name === pageName);

          if (page) {
            history.push(`/n/${notebook.uid}/${page.uid}`);
            return;
          }
        }
        history.push(`/n/${notebook.uid}`);
      }
    }

    return () => {
      // we unset notebook from state in order to reload it inside NotebookDetailsContainer
      dispatch(unsetNotebook());
    };
  }, [ loadingStatus, notebook ]);

  return (
    <div className="notebook-alias">
      <Spinner />
    </div>
  )
};

export default withRouter(NotebookAliasContainer);
