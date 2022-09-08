import React, { FunctionComponent, Fragment, useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import { InputGroup, Classes, Icon, Colors, Intent, IconName } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Omnibar, ItemRenderer } from '@blueprintjs/select';
import { Helmet } from 'react-helmet';

import './Home.scss';
import { SquareIndicator } from '../../shared/components/list';
import { SearchResult, IActivity } from '../../shared/models';
import { highlightText } from '../../shared/utils/text';
import useDebounce from "../../shared/hooks/use-debounce";
import { getResultType } from "../../shared/utils/elasticsearch";
import MainSearch from '../../shared/components/mainSearch/mainSearch';

type SearchCallback = (text: string) => void;

type HomeComponentProps = {
  searchResults: SearchResult[];
  searchLoading: boolean;
  onSearch: SearchCallback;
  recentActivity: IActivity[];
  totalSearchResults: number;
};

const renderActivity = (activity: IActivity) => {
  let icon: IconName | undefined = IconNames.CODE;
  let intent: Intent | undefined = Intent.PRIMARY;
  let color: string | undefined;

  let url: string = `/app`;
  if (activity.action.startsWith("Database")) {
    icon = IconNames.DATABASE;

    url = `/d/d/${activity.item.uid}`;
  } else if (activity.action.startsWith("Notebook")) {
    icon = IconNames.MANUAL;
    intent = undefined;
    color = Colors.INDIGO3;

    url = `/n/${activity.item.uid}`;
  }

  return (
    <div className="home__content__block__item" key={activity.dttm}>
      <div className="home__content__block__item__name">
        <SquareIndicator
          icon={icon}
          intent={intent}
          color={color}
        />
        <Link to={url} className="home__content__block__item__name__link">
          {activity.item.name}
        </Link>
      </div>
      <div className="home__content__block__item__time">
        <TimeAgo date={activity.created_on_utc} />
      </div>
    </div>
  )
}

const listRecentActivity = (recentActivities: IActivity[]) => {
  const noActivity = (!recentActivities || (recentActivities && !recentActivities.length));

  if (noActivity) {
    return null;
  }

  return (
    <div className="home__content__block">
      <header className="home__content__block__header">
        <Icon icon={IconNames.TIME} color={Colors.GRAY3} className="home__content__block__header__icon" />
        Recently Viewed
      </header>
      <div className="home__content__block__list">
      {
        !noActivity && recentActivities.map(renderActivity)
      }
      </div>
      <footer className="home__content__block__footer" />
    </div>
  )
}

const HomeComponent: FunctionComponent<HomeComponentProps> = ({
  searchResults, searchLoading, onSearch, recentActivity, totalSearchResults
}: HomeComponentProps) => {
  const [ query, setQuery ] = useState('');
  const [ searchOpened, setSearchOpened ] = useState(false);
  const handleOpen = () => {
    setQuery('');
    setSearchOpened(true);
  };


  return (
    <Fragment>
      <Helmet>
        <title>
          Home
        </title>
      </Helmet>
      <div className="home">
        <div className="home__content">
          <div className="home__content__search">
            <InputGroup
              className={Classes.ROUND}
              large={true}
              leftIcon="search" placeholder="Search for data"
              onClick={handleOpen}
            />
          </div>

          { listRecentActivity(recentActivity) }
        </div>
      </div>
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
    </Fragment>
  );
};

export default HomeComponent;
