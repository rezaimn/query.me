import React, { FunctionComponent, MouseEvent } from 'react';
import { Tag, Popover, Position } from '@blueprintjs/core';

import './ListFilterItem.scss';
import { IFilter } from '../../../models';
import {
  ListFilterMenuForString,
  ListFilterMenuForDate,
  ListFilterMenuForSelect,
  ListFilterMenuForTag,
} from './ListFiltersMenus';

type RemoveCallback = (event: MouseEvent<HTMLButtonElement>) => void;
type ApplyCallback = (filter: IFilter, index:number) => void;

type ListFilterItemComponentProps = {
  filter: IFilter;
  configured?: boolean;
  onRemove?: RemoveCallback;
  onApply?: ApplyCallback;
  index: number;
};

function renderFilterLabel(filter: IFilter) {
  return (filter.value && filter.opr) ?
    `${filter.label} ${filter.optionName} ${typeof filter.value === 'string' ? '\'' + filter.value + '\'' : filter.value}` :
    filter.label;
}

const ListFilterItemComponent: FunctionComponent<ListFilterItemComponentProps> = ({
  filter, configured, onRemove, onApply, index
}) => {
  const onHandleRemove = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onRemove && onRemove(event);
  };
  const onHandleApply = (condition: { type: string; value?: any; }) => {
    onApply && onApply({
      ...filter,
      opr: condition.type,
      value: condition.value
    }, index);
  };

  let addFilterMenuContent = (<div></div>);
  switch (filter.type) {
    case 'string': {
      addFilterMenuContent = (
        <ListFilterMenuForString
          value={filter.value}
          opr={filter.opr}
          onApply={onHandleApply}
          options={filter.options || []}
        ></ListFilterMenuForString>
      );
      break;
    }
    case 'date': {
      addFilterMenuContent = (
        <ListFilterMenuForDate
          value={filter.value}
          opr={filter.opr}
          onApply={onHandleApply}
          options={filter.options || []}
        ></ListFilterMenuForDate>
      );
      break;
    }
    case 'select': {
      addFilterMenuContent = (
        <ListFilterMenuForSelect
          value={filter.value}
          opr={filter.opr}
          onApply={onHandleApply}
          options={filter.options || []}
        ></ListFilterMenuForSelect>
      );
      break;
    }
    case 'tag': {
      addFilterMenuContent = (
        <ListFilterMenuForTag
          value={filter.value}
          opr={filter.opr}
          onApply={onHandleApply}
          options={filter.options || []}
        ></ListFilterMenuForTag>
      );
      break;
    }
  }

  return (
    <Popover
      content={addFilterMenuContent}
      position={Position.BOTTOM_RIGHT}
      defaultIsOpen={!configured}
      canEscapeKeyClose={true}
    >
      <Tag data-cy='filterTags'
        className={`${configured ? 'filter-item__configured' : 'filter-item__not-configured'}`}
        onRemove={(event) => onHandleRemove(event) }
      >{renderFilterLabel(filter)}</Tag>
    </Popover>
  );
};

export default ListFilterItemComponent;
