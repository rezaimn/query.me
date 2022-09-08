import { ItemRenderer, Omnibar } from '@blueprintjs/select';
import { SearchResult } from '../../models';
import { Colors, IconName, Intent, Tag } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { getResultType } from '../../utils/elasticsearch';
import { SquareIndicator } from '../list';
import { highlightText } from '../../utils/text';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useDebounce from '../../hooks/use-debounce';
import { thViewIcon } from '../../utils/custom-icons';
import { columnIcon } from '../../../features/data/tables/utils';

type SearchCallback = (text: string) => void;
type setSearchOpenedCallback = (value: boolean) => void;
type setQueryCallback = (value: string) => void;

type MainSearchProps={
  searchResults: SearchResult[];
  onSearch: SearchCallback;
  totalSearchResults: number;
  searchOpened: boolean;
  setSearchOpened: setSearchOpenedCallback;
  query: string;
  setQuery: setQueryCallback;
}
const SearchOmnibar = Omnibar.ofType<SearchResult>();

const MainSearch: FunctionComponent<MainSearchProps> = ({
  searchResults,
  onSearch,
  totalSearchResults,
  searchOpened,
  setSearchOpened,
  query,
  setQuery
  }) => {

  const historyHook = useHistory();
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (searchOpened && debouncedQuery) {
      onSearch(debouncedQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchOpened, debouncedQuery]);


  const handleSearchClose = () => {
    setSearchOpened(false);
  };

  const handleSearchItemSelect = (item: any, event: any) => {
    if (!item) {
      return;
    }
    const itemType = getResultType(item);

    switch (itemType) {
      case 'user':
        // no page for user details
        break;
      case 'notebook':
        setSearchOpened(false);
        historyHook.push(`/n/${item.notebook_uid}`);
        break;
      case 'database':
        setSearchOpened(false);
        historyHook.push(`/d/d/${item.database_uid}`);
        break;
      case 'schema':
        setSearchOpened(false);
        historyHook.push(`/d/s/${item.id}`);
        break;
      case 'table':
        setSearchOpened(false);
        historyHook.push(`/d/t/${item.id}`);
        break;
      case 'column':
        setSearchOpened(false);
        let path = item.id.split('.');
        path.pop(); // remove column name in order to the path for column table
        path = path.join('.');
        historyHook.push(`/d/t/${path}`);
        break;
    }
  };

  const handleSearchQueryChange = (newQuery: string) => {
    setQuery(newQuery);
  };

  const resultsTag = <Tag minimal={true}>{query === '' ? 0 : totalSearchResults}</Tag>;


  const renderSearchResult: ItemRenderer<SearchResult> = (result, { handleClick, modifiers, query }) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }

    let icon: any = IconNames.CODE;
    let intent: Intent | undefined = undefined;
    let color: string | undefined = undefined;

    const resultType = getResultType(result);
    switch (resultType) {
      case 'user':
        icon = IconNames.USER;
        break;
      case 'database':
        icon = IconNames.DATABASE;
        break;
      case 'schema':
        icon = IconNames.HEAT_GRID;
        break;
      case 'table':
        icon = result.type === 'table' ? IconNames.TH : thViewIcon({
          fill: '#fff',
          height: 24,
          width: 24,
          viewBoxDefault: '8 -7 8 36',
        });
        break;
      case 'column':
        icon = columnIcon({ column: result, color: '#fff', viewBox: '5 -6 14 38' });
        break;
      case 'notebook':
        icon = IconNames.MANUAL;
        color = Colors.INDIGO3;
        break;
    }
    return (
      <li
        key={result.id}
        className="search-result"
        onClick={(event) => handleClick(event)}
      >
        <SquareIndicator
          icon={icon}
          intent={intent}
          color={color}
          width={24}
          height={24}
          iconSize={14}/>
        <div className="search-result__item">
          <div
            className="bp3-text-overflow-ellipsis bp3-fill search-result__item__column search-result__label"
            style={{ width: '195px' }}>{highlightText(result.name, query)}</div>
          <div
            className="bp3-text-overflow-ellipsis bp3-fill search-result__item__column"
            style={{ width: '25%' }}>
            {resultType === 'column' ? result.data_type : ''}
          </div>
          <div className="bp3-text-overflow-ellipsis bp3-fill search-result__item__column"
               style={{ width: '25%' }}>
            {resultType==='table'?result.type.toUpperCase():resultType.toUpperCase()}
          </div>
        </div>
      </li>
    );
  };

  return (
    <>
      <SearchOmnibar
        inputProps={{
          rightElement: resultsTag,
        }}
        query={query}
        isOpen={searchOpened}
        items={searchResults}
        itemRenderer={renderSearchResult}
        onItemSelect={handleSearchItemSelect}
        onQueryChange={handleSearchQueryChange}
        onClose={handleSearchClose}
      />
    </>
  );

};

export default MainSearch;
