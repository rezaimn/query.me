import React, { useCallback, useMemo } from 'react';
import { NumericInput } from '@blueprintjs/core';

type OnChangeCallback = (value: any) => void;
type OnKeyPressCallback = (event: any) => void;

interface INumberInput {
  value: string;
  editable: boolean;
  onChange: OnChangeCallback;
  onKeyPress: OnKeyPressCallback;
}

function isNumeric(number: any) {
  return !isNaN(parseFloat(number));
}

export const NUMBER_INPUT_TYPE = 'number';

const NumberInput = ({ value, editable, onChange, onKeyPress }: INumberInput) => {
  const defaultValue = useMemo(() => isNumeric(value) ? parseFloat(value) : 0, [ value ]);
  const onValueChange = useCallback((value: any) => onChange(value), []);

  return (
    <NumericInput
      large={true}
      disabled={!editable}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      onKeyDownCapture={onKeyPress}
    />
  );
};

export const MemoizedNumberInput = React.memo(NumberInput);
