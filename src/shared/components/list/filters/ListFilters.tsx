import React, { FunctionComponent, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Popover, Menu, MenuItem, Position } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import './ListFilters.scss';
import { IFilter } from '../../../models';
import ToolbarButton from "../../toolbar/ToolbarButton";
import ListFilterItemComponent from './ListFilterItem';
import { IState } from '../../../store/reducers';
import { isGuest, isLoggedIn } from '../../../utils/auth';

type SaveViewCallback = (filters: IFilter[]) => void;
type AddFilterCallback = (filter: IFilter) => void;
type UpdateFilterCallback = (filter: IFilter, index: number) => void;
type RemoveFilterCallback = (filter: IFilter) => void;

type ListFiltersComponentProps = {
  selectedFilters?: IFilter[];
  allFilters?: IFilter[];
  disableViews?: boolean;
  disableFilter?: boolean;
  onSaveView?: SaveViewCallback;
  onAddFilter?: AddFilterCallback;
  onUpdateFilter?: UpdateFilterCallback;
  onRemoveFilter?: RemoveFilterCallback;
};

export const ListFiltersComponent: FunctionComponent<ListFiltersComponentProps> = ({
  selectedFilters, allFilters, disableViews, disableFilter, onSaveView, onAddFilter, onUpdateFilter, onRemoveFilter
}: ListFiltersComponentProps) => {
  const [ filtersToConfigure, setFiltersToConfigure ] = useState<IFilter[]>([]);
  const currentUser = useSelector((state: IState) => state.users.user);
  const onSaveViewClick = () => {
    let filters = [] as IFilter[];
    if (selectedFilters) {
      filters = filters.concat(selectedFilters);
    }
    onSaveView && onSaveView(filters);
  };
  const onAddFilterToConfigure = (filter: IFilter) => {
    setFiltersToConfigure(filtersToConfigure.concat(filter));
  };

  const onRemoveConfiguredFilter = (filter: IFilter) => {
    onRemoveFilter && onRemoveFilter(filter);
  };

  const onRemoveFilterToConfigure = (filter: IFilter) => {
    const index = filtersToConfigure.findIndex(f => f.name === filter.name);
    if (index !== -1) {
      const tmpFiltersToConfigure = filtersToConfigure.slice();
      tmpFiltersToConfigure.splice(index, 1);
      setFiltersToConfigure(tmpFiltersToConfigure);
    }
  };

  const onApplyFilterToConfigure = (filter: IFilter) => {
    onRemoveFilterToConfigure(filter);
    onAddFilter && onAddFilter(filter);
  };

  const onApplyFilterToUpdate = (filter: IFilter, index: number) => {
    onUpdateFilter && onUpdateFilter(filter,index);
  };

  const addFilterMenuContent = (
    <Menu data-cy='filterItems'>
      {
        allFilters && allFilters.map((filter) => (
          <MenuItem
            key={`${filter.name}-${filter.opr}-${filter.value}`}
            text={filter.label}
            onClick={() => onAddFilterToConfigure(filter)}
          ></MenuItem>
        ))
      }
    </Menu>
  );

  const isNotGuest = useMemo(() => isLoggedIn(currentUser) && !isGuest(currentUser), [ currentUser ]);

  return (
    <div className="list__tags">
      <div className="list__tags__list">
        {
          selectedFilters && selectedFilters.map((filter, index) => (
            <ListFilterItemComponent
              index={index}
              key={`${filter.name}-${filter.opr}-${filter.value}-${index}`}
              filter={filter}
              configured={true}
              onApply={onApplyFilterToUpdate}
              onRemove={() => onRemoveConfiguredFilter(filter)}
            ></ListFilterItemComponent>
          ))
        }
        {
          filtersToConfigure && filtersToConfigure.map((filter, index) => (
            <ListFilterItemComponent
              index={index}
              key={`${filter.name}-${filter.opr}-${filter.value}${index}`}
              filter={filter}
              configured={false}
              onApply={onApplyFilterToConfigure}
              onRemove={() => onRemoveFilterToConfigure(filter)}
            ></ListFilterItemComponent>
          ))
        }
      </div>
      <div className="list__tags__toolbar" data-cy='filterListTagsToolbar'>
        {
          !disableViews && isNotGuest && (
            <ToolbarButton
              icon={IconNames.BOOKMARK}
              label="Save View"
              onClick={onSaveViewClick}
            />
          )
        }
        {
          !disableFilter &&
          <Popover
            content={addFilterMenuContent}
            position={Position.BOTTOM_RIGHT}
            className="list__tags__toolbar__trigger"
          >
            <ToolbarButton icon={IconNames.FILTER_KEEP} label="Add Filter"></ToolbarButton>
          </Popover>
        }
      </div>
    </div>
  );
}
