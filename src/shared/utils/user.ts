import { IUser } from '../models';

export function fullName(user: Partial<IUser>) {
  return (user.first_name ? user.first_name + ' ' : '') + user.last_name || '';
}
