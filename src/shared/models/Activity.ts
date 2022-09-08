export interface IActivityItem {
  name: string;
  id?: number;
  uid?: string;
}

export interface IActivityUser {
  username?: string;
  uid?: string;
}

export interface IActivity {
  uid: string;
  action: string;
  dttm: string;
  created_on_utc: string;
  duration: number;
  item: IActivityItem;
  referrer: string | null;
  user: IActivityUser;
}
