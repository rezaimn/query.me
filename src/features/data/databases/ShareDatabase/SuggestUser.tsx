import React, { Fragment, FunctionComponent, useCallback, useState } from 'react';
import {
  MenuItem
} from '@blueprintjs/core';
import { Suggest, ItemRenderer } from '@blueprintjs/select';

type Callback = (value: any) => void;

interface IUserSuggestItem {
  value: string;
  uid: string | null;
}

interface ISuggestUser {
  options: IUserSuggestItem[];
  onSelect?: Callback;
}

const UserSuggest = Suggest.ofType<IUserSuggestItem>();

const renderItem: ItemRenderer<IUserSuggestItem> = (item: IUserSuggestItem, { handleClick }: any) => {
  return (
    <MenuItem
      text={item.value}
      key={item.uid}
      onClick={handleClick} />
  );
};

const NoResults = React.memo(() => {
  return <MenuItem key="no_result" disabled={true} text="No results." />;
});

const SuggestUser: FunctionComponent<ISuggestUser> = ({ options, onSelect }: ISuggestUser) => {
  const handleOnItemSelect = useCallback((value: IUserSuggestItem) => {
    onSelect && onSelect(value);
  }, [ ]);

  const renderInputValue = useCallback((value: IUserSuggestItem) => {
    return value.value;
  }, [ ]);

  const itemPredicate = useCallback((query: string, item: IUserSuggestItem) => {
    /*
     * filter items
     */
    return item.value.toLowerCase().includes(query.toLowerCase());
  }, [ ]);

  return (
    <Fragment>
      <UserSuggest
        fill={true}
        items={options}
        itemRenderer={renderItem}
        inputValueRenderer={renderInputValue}
        onItemSelect={handleOnItemSelect}
        itemPredicate={itemPredicate}
        noResults={<NoResults />}
        resetOnClose={true}
        resetOnSelect={true}
        popoverProps={{
          captureDismiss: true,
          // usePortal: false,
          minimal: true
        }}
        inputProps={{
          placeholder: 'Search for user',
          autoComplete: 'off'
        }}
      />
    </Fragment>
  )
}

export default SuggestUser;
