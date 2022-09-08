import { combineEpics, Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import {
  switchMap,
  map,
  startWith,
  catchError,
  filter
} from 'rxjs/operators';
import { isOfType } from 'typesafe-actions';

import {
  RolesAction,
  RolesActionTypes,
  loadedRoles,
  loadingRoles,
  loadingRolesFailed
} from '../actions/roleActions';
import { IState } from '../reducers';
import { getRoles } from '../../services/rolesApi';

const loadRolesEpic: Epic<RolesAction, RolesAction, IState> = (
  action$,
  state$
) =>
  action$.pipe(
    filter(isOfType(RolesActionTypes.LOAD_ROLES)),
    switchMap(action =>
      from(getRoles()).pipe(
        map((response: any) => loadedRoles(response.result)),
        startWith(loadingRoles()),
        catchError(() => of(loadingRolesFailed()))
      )
    )
  );

export default combineEpics(
  loadRolesEpic
);
