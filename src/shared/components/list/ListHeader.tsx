import React, { FunctionComponent } from 'react';
import { Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import './ListHeader.scss';
import { IListColumn, ISort } from 'shared/models';

type OnToggleSortCallback = (sort: ISort) => void;

type ListHeaderComponentProps = {
  header: IListColumn;
  currentSort?: ISort;
  onToggleSort?: OnToggleSortCallback
};

const ListHeaderComponent: FunctionComponent<ListHeaderComponentProps> = ({
  header, currentSort, onToggleSort
}) => {

  const displaySortIndicator = () => {
    const sortDirection = currentSort ?
      currentSort.direction : null;
    if (sortDirection === 'asc') {
      return (
        <Icon icon={IconNames.ARROW_DOWN} iconSize={12} />
      );
    }
    if (sortDirection === 'desc') {
      return (
        <Icon icon={IconNames.ARROW_UP} iconSize={12} />
      );
    }
    return null;
  };

  const handleSort = () => {
    let newSortDirection = currentSort ? currentSort.direction : null;
    if (!newSortDirection || newSortDirection === 'desc') {
      newSortDirection = 'asc';
    } else if (newSortDirection === 'asc') {
      newSortDirection = 'desc';
    }

    if (currentSort && currentSort.name !== header.id) {
      newSortDirection = 'asc';
    }

    (header.sortable && onToggleSort) &&
      onToggleSort({ name: header.id, direction: newSortDirection });
  };

  return (
    <div
      key={header.id}
      className={`list-header__item ${header.sortable ? 'sortable' : ''}`}
      data-cy='listHeaderItem'
      style={{ width: header.width, minWidth: header.minWidth }}
      onClick={handleSort}
    >
      {header.label}
      {
        (currentSort && currentSort.name === header.id) && displaySortIndicator()
      }
    </div>
  );
}

export default ListHeaderComponent;
