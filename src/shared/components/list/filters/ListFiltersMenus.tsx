import React, { FunctionComponent, ChangeEvent, useState, KeyboardEvent, SyntheticEvent, useEffect } from 'react';
import { Menu, Button, Radio, Classes, MenuItem, MenuDivider, TagInput, Icon } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { format, parse } from 'date-fns';
import { MultiSelect, Select, ItemRenderer } from '@blueprintjs/select';

import './ListFiltersMenus.scss';
import { IDatabaseFilter, ITag, IUser } from '../../../models';
import { useSelector } from 'react-redux';
import { IState } from '../../../store/reducers';

type ApplyCallback = (condition: { type: string; value?: any; }) => void;
type ChangeCallback = (value: any) => void;
type CheckCallback = (event: SyntheticEvent) => void;
type EnterCallback = () => void;

type GenericListFilterMenuComponentProps = {
  menuItems: IDatabaseFilter[];
  type: string;
  value: string | undefined;
  opr: string | undefined;
  onApply: ApplyCallback,
};

type ListFilterMenuComponentProps = {
  value: string | undefined;
  opr: string | undefined;
  onApply: ApplyCallback,
  options: IDatabaseFilter[]
};

type CustomRadioComponentProps = {
  label: string;
  value: string;
  groupValue?: string;
  fillValue: boolean;
  type: string;
  defaultFilledValue: string | undefined;
  onChange: ChangeCallback;
  onCheck: CheckCallback;
  onEnter: EnterCallback;
};

