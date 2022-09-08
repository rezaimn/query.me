import React, {useCallback, useMemo, useState} from 'react';
import { Icon, Switch } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

type OnChangeCallback = (value: any) => void;
type OnKeyPressCallback = (event: any) => void;

interface IBooleanInput {
  value: any;
  editable: boolean;
  onChange: OnChangeCallback;
  onKeyPress: OnKeyPressCallback;
}

export const BOOLEAN_INPUT_TYPE = 'boolean';

const BooleanInput = ({ value, editable, onChange, onKeyPress }: IBooleanInput) => {
  const [ checked, setChecked ] = useState<boolean>(value === 1);
  const onValueChange = useCallback((event: any) => {
    onChange(event.target.checked ? 1 : 0);
    setChecked(event.target.checked);
  }, []);
  const label = useMemo(() => checked === true ? 'True' : 'False', [ checked ]);

  return (
    <div>
      <Switch
        label={label}
        className="boolean-input"
        defaultChecked={checked}
        onChange={onValueChange}
        disabled={!editable}
        inline={true}
        onKeyDownCapture={onKeyPress}
        large={true} />
    </div>
  )
};

export const MemoizedBooleanInput = React.memo(BooleanInput);
