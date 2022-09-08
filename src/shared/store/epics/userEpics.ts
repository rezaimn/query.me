import { combineEpics, Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import {
  switchMap,
  map,
  startWith,
  catchError,
  filter,
  tap
} from 'rxjs/operators';
import { isOfType } from 'typesafe-actions';
import { Position, Toaster, Intent } from '@blueprintjs/core';

import {
  UsersAction,
  UsersActionTypes,
  loadedUsers,
  loadingUsers,
  loadingUsersFailed,
  loadedUsersMetadata,
  loadingUsersMetadata,
  loadingUsersMetadataFailed,
  loadedUser,
  loadingUser,
  loadingCurrentUser,
  loadingUserFailed,
  savedUser,
  savingUser,
  savingUserFailed,
  invitedUser,
  invitingUser,
  invitingUserFailed,
  removedUser,
  removingUser,
  removingUserFailed, canLoadMoreUsers,
} from '../actions/userActions';
import {
  loadedView,
  clearView
} from '../actions/viewActions';
import { IState } from '../reducers';
import {
  getUsers,
  getUsersMetadata,
  getUser,
  getCurrentUser,
  inviteUser,
  saveUser,
  removeUser,
} from '../../services/usersApi';
import { getView } from "../../services/viewsApi";
import { IParams, IUser } from "../../models";
import {canLoadMoreTables} from '../actions/tableActions';
import {canLoadMoreDataForInfiniteScroll} from '../../utils/canLoadMoreDataForInfiniteScroll';

const removeUserToaster = Toaster.create({
  className: 'recipe-toaster',
  position: Position.TOP
});

const loadUsersEpic: Epic<UsersAction, UsersAction, IState> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(UsersActionTypes.LOAD_USERS)),
    switchMap(action =>
      action.payload && action.payload.viewId ?
        // Get users for a specific view
        from(getView(action.payload.viewId)).pipe(
          switchMap(view => {
            dispatch(loadedView(view.result));

            const viewResult = view.result;
            let params = {} as IParams;
            if (viewResult && viewResult.params) {
              params = JSON.parse(viewResult.params);
            }
            // If there are some filters, use them instead of
            // the ones from the view. It's typically for the case
            // when the filters are updated.
            if (action.payload.filters) {
              params.filters = action.payload.filters;
            }
            if (action.payload.page_size) {
              params.page = action.payload.page;
              params.page_size = action.payload.page_size;
            }
            return from(getUsers(params, action.payload.sort)).pipe(
              map(response => ({
                response, params
              }))
            );
          }),
          map(({ response, params }) => {
            const { ids, result } = response;
            const users = result.map((user: IUser, index: number) => ({
              ...user,
              uid: ids[index]
            }));
            return loadedUsers(users, params, action.payload.reload, action.payload.sort);
          }),
          startWith(loadingUsers()),
          catchError(() => of(loadingUsersFailed()))
        ) :
        // Get all users
        from(getUsers({ filters: action.payload.filters,
          page: action.payload.page,
          page_size: action.payload.page_size }, action.payload.sort)).pipe(
          tap(() => {
            dispatch(clearView());
          }),
          map((response: any) => {
            const { ids, result } = response;
            const users = result.map((user: IUser, index: number) => ({
              ...user,
              uid: ids[index]
            }));
            dispatch(canLoadMoreUsers(canLoadMoreDataForInfiniteScroll(response, action)));
            return loadedUsers(users, action.payload.filters ? {
              filters: action.payload.filters
            } : undefined, action.payload.reload);
          }),
          startWith(loadingUsers()),
          catchError(() => of(loadingUsersFailed()))
        )
    )
  );

const loadUsersMetadataEpic: Epic<UsersAction, UsersAction, IState, any> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(UsersActionTypes.LOAD_USERS_METADATA)),
    switchMap(action =>
      from(getUsersMetadata()).pipe(
        map((response: any) => loadedUsersMetadata(response)),
        startWith(loadingUsersMetadata()),
        catchError(() => of(loadingUsersMetadataFailed()))
      )
    )
  );

const loadUserEpic: Epic<UsersAction, UsersAction, IState> = (
  action$,
  state$
) =>
  action$.pipe(
    filter(isOfType(UsersActionTypes.LOAD_USER)),
    switchMap(action =>
      from(getUser(action.payload)).pipe(
        map((response: any) => loadedUser(response.result)),
        startWith(loadingUser(action.payload)),
        catchError(() => of(loadingUserFailed()))
      )
    )
  );

const loadCurrentUserEpic: Epic<UsersAction, UsersAction, IState> = (
  action$,
  state$
) =>
  action$.pipe(
    filter(isOfType(UsersActionTypes.LOAD_CURRENT_USER)),
    switchMap(action =>
      from(getCurrentUser()).pipe(
        map((response: any) => loadedUser(response)),
        startWith(loadingCurrentUser()),
        catchError(() => of(loadingUserFailed()))
      )
    )
  );

const inviteUserEpic: Epic<UsersAction, UsersAction, IState> = (
  action$,
  state$
) =>
  action$.pipe(
    filter(isOfType(UsersActionTypes.INVITE_USER)),
    switchMap(action =>
      from(inviteUser(action.payload)).pipe(
        map((response: any) => invitedUser(response.result)),
        startWith(invitingUser(action.payload)),
        catchError(() => of(invitingUserFailed()))
      )
    )
  );

const saveUserEpic: Epic<UsersAction, UsersAction, IState> = (
  action$,
  state$
) =>
  action$.pipe(
    filter(isOfType(UsersActionTypes.SAVE_USER)),
    switchMap(action =>
      from(saveUser(action.payload)).pipe(
        map((response: any) => {
          return savedUser({
            ...action.payload, // get user identifier
            ...response.result
          })
        }),
        startWith(savingUser(action.payload)),
        catchError(() => of(savingUserFailed()))
      )
    )
  );

const removeUserEpic: Epic<UsersAction, UsersAction, IState, any> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(UsersActionTypes.REMOVE_USER)),
    switchMap(action =>
      from(removeUser(action.payload)).pipe(
        tap((response: any) => {
          removeUserToaster.show({
            message: "User successfully removed.",
            intent: Intent.SUCCESS
          });
        }),
        map((response: any) => removedUser(action.payload)),
        startWith(removingUser(action.payload)),
        catchError(() => {
          removeUserToaster.show({
            message: "An error occurs while removing the user.",
            intent: Intent.DANGER
          });
          return of(removingUserFailed());
        })
      )
    )
  );

export default combineEpics(
  loadUsersEpic,
  loadUserEpic,
  loadUsersMetadataEpic,
  loadCurrentUserEpic,
  inviteUserEpic,
  saveUserEpic,
  removeUserEpic
);