export const CustomRadioButton: FunctionComponent<CustomRadioComponentProps> = ({
  label, value, groupValue, fillValue, type, defaultFilledValue, onChange, onCheck, onEnter,
}: CustomRadioComponentProps) => {
  const allTags = useSelector((state: IState) => state.tags.tags);
  const [stringFilledValue, setStringFilledValue] = useState<string | undefined>('');
  const [tagsFilledValue, setTagsFilledValue] = useState<ITag[]>([]);
  const [dateFilledValue, setDateFilledValue] = useState<Date | undefined>(undefined);
  const allUsers = useSelector((state: IState) => state.users.users);
  const [userListToShow, setUserListToShow] = useState(allUsers);
  const [tagListToShow, setTagListToShow] = useState(allTags);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(allUsers[0]);
  const setDefaultTags = () => {
    const defaultTags = allTags.filter(tag => defaultFilledValue?.includes(tag.uid));
    onChange && onChange(defaultTags);
    setTagsFilledValue(defaultTags);
  };
  const setDefaultUser = () => {
    const defaultUserIndex = allUsers.findIndex(user => defaultFilledValue?.includes(user.uid));
    if (defaultUserIndex >= 0 && allUsers) {
      onChange && onChange(allUsers[defaultUserIndex].uid);
      setSelectedUser(allUsers[defaultUserIndex]);
    }
  };

  const setDefaultDate = () => {
    if (type === 'date' && defaultFilledValue && defaultFilledValue?.length === 10) {
      const defaultDate = format(new Date(defaultFilledValue), 'dd/MM/yyyy');
      setDateFilledValue(new Date(defaultFilledValue));
      onChange && onChange(defaultDate);
    }
  };
  const setDefaultString = () => {
    setStringFilledValue(defaultFilledValue);
    onChange && onChange(defaultFilledValue);
  };
  useEffect(() => {
    setDefaultTags();
    setDefaultUser();
    setDefaultDate();
    setDefaultString();
  }, []);
  const handleFilledValue = (event: ChangeEvent<HTMLInputElement>) => {
    setStringFilledValue(event.target.value);
    onChange && onChange(event.target.value);
  };

  const handleFilledDate = (date: Date) => {
    setDateFilledValue(date);
    onChange && onChange(format(date, 'dd/MM/yyyy'));
  };

  const handleFilledTags = (tag: ITag) => {
    let tags = [...tagsFilledValue];
    if (tagsFilledValue.findIndex(item => item.uid === tag.uid) >= 0) {
      tags = removeFromTags(tag);
    } else {
      tags.push(tag);
    }
    setTagsFilledValue(tags);
    onChange && onChange(tags);
  };

  const handleEnter = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      onEnter();
    }
  };

  const handleSelectValue = (event: any, user: IUser) => {
    event.stopPropagation();
    document.getElementById('action_' + value)?.click();
    setSelectedUser(user);
    onChange && onChange(user.uid);
  };

  const onSearchTextChange = (text: any) => {
    setUserListToShow(allUsers.filter((user: any) => user?.first_name.toLowerCase().includes(text.toLowerCase()) ||
      user?.last_name.toLowerCase().includes(text.toLowerCase())));
  };
  const onSearchTagChange = (text: any) => {
    setTagListToShow(allTags.filter((tag: any) => tag.name.toLowerCase().includes(text.toLowerCase())));
  };

  const generateSelectUserItem = (user: any, { modifiers, handleClick }: any) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return <MenuItem
      key={user.uid}
      text={user.first_name + ' ' + user.last_name}
      aria-label={user.username}
      active={modifiers.active}
      onClick={(e: any) => handleSelectValue(e, user)}
    />;
  };
  const isTagSelected = (tag: any) => {
    return tagsFilledValue.findIndex((item: ITag) => item.uid === tag.uid) >= 0;
  };
  const clearSelectedTags = () => {
    setTagsFilledValue([]);
    onChange && onChange([]);
  };
  const renderTag: ItemRenderer<ITag> = (tag, { handleClick, modifiers, query }) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        icon={isTagSelected(tag) ? 'tick' : 'blank'}
        active={modifiers.active}
        disabled={modifiers.disabled}
        key={tag.uid}
        onClick={() => handleFilledTags(tag)}
        text={tag.name}
        shouldDismissPopover={false}
      />
    );
  };
  const removeFromTags = (tag: any) => {
    const tagIndex = tagsFilledValue.findIndex((item) => item.uid === tag.uid || tag.key);
    const updatedTags = [...tagsFilledValue];
    if (tagIndex >= 0) {
      updatedTags.splice(tagIndex, 1);
      setTagsFilledValue(updatedTags);
    }
    onChange && onChange(updatedTags);
    return updatedTags;
  };
  const generateTagItem = (tag: ITag) => {
    return (
      <MenuItem
        key={tag.uid}
        onClick={() => removeFromTags(tag)}
        text={tag.name}
        shouldDismissPopover={false}
      />
    );
  };

  const getSelectedFilterInputElement = (type: string) => {
    switch (type) {
      case 'date':
        return <div onClick={(evt) => {
          evt.stopPropagation();
        }}>
          <DateInput
            formatDate={date => date.toLocaleString('es-ES', { year: 'numeric', month: '2-digit', day: 'numeric' })}
            parseDate={str => new Date(str)}
            value={dateFilledValue}
            className="custom-radio-button__dateinput"
            popoverProps={{
              usePortal: false,
            }}
            onChange={handleFilledDate}
          />
        </div>;
      case 'string':
        return <input
          autoFocus
          type="text"
          className={`${Classes.INPUT} custom-radio-button__input`}
          value={stringFilledValue}
          onChange={handleFilledValue}
          onKeyDown={handleEnter}
        />;
      case 'select':
        return <Select
          items={userListToShow}
          onQueryChange={onSearchTextChange}
          itemRenderer={generateSelectUserItem}
          onItemSelect={() => {
          }}
          noResults={<MenuItem disabled={true} text="No results."/>}
          onActiveItemChange={setSelectedUser}
          activeItem={selectedUser}
          resetOnClose={true}
        >
          <Button id={'action_' + value} className='select-btn'
                  text={selectedUser?.first_name + ' ' + selectedUser?.last_name}
                  rightIcon="double-caret-vertical"/>
        </Select>;
      case 'tag':
        return <MultiSelect
          fill={true}
          onQueryChange={onSearchTagChange}
          resetOnSelect={true}
          itemRenderer={renderTag}
          tagInputProps={{
            onRemove: removeFromTags,
            rightElement: <Icon icon={'cross'} onClick={() => clearSelectedTags()}
                                style={{ color: '#aaa', margin: '8px', cursor: 'pointer' }}/>,
          }}
          items={tagListToShow}
          tagRenderer={item => generateTagItem(item)}
          onItemSelect={handleFilledTags}
          noResults={<MenuItem disabled={true} text="No results."/>}
          selectedItems={tagsFilledValue}

        >
          <Button id={'action_' + value} className='select-btn'
                  text={selectedUser?.first_name + ' ' + selectedUser?.last_name}
                  rightIcon="double-caret-vertical"/>
        </MultiSelect>;
    }
  };
  return (
    <div className="custom-radio-button">
      <Radio label={label} value={value} checked={groupValue === value} onChange={onCheck}/>
      {
        (fillValue && groupValue === value) &&
        getSelectedFilterInputElement(type)
      }
    </div>
  );
};

