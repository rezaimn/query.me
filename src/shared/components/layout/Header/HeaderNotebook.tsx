import React, {FunctionComponent, useCallback, useEffect, useMemo, useRef, useState} from "react";
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import { Colors, EditableText, Icon, Intent, Spinner } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import {IState} from "../../../store/reducers";
import {ApiStatus, IUser, IWorkspace} from "../../../models";
import {
  duplicateNotebook,
  unsetDuplicatedNotebook,
  // executeNotebook,
  // executeNotebookPage,
  saveNotebook,
  shareNotebookWithWorkspace,
  toggleConfigView,
} from "../../../store/actions/notebookActions";
import {
  executeNotebook,
  executeNotebookPage,
} from "../../../services/notebooksApi";
import ShareNotebook from './ShareNotebook';
import ScheduleNotebookContainer from './ScheduleNotebook';
import {isLoggedIn, isAdmin, isUser, isGuest} from '../../../utils/auth';
import HeaderExecuteButton from './HeaderExecuteButton';
import HeaderNavigationItem from './HeaderNavigationItem';
import HeaderHelp from './HeaderHelp';
import HeaderAvatar from './HeaderAvatar';
import { notebookFromWorkspace } from '../../../../features/notebooks/utils';
import { useActions } from '../ActionContext';

type CallbackFn = (value?: any) => void;

type HeaderPropertiesType = { [key: string]: string | boolean };

interface INotebookHeaderProps {
  onSearch?: CallbackFn;
  headerProperties: HeaderPropertiesType;
  currentUser: IUser | undefined | null;
  workspaces?: IWorkspace[] | undefined | null;
}

interface INotebookHeaderOtherWorkspaceProps {
  isLoggedIn: boolean;
  headerProperties: HeaderPropertiesType;
  onCopy?: CallbackFn;
}

const GoToNotebookListBtn = () => (
  <NavLink to="/n">
    <div className="header__icon__container notebook">
      <Icon icon={IconNames.MANUAL} className="header__icon" iconSize={30} />
    </div>
  </NavLink>
);

const NotebookHeaderOtherWorkspace: FunctionComponent<INotebookHeaderOtherWorkspaceProps> = ({
  isLoggedIn, headerProperties, onCopy,
}: INotebookHeaderOtherWorkspaceProps) => {
  const [ notebookTitle, setNotebookTitle ] = useState('');

  useEffect(() => {
    if (headerProperties.title) {
      setNotebookTitle(headerProperties.title as string);
    }
  }, [ headerProperties ]);

  return (
    <header className="header">
      <div className="header__icon__container notebook no-user">
        {
          isLoggedIn ? (
            <GoToNotebookListBtn />
          ) : (
            <Icon icon={IconNames.MANUAL} className="header__icon" iconSize={30} />
          )
        }
      </div>
      <div className="header__navigation">
        <div className="header__navigation__main" data-cy='notebookTitle'>
          <div className="header__navigation__label">{notebookTitle}</div>
          <Icon icon={IconNames.GLOBE} color={Colors.GRAY1} />
        </div>
        <div className="header__navigation__secondary">
          {
            onCopy && (
              <HeaderNavigationItem
                label="Copy to own Workspace"
                size="small"
                icon={IconNames.DUPLICATE}
                onAction={() => onCopy && onCopy()} />
            )
          }
          {
            !isLoggedIn && (
              <HeaderNavigationItem
                intent={Intent.PRIMARY}
                label="Sign in"
                size="small"
                icon={IconNames.LOG_IN}
                link="/" />
            )
          }
        </div>
      </div>
    </header>
  );
};

