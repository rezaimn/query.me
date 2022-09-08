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
  OrganizationsAction,
  OrganizationsActionTypes,
  loadedOrganizations,
  loadingOrganizations,
  loadingOrganizationsFailed,
  loadedOrganization,
  loadingOrganization,
  loadingCurrentOrganization,
  loadingOrganizationFailed,
  savedOrganization,
  savingOrganization,
  savingCurrentOrganization,
  savingOrganizationFailed
} from '../actions/organizationActions';
import { IState } from '../reducers';
import {
  getOrganizations,
  getOrganization,
  getCurrentOrganization,
  saveOrganization,
  saveCurrentOrganization
} from '../../services/organizationsApi';

const loadOrganizationsEpic: Epic<OrganizationsAction, OrganizationsAction, IState> = (
  action$,
  state$
) =>
  action$.pipe(
    filter(isOfType(OrganizationsActionTypes.LOAD_ORGANIZATIONS)),
    switchMap(action =>
      from(getOrganizations({ filters: action.payload.filters }, action.payload.sort)).pipe(
        map((response: any) => {
          return loadedOrganizations(response.result, action.payload.filters ? {
            filters: action.payload.filters
          } : undefined);
        }),
        startWith(loadingOrganizations()),
        catchError(() => of(loadingOrganizationsFailed()))
      )
    )
  );

const loadOrganizationEpic: Epic<OrganizationsAction, OrganizationsAction, IState> = (
  action$,
  state$
) =>
  action$.pipe(
    filter(isOfType(OrganizationsActionTypes.LOAD_ORGANIZATION)),
    switchMap(action =>
      from(getOrganization(action.payload)).pipe(
        map((response: any) => loadedOrganization(response.result)),
        startWith(loadingOrganization(action.payload)),
        catchError(() => of(loadingOrganizationFailed()))
      )
    )
  );

const loadCurrentOrganizationEpic: Epic<OrganizationsAction, OrganizationsAction, IState> = (
  action$,
  state$
) =>
  action$.pipe(
    filter(isOfType(OrganizationsActionTypes.LOAD_CURRENT_ORGANIZATION)),
    switchMap(action =>
      from(getCurrentOrganization()).pipe(
        map((response: any) => loadedOrganization(response)),
        startWith(loadingCurrentOrganization()),
        catchError(() => of(loadingOrganizationFailed()))
      )
    )
  );

const saveOrganizationEpic: Epic<OrganizationsAction, OrganizationsAction, IState> = (
  action$,
  state$
) =>
  action$.pipe(
    filter(isOfType(OrganizationsActionTypes.SAVE_ORGANIZATION)),
    switchMap(action =>
      from(saveOrganization(action.payload)).pipe(
        map((response: any) => savedOrganization(response.result)),
        startWith(savingOrganization(action.payload)),
        catchError(() => of(savingOrganizationFailed()))
      )
    )
  );

const saveCurrentOrganizationEpic: Epic<OrganizationsAction, OrganizationsAction, IState> = (
  action$,
  state$
) =>
  action$.pipe(
    filter(isOfType(OrganizationsActionTypes.SAVE_CURRENT_ORGANIZATION)),
    switchMap(action =>
      from(saveCurrentOrganization(action.payload)).pipe(
        map((response: any) => savedOrganization(response.result)),
        startWith(savingCurrentOrganization(action.payload)),
        catchError(() => of(savingOrganizationFailed()))
      )
    )
  );

export default combineEpics(
  loadOrganizationsEpic,
  loadOrganizationEpic,
  loadCurrentOrganizationEpic,
  saveOrganizationEpic,
  saveCurrentOrganizationEpic
);
