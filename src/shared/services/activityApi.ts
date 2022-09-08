import rison from 'rison';

import { api } from './Api';

export const recentActivities = () => {
  return api.get(`/log/recent_activity`).then(res => res.data);
};
