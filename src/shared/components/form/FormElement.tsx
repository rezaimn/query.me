import React, { FunctionComponent } from 'react';
import { FormGroup, InputGroup, Intent } from '@blueprintjs/core';
import { Control, Controller, FieldError, DeepMap } from 'react-hook-form';

type FormElementProps = {
  id: string;
  label: string;
  labelInfo?: string;
  placeholder?: string;
  type?: string;
  errorMessage?: string;
  defaultValue?: any;
  rules: { [id:string]: any };
  formConfig: {
    control: Control<Record<string, any>>;
    errors: DeepMap<Record<string, any>, FieldError>;
  };
};

const FormElement: FunctionComponent<FormElementProps> = ({
  id, label, labelInfo, placeholder, type, errorMessage, defaultValue, formConfig, rules
}) => {
  const { control, errors } = formConfig;
  return (
    <FormGroup
      label={label}
      labelFor={id}
      labelInfo={labelInfo}
    >
      <Controller
        as={InputGroup}
        name={id}
        control={control}
        rules={rules}
        intent={errors[id] && Intent.DANGER}
        placeholder={placeholder}
        type={type || 'text'}
        defaultValue={defaultValue || ''}
      ></Controller>
      {errors[id] && <span className="input-error">{errorMessage}</span>}
    </FormGroup>
  );
};

export default FormElement;
