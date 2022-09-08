import React, { FunctionComponent, FocusEvent, useState, Fragment, useRef, useEffect, useCallback, useMemo } from 'react';
import { Tag, MenuItem, Popover, Position, FormGroup, Intent, Classes, Button, Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { ItemRenderer, MultiSelect } from '@blueprintjs/select';
import { Control, Controller, FieldErrors, useForm } from 'react-hook-form';

import './EditableFilters.scss';
import FormSelectElement, { IOption } from '../../../../../../../shared/components/form/FormSelectElement';
import { stopPropagationForPopover } from '../../../../../../../shared/utils/events';

export type IExtendedOption = IOption & {
  operation?: string;
  expression?: string;
  order?: string;
  type?: string;
};

const FilterMultiSelect = MultiSelect.ofType<IExtendedOption>();

export const renderItem: ItemRenderer<IExtendedOption> = (item, { handleClick, modifiers, query }) => {
  if (!modifiers.matchesPredicate) {
      return null;
  }
  return (
    <MenuItem
      disabled={modifiers.disabled}
      text={item.label}
      key={item.value}
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

type TagPopoverContentProps = {
  options: IExtendedOption[];
  tag: IExtendedOption;
  additionalFields: string[];
  onClosePopover: (tag: IExtendedOption) => void;
}

const OPERATORS = [
  { value: '', label: '-' },
  { value: '=', label: 'equals' },
  { value: '!=', label: 'not equals' },
  { value: '>', label: 'greater than' },
  { value: '>=', label: 'greater or equals than' },
  { value: '<', label: 'lower than' },
  { value: '<=', label: 'lower or equals than' }
];
const DIRECTIONS = [
  { value: 'ascending', label: 'Ascending' },
  { value: 'descending', label: 'Descending' }
];

const getValue = (values: any, fieldName: string) => {
  if (fieldName === 'operation' || fieldName === 'order') {
    return values[fieldName]?.value;
  }
  return values[fieldName];
};

const TagPopoverContent = ({ options, tag, additionalFields, onClosePopover }: TagPopoverContentProps) => {
  const { register, handleSubmit, control, errors, getValues } = useForm();

  const selectedOption = useMemo(() => {
    if (tag) {
      return options.find(option => option.value === tag.value);
    }
    return undefined;
  }, [ options, tag ]);
  const selectionOperation = useMemo(() => {
    if (tag) {
      return OPERATORS.find(option => option.value === tag.operation) || OPERATORS[0];
    }
    return undefined;
  }, [ tag ]);
  const selectionDirection = useMemo(() => {
    if (tag) {
      return DIRECTIONS.find(option => option.value === tag.order) || DIRECTIONS[0];
    }
    return undefined;
  }, [ tag ]);

  const handleSave = useCallback((data: any) => {
    const values = getValues();
    const { filterField } = values;
    onClosePopover({
      ...filterField,
      ...additionalFields
        .map(additionalField => ({
          key: additionalField,
          value: getValue(values, additionalField)
        }))
        .reduce((acc, obj) => ({
          ...acc,
          [obj.key]: obj.value
        }), {})
    });
  }, [ getValues, onClosePopover ]);

  return (
    <div
      onClick={stopPropagationForPopover}
      onKeyPress={stopPropagationForPopover}
      onKeyDown={stopPropagationForPopover}
    >
      <form onSubmit={handleSubmit(handleSave)} className="edit-tag">
        <FormSelectElement
          id="filterField"
          inline={true}
          options={options}
          defaultValue={selectedOption}
          placeholder="Select column"
          formConfig={{ control, errors }}
          rules={{ required: true }} />
        { additionalFields.includes('operation') && (
          <FormSelectElement
            id="operation"
            inline={true}
            options={OPERATORS}
            defaultValue={selectionOperation}
            placeholder="Select operation"
            formConfig={{ control, errors }}
            rules={{ required: true }} />
        )}
        { additionalFields.includes('expression') && (
          <FormGroup>
            <input
              className={`${Classes.INPUT} page__form__name`}
              name="expression"
              id="tag-edit-value"
              placeholder="Enter value"
              defaultValue={tag.expression}
              ref={register({ required: true })} 
            />
          </FormGroup>
        )}
        { additionalFields.includes('order') && (
          <FormSelectElement
            id="order"
            inline={true}
            options={DIRECTIONS}
            defaultValue={selectionDirection}
            placeholder="Select direction"
            formConfig={{ control, errors }}
            rules={{ required: true }} />
        )}
        <Button
          className="edit-tag__action"
          type="button"
          onClick={handleSave}
        ><Icon icon={IconNames.TICK} />&nbsp;&nbsp;&nbsp;Apply</Button>
      </form>
    </div>
  );
};

type LoadTagsCallback = () => void;
type ClearFiltersCallback = () => void;
type OnAddFilterCallback = (tag: IExtendedOption) => void;
type OnEditFilterCallback = (tag: IExtendedOption) => void;
type OnRemoveFilterCallback = (tag: IExtendedOption) => void;
type OnEditModeChangeCallback = (editMode: boolean) => void;

type TagRendererProps = {
  tag: IExtendedOption;
  items: IExtendedOption[];
  additionalFields: string[];
  onEditFilter?: OnEditFilterCallback;
};

const TagRenderer = ({ tag, onEditFilter, items, additionalFields }: TagRendererProps) => {
  const [ popoverDisplayed, setPopoverDisplayed ] = useState(false);

  const onClosePopover = (tag: IExtendedOption) => {
    onEditFilter && onEditFilter(tag);
    setPopoverDisplayed(false);
  };

  return (
    <div
      className={tag.order || tag.operation ? 'filled' : 'not-filled'}
      onClick={(event) => {
        stopPropagationForPopover(event);
        setPopoverDisplayed(true);
      }}
    >
      <Popover
        isOpen={popoverDisplayed}
        content={
          <TagPopoverContent
            options={items}
            tag={tag}
            additionalFields={additionalFields}
            onClosePopover={onClosePopover}
          />
        }
        position={Position.BOTTOM_RIGHT}
        usePortal={true}
        onInteraction={(evt) => {
          if (!evt) {
            setPopoverDisplayed(false);
          }
        }}
      >
        { !tag.order && <span>{tag.label} {tag.operation} {tag.expression} </span> }
        { tag.order && <span>{tag.label} {tag.order === 'ascending' ? 'asc' : 'desc'} </span> }
      </Popover>
    </div>
  )
}

type EditableTagsComponentProps = {
  id: string;
  items: IExtendedOption[];
  selectedItems: IExtendedOption[];
  additionalFields: string[];
  disableEditMode?: boolean;
  width?: string;
  onLoadTags?: LoadTagsCallback;
  onClearFilters?: ClearFiltersCallback;
  onAddFilter?: OnAddFilterCallback;
  onEditFilter?: OnEditFilterCallback;
  onRemoveFilter?: OnRemoveFilterCallback;
  onEditModeChange?: OnEditModeChangeCallback;
};

export const EditableFiltersComponent: FunctionComponent<EditableTagsComponentProps> = ({
  id, items, selectedItems, additionalFields,
  disableEditMode, width,
  onLoadTags, onClearFilters,
  onAddFilter, onEditFilter, onRemoveFilter,
  onEditModeChange
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [ editMode, setEditMode ] = useState(true);
  const [ query, setQuery ] = useState('');
  const [ internalItems, setInternalItems ] = useState<IExtendedOption[]>([]);
  const [ allowCreate, setAllowCreate ] = useState(false);

  useEffect(() => {
    let filteredItems = items || [];
    filteredItems = query ?
      filteredItems.slice().filter(i => {
        return (i.label.toLowerCase().indexOf(query.toLowerCase()) !== -1);
      }):
      filteredItems;

    filteredItems = filteredItems ?
      filteredItems.filter(i => {
        return !(selectedItems.find(si => i.label.toLowerCase().indexOf(si.label.toLowerCase()) !== -1));
      }) :
      [];

    setInternalItems(filteredItems);
    setAllowCreate(filteredItems.length === 0);
  }, [ query, items, selectedItems ]);

  /*
    This block is hacky but blueprint doesn't leave access to
    the tag element so we can't style it according to the content
    of the associated selected item.
   */
  useEffect(() => {
    if (wrapperRef.current) {
      const elements = wrapperRef.current.querySelectorAll('.bp3-tag');
      let index = 0;
      for (const selectedItem of selectedItems) {
        if (id === 'filters') {
          if (!selectedItem.operation) {
            if (!elements[index].classList.contains('not-filled')) {
              elements[index].classList.add('not-filled')
            }
          } else {
            if (elements[index].classList.contains('not-filled')) {
              elements[index].classList.remove('not-filled')
            }
          }
        }
        index++;
      }
    }
  }, [ selectedItems ]);

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
        onClearFilters && onClearFilters();
      }
      setQuery('');
    }
  };

  const handleQueryChange = (query: string) => {
    setQuery(query);
  };

  const handleAddFilter = (filter: IExtendedOption) => {
    const formattedFilter = additionalFields.includes('order') ?
      { ...filter, order: DIRECTIONS[0].value } :
      filter;
    onAddFilter && onAddFilter(formattedFilter);
  };

  const handleRemoveFilter = (filter: IExtendedOption) => {
    onRemoveFilter && onRemoveFilter(filter);
  };

  const createTag = (query: string) => {
    return {
      value: "-1",
      label: query
    };
  };

  const areTagsEqual = (tagA: IExtendedOption, tagB: IExtendedOption) => {
    return tagA.value.toLowerCase() === tagB.value.toLowerCase();
  };

  const maybeCreateNewTagFromQuery = allowCreate ? createTag : undefined;
  const maybeCreateNewTagRenderer = allowCreate ? renderCreateTag : undefined;

  return (
    <div
      className={`editable-tags ${editMode ? 'edit' : ''}`}
      ref={wrapperRef}
    >
      <FilterMultiSelect
        query={query}
        onQueryChange={handleQueryChange}
        className="editable-tags__multi-select"
        items={internalItems}
        selectedItems={selectedItems}
        itemsEqual={areTagsEqual}
        itemRenderer={renderItem}
        createNewItemFromQuery={maybeCreateNewTagFromQuery}
        createNewItemRenderer={maybeCreateNewTagRenderer}
        onItemSelect={handleAddFilter}
        onRemove={handleRemoveFilter}
        tagRenderer={(tag) => (
          <TagRenderer
            tag={tag}
            items={items}
            additionalFields={additionalFields}
            onEditFilter={onEditFilter}
          />
        )}
        popoverProps={{ minimal: true }}
      />
    </div>
  );  
};

type ConnectedFormEditableFiltersProps = {
  id: string;
  label: string;
  labelInfo?: string;
  placeholder?: string;
  width?: string;
  items: IOption[];
  additionalFields: string[];
  defaultValue: IOption[];
  errorMessage?: string;
  control: Control;
  errors: FieldErrors;
};

export const ConnectedFormEditableFilters = ({
  id, label, labelInfo, placeholder, width, items,
  additionalFields, control, errors, defaultValue, errorMessage
}: ConnectedFormEditableFiltersProps) => {
  const [selectedItems, setSelectedItems] = useState<IExtendedOption[]>(defaultValue || []);

  const onAddFilter = (filter: IExtendedOption, onChange: any) => {
    setSelectedItems(selectedItems => {
      const newSelectedItems = selectedItems.concat([ filter ]);
      onChange(newSelectedItems);
      return newSelectedItems;
    });
  };

  const onEditFilter = (filter: IExtendedOption, onChange: any) => {
    setSelectedItems(selectedItems => {
      const newSelectedItems = selectedItems.map(f => f.value === filter.value ? filter : f);
      onChange(newSelectedItems);
      return newSelectedItems;
    });
  };

  const onRemoveFilter = (filter: IExtendedOption, onChange: any) => {
    setSelectedItems(selectedItems => {
      const newSelectedItems = selectedItems.filter(f => f.value !== filter.value);
      onChange(newSelectedItems);
      return newSelectedItems;
    });
  };

  const render = useCallback(
    ({ onChange } : any) => <EditableFiltersComponent
    id={id}
    items={items}
    selectedItems={selectedItems}
    additionalFields={additionalFields}
    disableEditMode={true}
    onAddFilter={(filter) => onAddFilter(filter, onChange)}
    onEditFilter={(filter) => onEditFilter(filter, onChange)}
    onRemoveFilter={(filter) => onRemoveFilter(filter, onChange)}
  
  />, [ items, selectedItems ]);


  return (
    <FormGroup
      label={label}
      labelFor={id}
      labelInfo={labelInfo}
      inline={true}
    >
      <Controller
        name={id}
        control={control}
        errors={errors}
        intent={errors[id] && Intent.DANGER}
        placeholder={placeholder}
        type="select"
        defaultValue={defaultValue || []}
        render={render} />
      {errors[id] && <span className="input-error">{errorMessage}</span>}
    </FormGroup>
  )
};
