import { lazyWithRetry } from './lazy';
import HomeContainerComponent from '../../features/home/HomeContainer';

const DataRoutes = lazyWithRetry(() => import('../../features/data/DataRoutes'));
const NotebooksRoutes = lazyWithRetry(() => import('../../features/notebooks/NotebooksRoutes'));
const AdminRoutes = lazyWithRetry(() => import('../../features/admin/AdminRoutes'));

const routes = [
  {
    path: '/d',
    component: DataRoutes,
  },
  {
    path: '/n',
    component: NotebooksRoutes,
  },
  {
    path: '/a',
    component: AdminRoutes,
  },

  {
    path: '',
    component: HomeContainerComponent
  },
];

export default routes;
