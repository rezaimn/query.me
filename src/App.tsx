import React, { useEffect, FunctionComponent, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Helmet } from 'react-helmet';
import './App.scss';
import SecurityProvider from './shared/routing/SecurityProvider';
import RouterSwitch from './shared/routing/RouterSwitch';
import { history } from './shared/store';
import Header from './shared/components/layout/Header';
import config from "./config";
import { SearchResult } from './shared/models';
import { loadCurrentWorkspace, loadWorkspaces } from "./shared/store/actions/workspaceActions";
import { loadCurrentUser } from "./shared/store/actions/userActions";
import {IState} from "./shared/store/reducers";
import { mapPathToPageName } from './shared/utils/segment';
import { initIntercom } from "./shared/utils/intercom";
import { isLoggedIn } from './shared/utils/auth';
import MainSearch from './shared/components/mainSearch/mainSearch';
import { ActionProvider } from './shared/components/layout/ActionContext';
import { LayoutProvider } from './shared/components/layout/LayoutContext';

declare global {
  interface Window { analytics: any; }
}

/**
 * To handle Auth0 locally (at the level of the frontend), we
 * need to specify the following for routes:
 *
 * ```
 * <BrowserRouter>
 *   <Auth0ProviderWithHistory>
 *     <AppContent></AppContent>
 *   </Auth0ProviderWithHistory>
 * </BrowserRouter>
 * ```
 *
 * `Auth0ProviderWithHistory` must be imported:
 *
 * ```
 * import Auth0ProviderWithHistory from './shared/routing/Auth0ProviderWithHistory';
 * ```
 */

type SearchCallback = (text: string) => void;

type AppComponentProps = {
  searchResults: SearchResult[];
  searchLoading: boolean;
  onSearch: SearchCallback;
  totalSearchResults: number;
};

function AppContent ({
  searchResults, onSearch, totalSearchResults
}: { searchResults: SearchResult[]; onSearch: SearchCallback, totalSearchResults: number }) {
  const [ query, setQuery ] = useState('');
  const [ searchOpened, setSearchOpened ] = useState(false);
  const dispatch = useDispatch();
  const currentUser = useSelector((state: IState) => state.users?.user);

  useEffect(() => {
    dispatch(loadCurrentUser()); // used in Header area
  }, [ dispatch ]);

  useEffect(() => {
    if (isLoggedIn(currentUser)) {
      dispatch(loadCurrentWorkspace());
      dispatch(loadWorkspaces({})); // used in Header area
    }
  }, [ currentUser ]);

  const handleOpen = () => {
    setQuery('');
    setSearchOpened(true);
  };

  const trackPageView = useCallback((newState: any) => {
    if (isLoggedIn(currentUser)) {
      initIntercom(currentUser);

      if (config.segment.enabled) {
        const title = newState.title;
        const uid = currentUser?.uid;
        // track page call when title has changed in the component
        if (title && window.analytics) {
          const currentPath = window.location.pathname;
          const pageName = mapPathToPageName(currentPath, document.title);
          window.analytics.page(pageName, {userId: uid});
        }
      }
    }
  }, [ currentUser ]);

  return (
    <div>
      <Helmet onChangeClientState={trackPageView} titleTemplate="%s | Query.me">
        <link id="favicon" rel="icon" type="image/png" href="/static/assets/images/favicon.png" />
      </Helmet>
      <ActionProvider>
        <LayoutProvider>
          <Header onSearch={handleOpen} />
          <main className="layout__body">
              <RouterSwitch />
          </main>
        </LayoutProvider>
      </ActionProvider>
      <div>
        <MainSearch
          searchResults={searchResults}
          onSearch={onSearch}
          totalSearchResults={totalSearchResults}
          searchOpened={searchOpened}
          setSearchOpened={setSearchOpened}
          query={query}
          setQuery={setQuery}
        />
      </div>
    </div>
  );
}

const AppComponent: FunctionComponent<AppComponentProps> = ({
  searchResults, onSearch, totalSearchResults
}: AppComponentProps) => {
  return (
    <ConnectedRouter history={history}>
      <SecurityProvider>
        <AppContent
          searchResults={searchResults}
          totalSearchResults={totalSearchResults}
          onSearch={onSearch}
        />
      </SecurityProvider>
    </ConnectedRouter>
  );
}

export default AppComponent;
