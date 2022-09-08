import React, { FunctionComponent, useLayoutEffect, useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { IconNames } from '@blueprintjs/icons';
import { useLocation } from 'react-router-dom';


import './Header.scss';
import HeaderNavigationItem from './HeaderNavigationItem';
import HeaderNewButton from "./HeaderNewButton";
import HeaderHelp from "./HeaderHelp";
import HeaderAvatar from './HeaderAvatar';
import Logo from './logo_light.svg';
import { IState } from '../../../store/reducers';
import { IUser, IWorkspace } from "../../../models";
import {
  createNotebook
} from '../../../store/actions/notebookActions';
import { defaultNotebookName } from "../../../../features/notebooks/utils";
import { isGuest, isLoggedIn } from '../../../utils/auth';
import NotebookHeader from './HeaderNotebook';
import DummyHeader from './DummyHeader';
import { useSetLayout, useLayout } from '../LayoutContext';

type SearchCallback = () => void;
type OnAddNotebookCallback = () => void;

type HeaderProps = {
  onSearch: SearchCallback;
};

type SpecializedHeaderProps = {
  onSearch?: SearchCallback;
  headerProperties: { [key: string]: string | boolean };
  currentUser: IUser | undefined | null;
  workspaces?: IWorkspace[] | undefined | null;
  onAddNotebook?: OnAddNotebookCallback;
};

const DefaultHeader: FunctionComponent<SpecializedHeaderProps> = ({
  onSearch, headerProperties, currentUser, workspaces, onAddNotebook
}: SpecializedHeaderProps) => {
  const [ loading, setLoading ] = useState<boolean>(true);

  useLayoutEffect(() => {
    if (isLoggedIn(currentUser)) {
      setLoading(false);
    }
  }, [ currentUser ]);

  const isNotGuest = useMemo(() => isLoggedIn(currentUser) && !isGuest(currentUser), [ currentUser ]);

  if (loading) {
    return <DummyHeader />;
  }

  return (
    <header className="header">
      <NavLink to="/app" className="header__logo">
        <img src={Logo} alt="Query.me" className="header__logo__image" />
      </NavLink>
      <div className="header__navigation">
        <div className="header__navigation__main">
          <HeaderNavigationItem link="/d"  label="Data" icon={IconNames.DATABASE} />
          <HeaderNavigationItem link="/n" label="Notebooks" icon={IconNames.MANUAL} />
          {
            isNotGuest && <HeaderNavigationItem
              label="Search"
              icon={IconNames.SEARCH}
              onAction={() => onSearch && onSearch()} />
          }
        </div>
        <div className="header__navigation__secondary">
          { isNotGuest && <HeaderNewButton onAddNotebook={() => onAddNotebook && onAddNotebook()} /> }
          { isNotGuest && <HeaderNavigationItem link="/a" icon={IconNames.COG} size="small" /> }
          <HeaderHelp currentUser={currentUser} />
          <HeaderAvatar currentUser={currentUser} workspaces={workspaces} />
        </div>
      </div>
    </header>
  );
};

const Header: FunctionComponent<HeaderProps> = ({ onSearch }) => {
  const headerKind = useSelector((state: IState) => state.ui.headerKind);
  const headerProperties = useSelector((state: IState) => state.ui.headerProperties);
  const currentUser = useSelector((state: IState) => state.users.user);
  const workspaces = useSelector((state: IState) => state.workspaces.workspaces);
  const dispatch = useDispatch();
  const location = useLocation();

  const {setHeaderDisplayed, setLeftMenuDisplayed } = useSetLayout();

  const isEmbedded = useMemo(() => location.pathname.indexOf('embed') > 0, [location]);

  useEffect(() => {
    setHeaderDisplayed(!isEmbedded);
    setLeftMenuDisplayed(!isEmbedded);
  },[isEmbedded]);

  const { headerDisplayed } = useLayout();

  const onAddNotebook = () => {
    dispatch(createNotebook({ name: defaultNotebookName() }));
  };

  if(!headerDisplayed) {
    return null;
  }

  switch(headerKind) {
    case 'notebook':
      return <NotebookHeader
        headerProperties={headerProperties}
        currentUser={currentUser}
        onSearch={onSearch}
        workspaces={workspaces}
      />;
    default:
      return <DefaultHeader
        headerProperties={headerProperties}
        onAddNotebook={onAddNotebook}
        onSearch={onSearch}
        currentUser={currentUser}
        workspaces={workspaces} />;
  }
};

export default Header;
