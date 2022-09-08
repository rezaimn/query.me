import { IDatabaseFilter } from './Data';

export interface IFilter {
  name: string;
  label: string;
  type: string;
  opr?: string;
  value?: string;
  configured: boolean;
  fromView: boolean;
  options?: IDatabaseFilter[],
  optionName?: string;
}
