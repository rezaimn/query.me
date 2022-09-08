import React, { Fragment, FunctionComponent, forwardRef, useEffect, useState } from 'react';
import { Tag, MenuItem, Intent } from '@blueprintjs/core';
import { ItemRenderer, MultiSelect } from '@blueprintjs/select';
import { Control, Controller, FieldError, DeepMap } from 'react-hook-form';

import './MultiSelect.scss';
// import { any } from '../../models';

const TagMultiSelect = MultiSelect.ofType<any>();

const renderItem: ItemRenderer<any> = (item, { handleClick, modifiers, query }) => {
  if (!modifiers.matchesPredicate) {
      return null;
  }
  return (
    <MenuItem
      disabled={modifiers.disabled}
      text={item.name}
      key={item.id}
      onClick={handleClick}
    />
  );
};

const renderCreateTag = (
  query: string,
  active: boolean,
  handleClick: React.MouseEventHandler<HTMLElement>,
) => (
  <MenuItem
    icon="add"
    text={`Create tag "${query}"`}
    active={active}
    onClick={handleClick}
    shouldDismissPopover={false}
  />
);

type LoadTagsCallback = () => void;
type ClearTagsCallback = () => void;
type OnAddTagCallback = (tag: any) => void;
type OnRemoveTagCallback = (tag: any) => void;
type OnChangeCallback = (tags: any[]) => void;

type EditableTagsAdapterProps = {
  items: any[];
  value?: any[];
  placeholder?: string;
  onChange?: OnChangeCallback;
};

const EditableTagsAdapter: FunctionComponent<EditableTagsAdapterProps> = forwardRef(({
  value = [], onChange, items, placeholder
}: EditableTagsAdapterProps, ref: any) => {
  const [ internalItems, setInternalItems ] = useState<any[]>([]);
  const [ query, setQuery ] = useState('');
  const [ internalValue, setInternalValue ] = useState(value);

  useEffect(() => {
    // console.log('EditableTagsAdapter - items = ', items);
    // console.log('EditableTagsAdapter - query = ', query);
    let filteredItems = items || [];
    filteredItems = query ?
      filteredItems.slice().filter(i => {
        return (i.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
      }):
      filteredItems;

    filteredItems = filteredItems ?
      filteredItems.filter((i: any) => {
        return !(value.find((si: any) => i.name.toLowerCase().indexOf(si.name.toLowerCase()) !== -1));
      }) :
      [];

    setInternalItems(filteredItems);
  }, [ query, items, internalValue ]);

  const handleQueryChange = (query: string) => {
    setQuery(query);
  };

  const handleAddTag = (tag: any) => {
    const newValue = value.concat([ tag ]);
    onChange && onChange(newValue);
    setQuery('');
    setInternalValue(newValue);
  };

  const handleRemoveTag = (tag: any) => {
    const newValue = value.filter(it => it.id !== tag.id);
    onChange && onChange(newValue);
    setInternalValue(newValue);
  };

  const areTagsEqual = (tagA: any, tagB: any) => {
    return tagA.name.toLowerCase() === tagB.name.toLowerCase();
  };

  return (
    <TagMultiSelect
      ref={ref}
      query={query}
      onQueryChange={handleQueryChange}
      className="multi-select"
      placeholder={placeholder}
      items={internalItems}
      selectedItems={value}
      itemsEqual={areTagsEqual}
      itemRenderer={renderItem}
      onItemSelect={handleAddTag}
      onRemove={handleRemoveTag}
      tagRenderer={(i) => (<span>{i.name}</span>)}
      popoverProps={{
        minimal: true,
        captureDismiss: true, /* close only this popover */
      }}
    />
  );
});

type EditableTagsComponentProps = {
  id: string;
  name: string;
  rules: { [id:string]: any };
  placeholder?: string;
  errorMessage?: string;
  items: any[];
  selectedItems: any[];
  disableEditMode?: boolean;
  formConfig: {
    control: Control<Record<string, any>>;
    errors: DeepMap<Record<string, any>, FieldError>;
  };
  onLoadTags?: LoadTagsCallback;
  onClearTags?: ClearTagsCallback;
  onAddTag?: OnAddTagCallback;
  onRemoveTag?: OnRemoveTagCallback;
};

const EditableTagsComponent: FunctionComponent<EditableTagsComponentProps> = ({
  id, name, rules, placeholder, errorMessage,
  items, selectedItems, formConfig
}) => {
  const { control, errors } = formConfig;

  return (
    <Fragment>
      <Controller
        as={
          <EditableTagsAdapter items={items} placeholder={placeholder} />
        }
        id={id}
        name={name}
        control={control}
        rules={rules}
        intent={errors[id] && Intent.DANGER}
      ></Controller>
      {errors[name] && <span className="input-error">{errorMessage}</span>}
    </Fragment>
  );
}

export default EditableTagsComponent;
