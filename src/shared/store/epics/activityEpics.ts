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
  ActivitiesAction,
  ActivitiesActionTypes,
  fetchedActivities,
  fetchingActivities,
  fetchActivitiesFailed
} from "../actions/activityActions";
import { IState } from '../reducers';
import { recentActivities } from '../../services/activityApi';

const activitiesEpic: Epic<ActivitiesAction, ActivitiesAction, IState> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(ActivitiesActionTypes.FETCH)),
    switchMap(action =>
      from(recentActivities()).pipe(
        map((response: any) => {
          return fetchedActivities(response.result, response.total);
        }),
        startWith(fetchingActivities()),
        catchError(() => of(fetchActivitiesFailed()))
      )
    )
  );

export default combineEpics(activitiesEpic);
