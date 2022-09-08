import React, { useCallback } from 'react';
import { InputGroup } from '@blueprintjs/core';

type OnChangeCallback = (value: any) => void;
type OnKeyPressCallback = (event: any) => void;

interface ITextInput {
  value: string;
  editable: boolean;
  onChange: OnChangeCallback;
  onKeyPress: OnKeyPressCallback
}

export const TEXT_INPUT_TYPE = 'text';

const TextInput = ({ value, editable, onChange, onKeyPress }: ITextInput) => {
  const onValueChange = useCallback((event: any) => onChange(event.target.value), []);

  return (
    <div>
      <InputGroup
        className="text-input"
        defaultValue={value}
        disabled={!editable}
        large={true}
        type="text"
        onChange={onValueChange}
        onKeyDownCapture={onKeyPress}
      />
    </div>
  )
};

export const MemoizedTextInput = React.memo(TextInput);
