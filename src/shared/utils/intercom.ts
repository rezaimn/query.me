import { IUser } from "../models";
import config from "../../config";

declare global {
    interface Window { Intercom: any; }
}

type CurrentUser = IUser | undefined | null;

export function initIntercom(user: CurrentUser) {
  if (!user) {
    return;
  }

  const userHash = document.getElementById('user_hash') as HTMLInputElement;
  // Intercom accepts Unix timestamp in seconds
  const createdAtTimestamp = Math.round(new Date(user.created_on).getTime() / 1000);
  const orgCreatedAtTimestamp = Math.round(new Date(user.current_organization_created_at).getTime() / 1000);
  const name = user.first_name ? `${user.first_name} ${user.last_name}` : user.email.split('@')[0];

  if (window.hasOwnProperty('Intercom')) {
    window.Intercom('boot', {
      app_id: config.intercom.appId,
      name: name,
      avatar: user.avatar,
      email: user.email,
      user_id: user.uid,
      created_at: createdAtTimestamp,
      user_hash: userHash.value,
      company: {
        id: user.current_organization_uid,
        name: user.current_organization_name,
        created_at: orgCreatedAtTimestamp
      }
    });
  }
}

export function showIntercom(user: CurrentUser) {
  initIntercom(user);
  window.Intercom('show');
}

