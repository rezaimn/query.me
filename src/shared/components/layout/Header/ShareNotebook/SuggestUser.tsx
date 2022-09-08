import React, { Fragment, FunctionComponent, useCallback, useState } from 'react';
import {
  MenuItem
} from '@blueprintjs/core';
import { Suggest, ItemRenderer } from '@blueprintjs/select';
import InviteUserDialogContainer from '../../../dialogs/InviteUser/InviteUserDialog';

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

const createNewItemFromQuery = (query: string): IUserSuggestItem => {
  return {
    value: query,
    uid: null
  }
};

const NoResults = React.memo(() => {
  return <MenuItem key="no_result" disabled={true} text="No results." />;
});

const SuggestUser: FunctionComponent<ISuggestUser> = ({ options, onSelect }: ISuggestUser) => {
  const [ show, setShow ] = useState(false);
  const [ defaults, setDefaults ] = useState({});

  const onClose = useCallback(() => {
    setShow(false);
  }, [ show ]);

  const createNewItemRenderer = (
    query: string,
    active: boolean,
    handleClick: React.MouseEventHandler<HTMLElement>
  ) => {
    if (query.length >= 1) {
      return (
        <MenuItem
          icon="add"
          text="Invite user" /* @TODO - autofill with query */
          key={'no_key'}
          onClick={(value: any) => {
            setShow(true);
            handleClick(value);
            setDefaults((defaults: any) => ({ ...defaults, email: query }));
          }} />
      )
    }
  };

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
        createNewItemFromQuery={createNewItemFromQuery}
        createNewItemRenderer={createNewItemRenderer}
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
          placeholder: 'Add users or invite via em\uFEFFail', /* https://stackoverflow.com/a/45461279/7277750 */
          autoComplete: 'off'
        }}
      />
      <InviteUserDialogContainer
        defaults={defaults}
        show={show}
        onClose={onClose} />
    </Fragment>
  )
}

export default SuggestUser;
