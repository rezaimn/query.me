import React, {Fragment, FunctionComponent, forwardRef, useCallback, useState} from 'react';
import { MenuItem, Intent } from '@blueprintjs/core';
import { ItemRenderer, Suggest } from '@blueprintjs/select';
import { Control, Controller, FieldError, DeepMap } from 'react-hook-form';

import './SuggestSelect.scss';

interface ISuggestSelectComponentProps {
  id: string;
  name: string;
  rules?: { [id:string]: any };
  options: any[];
  placeholder?: string;
  errorMessage?: string;
  formConfig: {
    control: Control<Record<string, any>>;
    errors: DeepMap<Record<string, any>, FieldError>;
  };
}

type Callback = (value?: any) => void;

interface ISuggestOptionItem {
  name: string;
  value: string;
  [key: string]: any;
}

interface ISuggestOption {
  options: ISuggestOptionItem[];
  placeholder?: string;
  onSelect?: Callback;
}

const SuggestOptionSelect = Suggest.ofType<ISuggestOptionItem>();

const renderItem: ItemRenderer<ISuggestOptionItem> = (item: ISuggestOptionItem, { handleClick }: any) => {
  return (
    <MenuItem
      text={item.name}
      key={item.value}
      onClick={handleClick} />
  );
};

const NoResults = React.memo(() => {
  return <MenuItem key="no_result" disabled={true} text="No results." />;
});

const SuggestOption: FunctionComponent<ISuggestOption> = forwardRef(({
  options,
  onSelect,
  placeholder
}: ISuggestOption, ref: any) => {
  const [ selectedItem, setSelectedItem ] = useState<any>({ name: 'Admin', value: 551 });

  const handleOnItemSelect = useCallback((value: ISuggestOptionItem) => {
    onSelect && onSelect(value);
    setSelectedItem(value);
  }, [ ]);

  const renderInputValue = useCallback((value: ISuggestOptionItem) => {
    return value.name;
  }, [ ]);

  const itemPredicate = useCallback((query: string, item: ISuggestOptionItem) => {
    /*
     * filter items
     */
    return item.name.toLowerCase().includes(query.toLowerCase());
  }, [ ]);

  return (
    <Fragment>
      <SuggestOptionSelect
        fill={true}
        items={options}
        itemRenderer={renderItem}
        inputValueRenderer={renderInputValue}
        onItemSelect={handleOnItemSelect}
        itemPredicate={itemPredicate}
        selectedItem={selectedItem}
        noResults={<NoResults />}
        resetOnClose={true}
        resetOnSelect={true}
        popoverProps={{
          captureDismiss: true,
          // usePortal: false,
          minimal: true
        }}
        inputProps={{
          placeholder: placeholder || "Search for value",
          autoComplete: 'off',
          inputRef: ref,
        }}
      />
    </Fragment>
  )
});

const SuggestSelectComponent: FunctionComponent<ISuggestSelectComponentProps> = ({
  id,
  name,
  rules,
  options,
  placeholder,
  errorMessage,
  formConfig
}: ISuggestSelectComponentProps) => {
  const { control, errors } = formConfig;

  const render = useCallback(
    ({ onChange } : any) => <SuggestOption
      onSelect={onChange}
      options={options}
      placeholder={placeholder || ""} />, [ options ]);

  return (
    <Fragment>
      <Controller
        id={id}
        name={name}
        control={control}
        rules={rules}
        intent={errors[id] && Intent.DANGER}
        render={render}
      Controller />
      { errors[name] && <span className="input-error">{errorMessage}</span> }
    </Fragment>
  );
};

export default SuggestSelectComponent;
