import React, { FunctionComponent, useState, useMemo } from 'react';

import './ListHeaders.scss';
import ListHeader from './ListHeader';
import { IListColumn, ISort } from 'shared/models';

type OnToggleSortCallback = (sort: ISort) => void;

type ListHeadersComponentProps = {
  headers: { [id: string]: IListColumn };
  smallPaddings?: boolean;
  onToggleSort?: OnToggleSortCallback
};

export const ListHeadersComponent: FunctionComponent<ListHeadersComponentProps> = ({
  headers, smallPaddings, onToggleSort
}) => {
  const [ currentSort, setCurrentSort ] = useState<ISort>();
  const headersAsList: IListColumn[] = useMemo(() => {
    return headers ?
      Object.keys(headers).reduce((acc: IListColumn[], key: string) => {
        return acc.concat([ headers[key] ]);
      }, []) :
      [];
  }, [ headers ]);

  const handleToggleSort = (sort: ISort) => {
    setCurrentSort(sort);
    onToggleSort && onToggleSort(sort);
  };

  return (
    <div className={`list-headers ${smallPaddings ? 'small-paddings' : ''}`} data-cy='listHeaders'>
      {
        headersAsList.filter(column => column.show_in_table).map(header =>
          <ListHeader
            key={header.id}
            header={header}
            currentSort={currentSort}
            onToggleSort={handleToggleSort}
          />
        )
      }
    </div>
  );
}
