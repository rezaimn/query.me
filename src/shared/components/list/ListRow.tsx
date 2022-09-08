import React, { FunctionComponent, FormEvent, SyntheticEvent } from 'react';
import { Switch } from '@blueprintjs/core';
import { clickHandlerCreator, EventType } from '../../utils/events';

import './ListRow.scss';

type OnCheckedChangeCallback = (checked: boolean) => void;
type OnRowClickedCallback = () => void;
type OnRowDoubleClickedCallback = () => void;

type ListRowComponentProps = {
  withToggle?: boolean;
  checked?: boolean;
  smallPaddings?: boolean;
  onCheckedChange?: OnCheckedChangeCallback;
  onRowClicked?: OnRowClickedCallback;
  onRowDoubleClicked?: OnRowDoubleClickedCallback;
};

export const ListRowComponent: FunctionComponent<ListRowComponentProps> = ({
  withToggle, children, checked, smallPaddings,
  onCheckedChange, onRowClicked, onRowDoubleClicked
}) => {
  const clickHandler = clickHandlerCreator((event: SyntheticEvent, eventType: EventType) => {
    if (eventType === 'singleClick') {
      onRowClicked && onRowClicked();
    } else if (eventType === 'doubleClick') {
      onRowDoubleClicked && onRowDoubleClicked();
    }
  });

  const handleOnChange = (event: FormEvent<HTMLInputElement>) => {
    if (onCheckedChange) {
      onCheckedChange((event.target as HTMLInputElement).checked);
    }
  };

  const stopPropagationForSwitch = (event: SyntheticEvent) => {
    event.stopPropagation();
  }

  return (
    <div
      className={`list-row ${withToggle ? 'with-toggle' : ''} ${smallPaddings ? 'small-paddings' : ''}`}
      data-cy='listRow'
      onClick={clickHandler}
    >
      {
        withToggle && (
          <div
            className="list-row__toggle"
            onClick={stopPropagationForSwitch}
          >
            <Switch checked={checked} onChange={handleOnChange} />
          </div>
        )
      }
      {children}
    </div>
  );
}
