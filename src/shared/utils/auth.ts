import { IUser } from '../models';

type User = IUser | null | undefined;

/* these roles correspond to the built-in roles on the BE side */
const ADMIN = 'admin';
const GUEST = 'guest';
const USER = 'user';

export function isLoggedIn(user?: User) {
  if (user) {
    return user.logged_in;
  }
  return false;
  // const accessToken = document.getElementById('access_token') as HTMLInputElement;
  //
  // return accessToken.value !== '';
}

function getRole(roles: any[] | undefined | null, name: string) {
  if (!roles) {
    return null;
  }
  const role = roles.find(role => (role.name || '').toLowerCase() === name);

  return role ? role : null;
}

export function isAdmin(user?: User) {
  return getRole(user?.roles || user?.main_roles, ADMIN) !== null;
}

export function isGuest(user?: User) {
  const userNotAdmin = !isAdmin(user);
  const userIsGuest = getRole(user?.roles || user?.main_roles, GUEST) !== null;

  return userNotAdmin && userIsGuest;
}

export function isUser(user?: User) {
  const userNotAdmin = !isAdmin(user);
  const userIsUser = getRole(user?.roles || user?.main_roles, USER) !== null;

  return userNotAdmin && userIsUser;
}

export function userIsType(user?: User) {
  if (isAdmin(user)) {
    return ADMIN;
  } else if (isGuest(user)) {
    return GUEST;
  } else if (isUser(user)) {
    return USER;
  }
  return null;
}
