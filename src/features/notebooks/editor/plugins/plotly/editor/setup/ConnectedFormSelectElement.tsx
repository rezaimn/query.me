import React, { FunctionComponent, useMemo } from 'react';
import { Control, FieldErrors } from 'react-hook-form';

import FormSelectElement, { IOption } from '../../../../../../../shared/components/form/FormSelectElement';

interface ConnectedFormSelectElementProps {
  id: string;
  label: string;
  width?: string;
  options: IOption[];
  selectedValue?: any;
  required?: boolean;
  control: Control;
  errors: FieldErrors;
  placeholder: string;
  errorMessage: string;
}
  
export const ConnectedFormSelectElement : FunctionComponent<ConnectedFormSelectElementProps> = ({
  id, label, width, options, selectedValue,
  required, control, errors,
  placeholder, errorMessage
}) => {
  const selectedOption = useMemo(() => {
    if (selectedValue) {
      return options.find(option => option.value === selectedValue);
    }
    return undefined;
  }, [ options, selectedValue ]);

  return (
    <FormSelectElement
      id={id}
      label={label}
      inline={true}
      width={width}
      options={options}
      placeholder={placeholder}
      errorMessage={errorMessage}
      defaultValue={selectedOption}
      formConfig={{ control, errors }}
      rules={{ required: required }} />
  );
};
