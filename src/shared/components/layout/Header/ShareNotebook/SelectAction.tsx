import React, { FunctionComponent } from 'react';
import { SimpleSelect, IItem } from '../../../select';

type OnChangeCallback = (value: any) => void;

const options: IItem[] = [
  {
    label: 'can view',
    value: 'view'
  },
  {
    label: 'can edit',
    value: 'edit'
  }
];

interface ISelectActionProps {
  selected?: string;
  disabled?: boolean;
  onChange?: OnChangeCallback;
}

const SelectAction: FunctionComponent<ISelectActionProps> = ({ selected, disabled, onChange }: ISelectActionProps) => {
  return (
    <SimpleSelect
      selected={selected}
      disabled={disabled}
      onChange={onChange}
      options={options} />
  );
};

export default SelectAction;
