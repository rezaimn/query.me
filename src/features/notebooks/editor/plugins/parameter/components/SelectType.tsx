import React from 'react';
import {
  Button,
  Classes,
  Colors,
  Icon,
  Menu,
  MenuItem,
  Position,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Popover2 } from '@blueprintjs/popover2';
import {
  BOOLEAN_INPUT_TYPE,
  DATE_INPUT_TYPE,
  NUMBER_INPUT_TYPE,
  TEXT_INPUT_TYPE,
} from "./index";

type OnChangeCallback = (value: any) => void;

interface SelectTypeProps {
  value?: string;
  disable: boolean; // it's based on block UID
  onChange: OnChangeCallback;
  showIcon: boolean;
}

interface ISelectTypeMenuContent {
  value?: string;
  disable: boolean;
  onChange: OnChangeCallback;
}

// @TODO - move this to a common place
const types = [
  {
    key: BOOLEAN_INPUT_TYPE,
    name: 'Boolean'
  },
  {
    key: DATE_INPUT_TYPE,
    name: 'Datetime'
  },
  {
    key: NUMBER_INPUT_TYPE,
    name: 'Number',
  },
  {
    key: TEXT_INPUT_TYPE,
    name: 'String',
  },
];

const SelectTypeMenuContent = React.memo(({ value, disable, onChange }: ISelectTypeMenuContent) => {
  if (disable) {
    return null;
  }

  return (
    <Menu className={Classes.ELEVATION_1}>
      <MenuItem textClassName="parameter__select-type__header" text="Select type" />
      {
        types.map((type: any) => {
          return (
            <MenuItem
              key={type.key}
              text={type.name}
              labelElement={type.key === value && <Icon icon={IconNames.TICK} />}
              onClick={() => onChange(type.key)}
            />
          )
        })
      }
    </Menu>
  );
});

const SelectType = ({
  value,
  disable,
  onChange,
  showIcon
}: SelectTypeProps) => {
  return (
    <Popover2
      content={
        <SelectTypeMenuContent
          value={value}
          disable={disable}
          onChange={onChange} />
      }
      position={Position.BOTTOM_RIGHT}
    >
      <Button style={{ display: showIcon ? 'inline-flex' : 'none' }}
              className='bp3-button bp3-minimal'
              icon={<Icon className="parameter__select-type" icon={IconNames.COG}/>}
      />
    </Popover2>
  );
};

export const MemoizedSelectType = React.memo(SelectType);
