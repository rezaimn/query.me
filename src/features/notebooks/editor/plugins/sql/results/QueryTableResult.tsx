import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {Icon, Spinner, Menu, MenuItem, Dialog} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import {
  Cell,
  ColumnHeaderCell,
  Column,
  Table,
  CopyCellsMenuItem,
  IMenuContext,
  Utils
} from '@blueprintjs/table';

import {
  columnIcon,
  columnCategory,
  COLUMN_CATEGORIES
} from '../../../../../data/tables/utils';

import './QueryTableResult.scss';
import {isJsonString} from '../../../utils';
import JSONTree from 'react-json-tree';

type QueryTableResultProps = {
  result: any;
};

const JSON_TREE_THEME = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633',
};

const QueryTableResultComponent = ({
  result
}: QueryTableResultProps) => {
  const [ showJsonModal, setShowJsonModal ] = useState<boolean>(false);
  const [ columns, setColumns ] = useState<any>();
  const [ selectedCellData, setSelectedCellData ] = useState<any>(null);
  const [ selectedColName, setSelectedColName ] = useState<string>('');
  const [ data, setData ] = useState<any[]>(result.value.data || []);
  const [ sortedIndexMap, setSortedIndexMap ] = useState<number[]>([]);
  const sortedIndexMapRef = useRef<number[]>([]);

  useEffect(() => {
    if (result && result.value && result.value.data) {
      setData(result.value.data);
    }

    if (result && result.value && result.value.selected_columns) {
      const selectedColumns = result.value.selected_columns
        .map((column: any) => ({ name: column.name, type: column.type }))
        .reduce((acc: any, val: string, index: number) => {
          acc[index] = val;
          return acc;
        }, {});
      setColumns(selectedColumns);
    }
  }, [ result ]);

  const columnsMapping = useMemo(() => {
    return (result && result.value && result.value.selected_columns) ?
      result.value.selected_columns
        .map((column: any) => ({ name: column.name, type: column.type }))
        .reduce((acc: any, val: string, index: number) => {
          acc[index] = val;
          return acc;
        }, {}) :
        {};
    }, [ result ]
  );

  const columnHeaderCellMenuRendererCreator = useCallback((sortColumn, category) => {
    let sortColumnAsc = (a: any, b: any) => (a || '').toString().localeCompare((b || '').toString());
    let sortColumnDesc = (a: any, b: any) => (b || '').toString().localeCompare((a || '').toString());
    if (category === COLUMN_CATEGORIES.NUMBER) {
      sortColumnAsc = (a: any, b: any) => (Number(a) - Number(b));
      sortColumnDesc = (a: any, b: any) => (Number(b) - Number(a));
    }
    return (index?: number) => {
      const sortAsc = () => sortColumn(index, sortColumnAsc);
      const sortDesc = () => sortColumn(index, sortColumnDesc);
      return (
        <Menu>
          <MenuItem icon="sort-asc" onClick={sortAsc} text="Sort Asc" />
          <MenuItem icon="sort-desc" onClick={sortDesc} text="Sort Desc" />
        </Menu>
      );
    };
  }, []);

  const sortColumn = (columnIndex: number, comparator: (a: any, b: any) => number) => {
    const column = columns[columnIndex];
    const newSortedIndexMap = Utils.times(data.length, (i: number) => i);
    newSortedIndexMap.sort((a: number, b: number) => {
      return comparator(data[a][column.name], data[b][column.name]);
    });
    sortedIndexMapRef.current = newSortedIndexMap;
    setSortedIndexMap(newSortedIndexMap);
  };

  const columnHeaderCellRendererCreator = (columnsMapping: any) => {
    return (columnIndex: number) => {
      const column = columnsMapping[columnIndex];
      const icon = columnIcon({column:column, size:18, color:'#bbb'});
      const category = columnCategory(column);
      const menuRenderer = columnHeaderCellMenuRendererCreator(sortColumn, category);
      return (
        <ColumnHeaderCell
          menuRenderer={menuRenderer}
          className="query-result__data__header"
        >
          <div className="text">{column.name}</div>
          { icon && (<Icon icon={icon} iconSize={12} />) }
        </ColumnHeaderCell>
      );
    };
  };

  const getCellData = useCallback((rowIndex: number, columnIndex: number) => {
    const column = columns[columnIndex];
    const sortedRowIndex = sortedIndexMapRef.current[rowIndex];
    if (sortedRowIndex != null) {
      rowIndex = sortedRowIndex;
    }
    const row = data[rowIndex];
    return row[column.name];
  }, [ columns, sortedIndexMapRef, data ]);

  const cellRenderer = useCallback((rowIndex: number, columnIndex: number) => {
    const cellData = getCellData(rowIndex, columnIndex);
    const isJson = isJsonString(cellData);
    return <Cell style={{cursor: isJson ? 'pointer' : 'cell'}}>{cellData}</Cell>;
  }, [ getCellData ]);

  const onCellClicked = (path: any) => {
    if (!path[0].rows || !path[0].cols) {
      return;
    }

    const rowIndex = path[0].rows[0];
    const columnIndex = path[0].cols[0];
    setSelectedColName(columns[columnIndex].name);
    const cellData = getCellData(rowIndex, columnIndex);
    const isJson = isJsonString(cellData);
    if(isJson){
      setSelectedCellData(JSON.parse(cellData));
      setShowJsonModal(true);
    }
  }
  const onJsonModalClose=()=>{
    setShowJsonModal(false);
  }
  const renderBodyContextMenu = useCallback((context: IMenuContext) => {
    return (
      <Menu>
        <CopyCellsMenuItem
          context={context}
          getCellData={getCellData}
          text="Copy selected data"
          icon={IconNames.DUPLICATE}
        />
      </Menu>
    );
  }, [ getCellData ]);

  const onCellClipboardData = useCallback((row: number, col: number) => {
    return getCellData(row, col);
  }, [ getCellData ]);

  return (result && result.value && result.value.selected_columns && result.value.data) ? (
    <>
      <div className="query-result__data">
        <Table
          numRows={data.length}
          getCellClipboardData={onCellClipboardData}
          bodyContextMenuRenderer={renderBodyContextMenu}
          className="query-result__data__table"
          onSelection={(path) => {
            onCellClicked(path)
          }}
        >
          {
            columns && Object.keys(columns).map((column: any, index: number) => (
              <Column
                key={index}
                name={column.name}
                cellRenderer={cellRenderer}
                columnHeaderCellRenderer={columnHeaderCellRendererCreator(columns)}
              />
            ))
          }
        </Table>
      </div>
      <Dialog
        icon="info-sign"
        onClose={() => onJsonModalClose()}
        title={`Json Details: ${selectedColName}`}
        isOpen={showJsonModal}
        style={{backgroundColor: '#fff', paddingBottom: '5px'}}
      >
        <div className='json-tree-container'>
          <JSONTree data={selectedCellData} theme={JSON_TREE_THEME}/>
        </div>
      </Dialog>
      </>
  ) : (
    <div className="query-result__data-pending">
      <Spinner size={Spinner.SIZE_STANDARD} />
    </div>
  );

};

export default QueryTableResultComponent;
