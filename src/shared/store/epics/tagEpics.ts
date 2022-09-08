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
  TagsAction,
  TagsActionTypes,
  loadTags,
  loadedTags,
  loadingTags,
  loadingTagsFailed,
  createdTag,
  creatingTag,
  creatingTagFailed,
  removedTag,
  removingTag,
  removingTagFailed
} from '../actions/tagActions';
import { IState } from '../reducers';
import { getTags, createTag, removeTag } from '../../services/tagsApi';

const removeTagToaster = Toaster.create({
  className: 'recipe-toaster',
  position: Position.TOP
});

const loadTagsEpic: Epic<TagsAction, TagsAction, IState> = (
  action$,
  state$
) =>
  action$.pipe(
    filter(isOfType(TagsActionTypes.LOAD_TAGS)),
    switchMap(action =>
      from(getTags()).pipe(
        map((response: any) => loadedTags(response)),
        startWith(loadingTags()),
        catchError(() => of(loadingTagsFailed()))
      )
    )
  );

const createTagEpic: Epic<TagsAction, TagsAction, IState, any> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(TagsActionTypes.CREATE_TAG)),
    switchMap(action =>
      from(createTag(action.payload)).pipe(
        tap((response: any) => {
          removeTagToaster.show({
            message: "Tag successfully created.",
            intent: Intent.SUCCESS
          });
          dispatch(loadTags());
        }),
        map((response: any) => createdTag(response.tags[0], action.payload.parent)),
        startWith(creatingTag(action.payload.tag, action.payload.parent)),
        catchError(() => {
          removeTagToaster.show({
            message: "An error occurs when creating the tag.",
            intent: Intent.DANGER
          });
          return of(creatingTagFailed());
        })
      )
    )
  );

const removeTagEpic: Epic<TagsAction, TagsAction, IState, any> = (
  action$,
  state$,
  { dispatch }
) =>
  action$.pipe(
    filter(isOfType(TagsActionTypes.REMOVE_TAG)),
    switchMap(action =>
      from(removeTag(action.payload)).pipe(
        tap(() => {
          removeTagToaster.show({
            message: "Tag successfully removed.",
            intent: Intent.SUCCESS
          });
        }),
        map((response: any) => removedTag(action.payload.uid, action.payload.parent)),
        startWith(removingTag(action.payload.uid, action.payload.parent)),
        catchError(() => {
          removeTagToaster.show({
            message: "An error occurs when removing the tag.",
            intent: Intent.DANGER
          });
          return of(removingTagFailed());
        })
      )
    )
  );

export default combineEpics(
  loadTagsEpic,
  createTagEpic,
  removeTagEpic
);
