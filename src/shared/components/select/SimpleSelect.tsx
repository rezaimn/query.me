import React, {FunctionComponent, useCallback, useEffect, useState} from 'react';
import { Button, MenuItem } from '@blueprintjs/core';
import { Select, ItemRenderer } from '@blueprintjs/select';
import { IconNames } from '@blueprintjs/icons';

type OnChangeCallback = (value: any) => void;

export interface IItem {
  label: string;
  value: string;
  [key: string]: string;
}

interface IButtonProps {
  minimal: boolean;
}

interface ISimpleSelectProps {
  selected?: string;
  disabled?: boolean;
  onChange?: OnChangeCallback;
  options: IItem[];
  buttonProps?: IButtonProps;
}

const ItemSelect = Select.ofType<IItem>();

const ButtonDefaultProps: IButtonProps = {
  minimal: true
}

const renderItem: ItemRenderer<IItem> = (item: IItem, { handleClick, modifiers }: any) => {
    return (
      <MenuItem
        icon={modifiers.active && IconNames.TICK}
        text={item.label}
        key={item.value}
        onClick={handleClick} />
    );
  };

export const SimpleSelect: FunctionComponent<ISimpleSelectProps> = ({
  selected,
  disabled = true,
  onChange,
  options,
  buttonProps = ButtonDefaultProps,
}: ISimpleSelectProps) => {
  const [ select, setSelect ] = useState(options[0]); // used only for rendering

  useEffect(() => {
    const item = options.find(o => o.value === selected);
    if (item) {
      setSelect(item);
    }
  }, [ selected ]);

  const handleOnItemSelect = useCallback((value: any) => {
    setSelect(value);

    onChange && onChange(value);
  }, [ onChange ]);

  return (
    <ItemSelect
      disabled={disabled}
      activeItem={select}
      filterable={false}
      items={options}
      itemRenderer={renderItem}
      onItemSelect={handleOnItemSelect}
      popoverProps={{
        captureDismiss: true, /* close only this popover */
        usePortal: false,
        minimal: true
      }}
    >
      <Button
        text={select.label || ''}
        disabled={disabled}
        minimal={buttonProps.minimal}
        rightIcon={IconNames.CARET_DOWN} />
    </ItemSelect>
  )
}
