import { UserNames } from './User';
import { IRole } from './Role';

export interface IUser {
  id: number;
  uid: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  created_on: string;
  roles?: IRole[];
  main_roles?: IRole[]; /* this is used for show / list */
  current_organization_name?: string;
  current_organization_id: string;
  current_organization_uid: string;
  current_organization_created_at: string;
  current_workspace_id?: number;
  logged_in?: boolean;
  last_login: string;
  login_count: number;
  accepted_terms_on?: string;
}

export interface IOrganization {
  id: number;
  uid: string;
  name: string;
  created_on_utc: string;
  created_by: UserNames;
  changed_on_utc: string;
  changed_by: UserNames;
}

export interface IWorkspace {
  id: number;
  uid: string;
  name: string;
  is_active: boolean;
  organization: {
    id?: number;
    uid: string;
    name: string;
  }
}
