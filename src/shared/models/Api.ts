export enum ApiStatus {
  LOADING = 'loading',
  LOADED = 'loaded',
  FAILED = 'failed'
}

export interface IParams {
  filters?: IParamsFilter[];
  page?: number;
  page_size?: number;
  sort?: string;
}

export interface IParamsFilter {
  col: string;
  opr: string;
  value: string;
}