export const GenericListFilterMenu: FunctionComponent<GenericListFilterMenuComponentProps> = ({
  menuItems, type, value, opr, onApply,
}) => {
  const [filterValue, setFilterValue] = useState<string | undefined>(opr);
  const [filledValue, setFilledValue] = useState<any>(value);

  const handleFilterValue = (value: string) => {
    setFilterValue(value);
  };
  const handleFilledValue = (value: any) => {
    setFilledValue(value);
  };
  const handleApply = () => {
    let filteredValueAdjusted = filledValue;
    if (!filterValue) {
      return;
    }

    const filter = menuItems.find(m => m.operator === filterValue);
    if (!filter) {
      return;
    }

    if (filter.fillValue && !filledValue) {
      return;
    }
    if (typeof filledValue === 'object') {
      filteredValueAdjusted = filledValue.map((item: any) => {
        return item.uid;
      });
    }
    onApply && onApply({
      type: filterValue,
      value: filteredValueAdjusted,
    });
  };
  return (
    <Menu className="filters__menu" data-cy='selectedFilterOptions'>
      {
        menuItems.map((menuItem, index) => (
          <CustomRadioButton
            key={index}
            label={menuItem.name}
            value={menuItem.operator}
            groupValue={filterValue}
            type={type}
            fillValue={menuItem.fillValue}
            defaultFilledValue={filledValue}
            onChange={handleFilledValue}
            onCheck={() => handleFilterValue(menuItem.operator)}
            onEnter={handleApply}
          ></CustomRadioButton>
        ))
      }
      <Button
        icon="tick"
        className="filters__menu__apply"
        onClick={handleApply}
      >Apply</Button>
    </Menu>
  );
};

export const ListFilterMenuForString: FunctionComponent<ListFilterMenuComponentProps> = ({
  value, opr, onApply, options = [],
}) => {
  return (
    <GenericListFilterMenu
      menuItems={options}
      type="string"
      value={value}
      opr={opr || 'is'}
      onApply={onApply}
    ></GenericListFilterMenu>
  );
};

export const ListFilterMenuForNumber: FunctionComponent<ListFilterMenuComponentProps> = ({
  value, opr, onApply, options
}) => {
  return (
    <GenericListFilterMenu
      menuItems={options}
      type="number"
      value={value}
      opr={opr}
      onApply={onApply}
    ></GenericListFilterMenu>
  );
};

export const ListFilterMenuForDate: FunctionComponent<ListFilterMenuComponentProps> = ({
  value, opr, onApply, options = [],
}) => {
  return (
    <GenericListFilterMenu
      menuItems={options}
      type="date"
      value={value}
      opr={opr}
      onApply={onApply}
    ></GenericListFilterMenu>
  );
};

export const ListFilterMenuForSelect: FunctionComponent<ListFilterMenuComponentProps> = ({
  value, opr, onApply, options = [],
}) => {
  return (
    <GenericListFilterMenu
      menuItems={options}
      type="select"
      value={value}
      opr={opr}
      onApply={onApply}
    ></GenericListFilterMenu>
  );
};

export const ListFilterMenuForTag: FunctionComponent<ListFilterMenuComponentProps> = ({
  value, opr, onApply, options = [],
}) => {
  return (
    <GenericListFilterMenu
      menuItems={options}
      type="tag"
      value={value}
      opr={opr}
      onApply={onApply}
    ></GenericListFilterMenu>
  );
};
