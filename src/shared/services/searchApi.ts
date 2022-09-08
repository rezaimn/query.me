import rison from 'rison';

import { api } from './Api';

export const search = (text: string) => {
  const query = rison.encode({
    filters: [
      { col: "query", opr: "eq", value: text }
    ]
  });

  return api.get(`/es/search/?q=${query}`).then(res => res.data);
};
