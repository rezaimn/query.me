import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  EditableText,
  Icon,
  Menu,
  MenuItem,
  Popover,
  Position,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

type OnChangeCallback = (value: any) => void;

interface SelectLimitProps {
  show: boolean;
  checked: boolean;
  onCheckedChange: OnChangeCallback;
  defaultLimitValue: string;
  onLimitChange: OnChangeCallback;
}

interface LimitMenuContentProps {
  value: any;
  onChange: OnChangeCallback;
}

const LimitMenuContent = React.memo(({ value, onChange }: LimitMenuContentProps) => {
  return (
      <Menu>
        <MenuItem
          text="10"
          labelElement={value === '10' && <Icon icon={IconNames.TICK} />}
          onClick={() => onChange('10')} />
        <MenuItem
          text="50"
          labelElement={value === '50' && <Icon icon={IconNames.TICK} />}
          onClick={() => onChange('50')} />
        <MenuItem
          text="100"
          labelElement={value === '100' && <Icon icon={IconNames.TICK} />}
          onClick={() => onChange('100')} />
        <MenuItem
          text="150"
          labelElement={value === '150' && <Icon icon={IconNames.TICK} />}
          onClick={() => onChange('150')} />
        <MenuItem
          text="1000"
          labelElement={value === '1000' && <Icon icon={IconNames.TICK} />}
          onClick={() => onChange('1000')} />
      </Menu>
    )
});

const SelectLimit = ({
  show,
  checked,
  onCheckedChange,
  defaultLimitValue,
  onLimitChange
}: SelectLimitProps) => {
  const [value, setValue] = useState(defaultLimitValue);

  useEffect(() => {
    setValue(defaultLimitValue);
  }, [defaultLimitValue]);

  const onLimitValueChange = useCallback((newValue: string) => {
    setValue(newValue);
    onLimitChange(newValue);
  }, []);

  if (!show) {
    return null; // hide element on preview / content is not editable
  }

  return (
    <div
      contentEditable={false}
      style={{userSelect: 'none'}}
      className="custom-block__editor__content__limit">
      <Checkbox
        checked={checked}
        onChange={(event: any) => onCheckedChange(!checked)}
      />LIMIT&nbsp;
      <EditableText
        className="custom-block__editor__content__limit__value"
        defaultValue={defaultLimitValue}
        value={value}
        onChange={setValue}
        onConfirm={onLimitChange}/>
      <Popover
        content={
          <LimitMenuContent
            value={value}
            onChange={onLimitValueChange}/>
        }
        position={Position.BOTTOM_RIGHT}
        className="custom-block__editor__content__limit__trigger">
        <Button className='bp3-button bp3-minimal' icon={IconNames.CARET_DOWN}/>
      </Popover>
    </div>
  );
}

export const MemoizedSelectLimit = React.memo(SelectLimit);
