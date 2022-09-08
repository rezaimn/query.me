import { IFilter } from '../models';

export const setupParamsFilters = (params: any, allFilters: any): IFilter[] => {
  return ((params && params.filters ?
    params.filters
      .map((filter: any) => {
        let filterValueAsString = filter.value;
        if (typeof filter.value === 'object') {
          filterValueAsString = filter?.value?.join(',');
        }
        const filtersColumn = allFilters ?
          allFilters?.find((column: any) => filter.col === column.name) :
          null;
        const filterOptionIndex = filtersColumn.options.findIndex((col: any) => col.operator === filter.opr);
        return filtersColumn ? {
          name: filtersColumn.name,
          label: filtersColumn.label,
          type: filtersColumn.type,
          opr: filter.opr,
          value: filterValueAsString,
          fromView: true,
          optionName: 'is ' + (filterOptionIndex >= 0 ? filtersColumn.options[filterOptionIndex]?.name : '').toLowerCase(),
          options: filtersColumn.options
        } : null;
      }) : []) as IFilter[])
    .filter((filter: IFilter) => !!filter);
};
