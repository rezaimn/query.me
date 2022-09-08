import React, {
  Fragment,
  FunctionComponent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';
import {
  Icon,
  Intent,
  Label,
  Menu,
  MenuItem,
  Tag,
} from '@blueprintjs/core';
import {
  IconNames
} from '@blueprintjs/icons';
import { ItemRenderer, MultiSelect } from '@blueprintjs/select';

import { IUser } from '../../../../models';

type Callback = (value?: any) => void;

interface ISelectRecipientProps {
  value: string[] | null | undefined;
  users: IUser[];
  onChange: Callback;
}

interface IRecipient {
  uid: string | null;
  email: string;
}

const RecipientMultiSelect = MultiSelect.ofType<IRecipient>();

const renderItem: ItemRenderer<IRecipient> = (item: IRecipient, { handleClick, modifiers, query }: any) => {
  if (!modifiers.matchesPredicate) {
      return null;
  }

  return (
    <MenuItem
      text={item.email}
      key={item.uid}
      onClick={handleClick} />
  )
}

export const createNewItemRenderer = (
  query: string,
  active: boolean,
  handleClick: React.MouseEventHandler<HTMLElement>,
) => (
  <MenuItem
    icon={IconNames.ADD}
    text={`Add "${query}"`}
    active={active}
    onClick={handleClick}
    shouldDismissPopover={false}
  />
);

const createNewItemFromQuery = (query: string) => {
    return {
      uid: null,
      email: query
    };
  };

const SelectRecipients = forwardRef(({
  value,
  users,
  onChange,
}: ISelectRecipientProps, ref: any) => {
  const [ selectedItems, setSelectedItems ] = useState<IRecipient[]>([]);
  const [ filteredItems, setFilteredItems ] = useState<IRecipient[]>([]); // items that can be selected
  const [ error, setError ] = useState<string>('');

  const items = users.map((user: IUser) => ({ uid: user.uid, email: user.email }));

  useEffect(() => {
    const selected: string[] = selectedItems.map((selectedItem: IRecipient) => selectedItem.email);

    setFilteredItems(items.filter((item: IRecipient) => !selected.includes(item.email) ));

    if (selected.length && error) {
      setError(''); // unset error;
    }

    onChange(selected);
  }, [ selectedItems ]);

  useEffect(() => {
    if (value?.length && !selectedItems.length) {
      // in case of edit, value is provided
      const selectedItems: IRecipient[] = [];
      value.forEach((email: string) => {
        const item = items.find((item: IRecipient) => value.includes(item.email));

        if (item) {
          selectedItems.push(item);
        }
      });

      if (selectedItems.length) {
        setSelectedItems(selectedItems);
      }
    }
  }, [ value ]);

  useImperativeHandle(ref, () => ({
    validate() {
      const isValid = selectedItems.length > 0;

      if (!isValid) {
        setError('No recipients selected.');
      }
      return isValid;
    }
  }));

  const onItemSelect = (item: IRecipient) => {
    setSelectedItems((oldItems: IRecipient[]) => [...oldItems, item]);
  };

  const onItemRemove = (item: IRecipient) => {
    setSelectedItems(
      (oldItems: IRecipient[]) =>
        [
          ...oldItems.filter((oldItem: IRecipient) => oldItem.email !== item.email)
        ]
    );
  };

  const itemPredicate = (query: string, item: IRecipient) => {
    /*
     * filter items
     */
    return item.email.toLowerCase().includes(query.toLowerCase());
  };

  const tagRenderer = (item: IRecipient) => item.email;

  return (
    <Fragment>
      <div className="select-recipients-label">
        <Icon icon={IconNames.ENVELOPE}/> Select recipients:
      </div>
      <RecipientMultiSelect
        fill={true}
        className=""
        placeholder={'Add users or enter em\uFEFFail add\uFEFFress'}
        items={filteredItems}
        itemPredicate={itemPredicate}
        selectedItems={selectedItems}
        itemRenderer={renderItem}
        onItemSelect={onItemSelect}
        onRemove={onItemRemove}
        resetOnSelect={true}
        tagRenderer={tagRenderer}
        createNewItemFromQuery={createNewItemFromQuery}
        createNewItemRenderer={createNewItemRenderer}
        popoverProps={{
          minimal: true,
          captureDismiss: true, /* close only this popover */
        }}
        tagInputProps={{
          intent: error ? Intent.DANGER : undefined
        }}
      />
      <div className="input-error">
        {error}
      </div>
    </Fragment>
  );
});

export default SelectRecipients;
