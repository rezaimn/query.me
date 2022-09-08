import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { search } from './shared/store/actions/searchActions';
import { IState } from './shared/store/reducers';
import { ApiStatus } from './shared/models';
import AppComponent from './App';

function AppContainer() {
  const results = useSelector((state: IState) => state.search.results);
  const totalResults = useSelector((state: IState) => state.search.totalResults);
  const loadingStatus = useSelector((state: IState) => state.search.loadingStatus);
  const dispatch = useDispatch();

  const onSearch = useCallback((text: string) => {
    dispatch(search(text));
  }, [ ]);

  return (
    <AppComponent
      searchResults={results}
      totalSearchResults={totalResults}
      searchLoading={loadingStatus === ApiStatus.LOADING}
      onSearch={onSearch}
    />
  );
}

export default AppContainer;