const NotebookHeader: FunctionComponent<INotebookHeaderProps> = ({
  headerProperties, onSearch, currentUser, workspaces
}: INotebookHeaderProps) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const savingPageStatus = useSelector((state: IState) => state.notebooks.savingPageStatus);
  const notebook = useSelector((state: IState) => state.notebooks.notebook);
  const pageUid = useSelector((state: IState) => state.notebooks.selectedNotebookPage?.uid);
  const currentWorkspace = useSelector((state: IState) => state.workspaces.workspace);
  const currentSharingSettings = useSelector((state: IState) => state.notebooks.currentSharingSettings);
  const duplicating = useSelector((state: IState) => state.notebooks.duplicatingStatus);
  const duplicatedNotebook = useSelector((state: IState) => state.notebooks.duplicatedNotebook);
  const [ notebookTitle, setNotebookTitle ] = useState('Untitled Notebook');
  const [ copying, setCopying ] = useState<boolean>(false);
  const [ editable, setEditable ] = useState<boolean>(true);
  const [ notebookTitleChanged, setNotebookTitleChanged ] = useState(false);
  const [ displaySavingStatus, setDisplaySavingStatus ] = useState(false);
  const [ resultsToCheck, setResultsToCheck ] = useState({});
  const { dispatchAction, addActionListener, removeActionListener } = useActions();
  const notebookUid = notebook?.uid;
  const notebookId = notebook?.id;
  const notebookLoadingStatus = useSelector((state: IState) => state.notebooks.loadingStatus);

  const isFromWorkspace = useMemo(() => {
    return notebookFromWorkspace(notebook, currentWorkspace);
  }, [ notebook, currentWorkspace ]);

  const isNotGuest = useMemo(() => isLoggedIn(currentUser) && !isGuest(currentUser), [ currentUser ]);

  useEffect(() => {
    if (headerProperties.title) {
      setNotebookTitle(headerProperties.title as string);
      setEditable(headerProperties.editable as boolean);
    }
  }, [ headerProperties ]);

  useEffect(() => {
    let timeoutId: any = null;
    if (savingPageStatus === ApiStatus.LOADING) {
      setDisplaySavingStatus(true);
    } else if (savingPageStatus === ApiStatus.LOADED && displaySavingStatus) {
      timeoutId = setTimeout(() => {
        setDisplaySavingStatus(false);
      }, 3000);
    } else if (displaySavingStatus) {
      setDisplaySavingStatus(false);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }, [ savingPageStatus, displaySavingStatus ]);

  useEffect(() => {
    if (copying && duplicating === ApiStatus.LOADED && duplicatedNotebook?.uid) {
      /*
       * Notebook successfully copied to own workspace
       */
      history.push(`/n/${duplicatedNotebook?.uid}`);
    }

    return () => {
      unsetDuplicatedNotebook();
    };
  }, [ copying, duplicating, duplicatedNotebook ]);

  const onResultFinished = useCallback(({ action, blockUid }) => {
    if (action !== 'result-finished') {
      return;
    }

    setResultsToCheck(resultsToCheck => ({
      ...resultsToCheck,
      [blockUid]: undefined
    }));
  }, []);

  useEffect(() => {
    addActionListener('notebook-header', onResultFinished);
    return () => {
      removeActionListener('notebook-header');
    };
  }, []);

  const onNotebookNameChange = useCallback((value: string) => {
    setNotebookTitle(value);
    setNotebookTitleChanged(true);
  }, [ ]);

  const onUpdateNotebookName = useCallback((value: string) => {
    if (notebookTitleChanged && value && headerProperties.elementId) {
      dispatch(saveNotebook(headerProperties.elementId as string, { name: value }));
    }
  }, [ notebookTitleChanged ]);

  const onExecuteNotebook = useCallback(() => {
    if (notebookUid) {
      executeNotebook(notebookUid)
        .then((response: any) => {
          const { result } = response;
          const newResults =
            Object.keys(result)
              .map(resultKey => ({ uid: resultKey, executionUid: result[resultKey]}))
              .filter((resultItem: any) => resultItem && resultItem.executionUid);

          setResultsToCheck(newResults.reduce((acc, item) => ({
            ...acc,
            [item.uid]: item.executionUid
          }), {}));
          newResults.forEach((newResult) => {
            dispatchAction({
              action: 'check-result',
              blockUid: newResult.uid,
              runId: newResult.executionUid
            });
          })
        });
    }
  }, [ notebookUid ]);

  const onExecuteNotebookPage = useCallback(() => {
    if (pageUid) {
      executeNotebookPage(pageUid)
        .then((response: any) => {
          const { result } = response;
          const newResults =
            Object.keys(result)
              .map(resultKey => ({ uid: resultKey, executionUid: result[resultKey]}))
              .filter((resultItem: any) => resultItem && resultItem.executionUid);

          setResultsToCheck(newResults.reduce((acc, item) => ({
            ...acc,
            [item.uid]: item.executionUid
          }), {}));
          newResults.forEach((newResult) => {
            dispatchAction({
              action: 'check-result',
              blockUid: newResult.uid,
              runId: newResult.executionUid
            });
          })
        });
    }
  }, [ pageUid ]);

  const onConfigBtnClick = useCallback(() => {
    dispatch(toggleConfigView());
  }, []);

  const onCopyNotebook = useCallback(() => {
    /*
     * In case user is logged in and notebook is not editable and it's from a different Workspace,
     * copy notebook to the current workspace.
     */
    if (isLoggedIn(currentUser) && !editable && notebookUid && !isFromWorkspace) {
      dispatch(duplicateNotebook(notebookUid));
      setCopying(true);
    }
  }, [ editable, notebook, isFromWorkspace ]);

  if (isLoggedIn(currentUser) && !editable && !isFromWorkspace) {
    return (
      <NotebookHeaderOtherWorkspace
        isLoggedIn={true}
        headerProperties={headerProperties}
        onCopy={isAdmin(currentUser) ? onCopyNotebook : undefined} />
    );
  } else if (!isLoggedIn(currentUser)) {
    // this can happen is Notebook is public
    return <NotebookHeaderOtherWorkspace
      isLoggedIn={false}
      headerProperties={headerProperties} />;
  }

  const titleIntent = !notebookTitle ? Intent.DANGER : undefined;
  return (
    <header className="header">
      <GoToNotebookListBtn />
      <div className="header__navigation">
        <div className="header__navigation__main" data-cy='notebookTitle'>
          <EditableText
            className="header__navigation__label"
            value={notebookTitle}
            intent={titleIntent}
            onChange={onNotebookNameChange}
            onConfirm={onUpdateNotebookName}/>
          { notebook?.is_public && <Icon icon={IconNames.GLOBE} color={Colors.GRAY1} /> }
          {
            displaySavingStatus && (
              <div className="header__navigation__indicator">{
                savingPageStatus === ApiStatus.LOADED ? 'Saved!' : (
                  savingPageStatus === ApiStatus.LOADING ? 'Saving...' : ''
                )
              }</div>
            )
          }
          {
            (notebookLoadingStatus === ApiStatus.LOADING) && (
              <Spinner size={15} className='notebook-load-spinner'/>
            )
          }
        </div>
        <div className="header__navigation__secondary">
          <ScheduleNotebookContainer uid={notebookUid} id={notebookId} />
          {
            editable && (
              <HeaderExecuteButton
                resultsToCheck={resultsToCheck}
                onExecuteNotebook={onExecuteNotebook}
                onExecuteNotebookPage={onExecuteNotebookPage} />
            )
          }
          {
            (isAdmin(currentUser) || isUser(currentUser)) && editable && (
              <ShareNotebook uid={notebookUid} />
            )
          }
          {
            isNotGuest && (
              <>
                <HeaderNavigationItem onAction={onConfigBtnClick} icon={IconNames.SETTINGS} />
                <HeaderNavigationItem
                  label=""
                  icon={IconNames.SEARCH}
                  onAction={() => onSearch && onSearch()} />
              </>
            )
          }
          <HeaderHelp
            currentUser={currentUser} />
          <HeaderAvatar
            currentUser={currentUser}
            workspaces={workspaces} />
        </div>
      </div>
    </header>
  );
};

export default NotebookHeader;
