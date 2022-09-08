import React, { FunctionComponent, useCallback, useState } from 'react';
import { Button, FormGroup, Intent, MenuItem, IconName } from '@blueprintjs/core';
import { Select, ItemRenderer } from '@blueprintjs/select';
import { IconNames } from '@blueprintjs/icons';
import { Control, Controller, FieldError, DeepMap } from 'react-hook-form';

export type IOption = {
  label: string;
  value: string;
  icon?: IconName;
  // [key: string]: string;
}

type FormSelectElementProps = {
  id: string;
  label?: string;
  inline?: boolean;
  width?: string;
  options: IOption[];
  labelInfo?: string;
  placeholder?: string;
  type?: string;
  errorMessage?: string;
  defaultValue?: IOption;
  rules: { [id:string]: any };
  formConfig: {
    control: Control<Record<string, any>>;
    errors: DeepMap<Record<string, any>, FieldError>;
  };
};

const SelectElement = Select.ofType<IOption>(); // get type somehow instead of "any"

type OnChangeCallback = (e: any) => void;

type RenderSelectProps = {
  selected?: IOption;
  width?: string;
  onChange: OnChangeCallback;
  options: IOption[];
}

const renderItem: ItemRenderer<IOption> = (item: IOption, { handleClick, modifiers }: any) => {
  return (
    <MenuItem
      icon={item.icon || (modifiers.active && IconNames.TICK)}
      text={item.label}
      key={item.value}
      onClick={handleClick} />
  );
};

const RenderSelect: FunctionComponent<RenderSelectProps> = (
{ selected, width, onChange, options }: RenderSelectProps) => {
  const [ select, onSelect ] = useState({ ...selected } as IOption); // used only for rendering

  const handleOnItemSelect = useCallback((value: any) => {
    onSelect(value);

    onChange && onChange(value);
  }, [ ]);

  return (
    <SelectElement
      activeItem={select}
      filterable={false}
      items={options}
      itemRenderer={renderItem}
      onItemSelect={handleOnItemSelect}
      
      popoverProps={{
        captureDismiss: true,
        usePortal: false,
        minimal: true
      }}>
      <Button icon={select.icon} text={select.label || ' '} rightIcon="double-caret-vertical"/>
    </SelectElement>
  );
}

const FormSelectElement: FunctionComponent<FormSelectElementProps> = ({
  id, label, options, labelInfo, inline, placeholder, errorMessage, defaultValue, formConfig, rules
}) => {
  const { control, errors } = formConfig;

  const render = useCallback(
    ({ onChange } : any) => <RenderSelect
      onChange={onChange}
      selected={defaultValue}
      options={options} />, [ defaultValue, options ]);

  return (
    <FormGroup
      label={label}
      labelFor={id}
      labelInfo={labelInfo}
      inline={inline}
    >
      <Controller
        name={id}
        control={control}
        rules={rules}
        intent={errors[id] && Intent.DANGER}
        placeholder={placeholder}
        type="select"
        defaultValue={defaultValue || ''}
        render={render} />
      {errors[id] && <span className="input-error">{errorMessage}</span>}
    </FormGroup>
  );
};

export default FormSelectElement;
