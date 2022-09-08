import React, { FunctionComponent, FocusEvent, useState, Fragment, useRef, useEffect } from 'react';
import { Tag, MenuItem } from '@blueprintjs/core';
import { ItemRenderer, MultiSelect } from '@blueprintjs/select';
import OutsideClickHandler from 'react-outside-click-handler';

import './EditableTags.scss';
import { ITag } from '../../models';

const TagMultiSelect = MultiSelect.ofType<ITag>();

export const renderItem: ItemRenderer<ITag> = (item, { handleClick, modifiers, query }) => {
  if (!modifiers.matchesPredicate) {
      return null;
  }
  return (
    <MenuItem
      disabled={modifiers.disabled}
      text={item.name}
      key={item.uid}
      onClick={handleClick}
    />
  );
};

export const renderCreateTag = (
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
type OnAddTagCallback = (tag: ITag) => void;
type OnRemoveTagCallback = (tag: ITag) => void;
type OnEditModeChangeCallback = (editMode: boolean) => void;

type EditableTagsComponentProps = {
  items: ITag[];
  selectedItems: ITag[];
  disableEditMode?: boolean;
  onLoadTags?: LoadTagsCallback;
  onClearTags?: ClearTagsCallback;
  onAddTag?: OnAddTagCallback;
  onRemoveTag?: OnRemoveTagCallback;
  onEditModeChange?: OnEditModeChangeCallback;
};

export const EditableTagsComponent: FunctionComponent<EditableTagsComponentProps> = ({
  items, selectedItems, disableEditMode,
  onLoadTags, onClearTags, onAddTag, onRemoveTag,
  onEditModeChange
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [ editMode, setEditMode ] = useState(false);
  const [ query, setQuery ] = useState('');
  const [ internalItems, setInternalItems ] = useState<ITag[]>([]);
  const [ allowCreate, setAllowCreate ] = useState(false);

  useEffect(() => {
    let filteredItems = items || [];
    filteredItems = query ?
      filteredItems.slice().filter(i => {
        return (i.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
      }):
      filteredItems;

    filteredItems = filteredItems ?
      filteredItems.filter(i => {
        return !(selectedItems.find(si => i.name.toLowerCase().indexOf(si.name.toLowerCase()) !== -1));
      }) :
      [];

    setInternalItems(filteredItems);
    setAllowCreate(filteredItems.length === 0);
  }, [ query, items, selectedItems ]);

  const handleMouseOver = (event: FocusEvent<any>) => {
    if (!editMode) {
      handleEditMode(true);
    }
  };

  const handleEditMode = (editMode: boolean) => {
    if (!disableEditMode) {
      setEditMode(editMode);
      onEditModeChange && onEditModeChange(editMode);
      if (editMode) {
        onLoadTags && onLoadTags();
      } else {
        onClearTags && onClearTags();
      }
      setQuery('');
    }
  };

  const handleQueryChange = (query: string) => {
    setQuery(query);
  };

  const handleAddTag = (tag: ITag) => {
    onAddTag && onAddTag(tag);
  };

  const handleRemoveTag = (tag: ITag) => {
    onRemoveTag && onRemoveTag(tag);
  };

  const createTag = (query: string) => {
    return {
      uid: "-1",
      name: query
    };
  };

  const areTagsEqual = (tagA: ITag, tagB: ITag) => {
    return tagA.name.toLowerCase() === tagB.name.toLowerCase();
  };

  const maybeCreateNewTagFromQuery = allowCreate ? createTag : undefined;
  const maybeCreateNewTagRenderer = allowCreate ? renderCreateTag : undefined;

  return (
    <div
      className={`editable-tags ${editMode ? 'edit' : ''}`}
      ref={wrapperRef}
      onClick={handleMouseOver}
    >
      <OutsideClickHandler
        onOutsideClick={() => {
          if (editMode) {
            setTimeout(() => {
              handleEditMode(false);
            }, 100);
          }
        }}
      >
        {
          editMode ? (
            <TagMultiSelect
              query={query}
              onQueryChange={handleQueryChange}
              className="editable-tags__multi-select"
              items={internalItems}
              selectedItems={selectedItems}
              itemsEqual={areTagsEqual}
              itemRenderer={renderItem}
              createNewItemFromQuery={maybeCreateNewTagFromQuery}
              createNewItemRenderer={maybeCreateNewTagRenderer}
              onItemSelect={handleAddTag}
              onRemove={handleRemoveTag}
              tagRenderer={(i) => (<span>{i.name}</span>)}
              popoverProps={{ minimal: true }}
            />
          ) : (
            <Fragment>
              {
                (selectedItems && selectedItems.length > 0) ?
                  selectedItems.map(item => (
                    <Tag key={item.uid}>{item.name}</Tag>
                  )) : (
                    <div>&nbsp;</div>
                  )
              }
            </Fragment>
          )
        }
      </OutsideClickHandler>
    </div>
  );
}
