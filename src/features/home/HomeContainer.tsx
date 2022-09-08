import React, { useEffect, FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { search } from '../../shared/store/actions/searchActions';
import { IState } from '../../shared/store/reducers';
import { ApiStatus } from '../../shared/models';
import HomeComponent from './Home';
import { fetchActivities } from "../../shared/store/actions/activityActions";

type HomeContainerParams = {
  viewId: string;
};

type HomeContainerParamsProps = RouteComponentProps<HomeContainerParams>;

const HomeContainer: FunctionComponent<HomeContainerParamsProps> = ({
  match
}: HomeContainerParamsProps) => {
  const results = useSelector((state: IState) => state.search.results);
  const loadingStatus = useSelector((state: IState) => state.search.loadingStatus);
  const recentActivity = useSelector((state: IState) => state.activities.results);
  const totalResults = useSelector((state: IState) => state.search.totalResults);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchActivities());
  }, [ dispatch ]);

  const onSearch = (text: string) => {
    dispatch(search(text));
  };

  return (
    <HomeComponent
      searchResults={results}
      searchLoading={loadingStatus === ApiStatus.LOADING}
      onSearch={onSearch}
      recentActivity={recentActivity}
      totalSearchResults={totalResults}
    ></HomeComponent>
  );
};

export default withRouter(HomeContainer);
