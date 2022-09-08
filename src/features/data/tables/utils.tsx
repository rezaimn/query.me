import { IconNames } from '@blueprintjs/icons';
import { arrayIcon, booleanIcon, textIcon } from '../../../shared/utils/custom-icons';

interface columnIconProps{
  column:any;
  size?:number;
  color?:string;
  viewBox?:string;
}
export const columnIcon = ({column,color,size,viewBox}:columnIconProps):any => {
  const type = column.data_type || column.type;
  switch (type) {
    case 'INT':
    case 'NUMBER':
      return IconNames.NUMERICAL;
    case 'STRING':
      return textIcon({ width: size, height: size, fill: color, viewBoxDefault: viewBox });
    case 'DATETIME':
    case 'DATE':
      return IconNames.CALENDAR;
    case 'BOOL':
    case 'BOOLEAN':
      return booleanIcon({ width: size, height: size, fill: color, viewBoxDefault: viewBox });
    case 'ARRAY':
      return arrayIcon({ width: size, height: size, fill: color, viewBoxDefault: viewBox });
    default:
      return IconNames.DOT;
  }
};

export const COLUMN_CATEGORIES = {
  NUMBER: 'NUMBER',
  STRING: 'STRING',
  DATETIME: 'DATETIME',
  BOOLEAN: 'BOOLEAN',
  ARRAY: 'ARRAY'
};

export const columnCategory = (column: any) => {
  // Possible categories: STRING (default), NUMBER, DATE, BOOLEAN
  const type = column.data_type || column.type;

  switch (type) {
    case 'INT':
    case 'NUMBER':
      return 'NUMBER';
    case 'STRING':
      return 'STRING';
    case 'DATETIME':
    case 'DATE':
      return 'DATETIME';
    case 'BOOL':
    case 'BOOLEAN':
      return 'BOOLEAN';
    case 'ARRAY':
      return 'ARRAY';
    default:
      // By default considered as string
      return 'STRING';
  }
};
