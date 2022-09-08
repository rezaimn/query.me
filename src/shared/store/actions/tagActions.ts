import { Action } from 'redux';
import { ITag, ITagForCreation, ITagParent } from '../../models';

// Types

export enum TagsActionTypes {
  LOAD_TAGS = 'tags/load',
  LOADING_TAGS = 'tags/loading',
  LOADED_TAGS = 'tags/loaded',
  LOADING_TAGS_FAILED = 'tags/loading_failed',
  CLEAR_TAGS = 'tags/clear',
  CREATE_TAG = 'tag/create',
  CREATING_TAG = 'tag/creating',
  CREATED_TAG = 'tag/created',
  CREATING_TAG_FAILED = 'tag/creating_failed',
  REMOVE_TAG = 'tag/remove',
  REMOVING_TAG = 'tag/removing',
  REMOVED_TAG = 'tag/removed',
  REMOVING_TAG_FAILED = 'tag/removing_failed'
}

// Interfaces

export interface ILoadTagsAction extends Action {
  type: TagsActionTypes.LOAD_TAGS;
}

export interface ILoadingTagsAction extends Action {
  type: TagsActionTypes.LOADING_TAGS;
}

export interface ILoadedTagsAction extends Action {
  type: TagsActionTypes.LOADED_TAGS;
  payload: {
    tags: ITag[]
  };
}

export interface ILoadingTagsFailedAction extends Action {
  type: TagsActionTypes.LOADING_TAGS_FAILED;
}

export interface IClearTagsAction extends Action {
  type: TagsActionTypes.CLEAR_TAGS;
}

export interface ICreateTagAction extends Action {
  type: TagsActionTypes.CREATE_TAG;
  payload: {
    parent: ITagParent;
    tag: ITagForCreation;
  };
}

export interface ICreatingTagAction extends Action {
  type: TagsActionTypes.CREATING_TAG;
  payload: {
    parent: ITagParent;
    tag: ITagForCreation;
  };
}

export interface ICreatedTagAction extends Action {
  type: TagsActionTypes.CREATED_TAG;
  payload: {
    parent: ITagParent;
    tag: ITag;
  };
}

export interface ICreatingTagFailedAction extends Action {
  type: TagsActionTypes.CREATING_TAG_FAILED;
}

export interface IRemoveTagAction extends Action {
  type: TagsActionTypes.REMOVE_TAG;
  payload: {
    parent: ITagParent;
    uid: string;
  };
}

export interface IRemovingTagAction extends Action {
  type: TagsActionTypes.REMOVING_TAG;
  payload: {
    parent: ITagParent;
    uid: string;
  };
}

export interface IRemovedTagAction extends Action {
  type: TagsActionTypes.REMOVED_TAG;
  payload: {
    parent: ITagParent;
    uid: string;
  };
}

export interface IRemovingTagFailedAction extends Action {
  type: TagsActionTypes.REMOVING_TAG_FAILED;
}

// Functions

export function loadTags(): ILoadTagsAction {
  return {
    type: TagsActionTypes.LOAD_TAGS
  }
}

export function loadingTags(): ILoadingTagsAction {
  return {
    type: TagsActionTypes.LOADING_TAGS
  }
}

export function loadedTags(tags: ITag[]): ILoadedTagsAction {
  return {
    type: TagsActionTypes.LOADED_TAGS,
    payload: {
      tags
    }
  }
}

export function loadingTagsFailed(): ILoadingTagsFailedAction {
  return {
    type: TagsActionTypes.LOADING_TAGS_FAILED
  }
}

export function clearTags(): IClearTagsAction {
  return {
    type: TagsActionTypes.CLEAR_TAGS
  }
}

export function createTag(tag: ITagForCreation, parent: ITagParent): ICreateTagAction {
  return {
    type: TagsActionTypes.CREATE_TAG,
    payload: { tag, parent }
  }
}

export function creatingTag(tag: ITagForCreation, parent: ITagParent): ICreatingTagAction {
  return {
    type: TagsActionTypes.CREATING_TAG,
    payload: { tag, parent }
  }
}

export function createdTag(tag: ITag, parent: ITagParent): ICreatedTagAction {
  return {
    type: TagsActionTypes.CREATED_TAG,
    payload: { tag, parent }
  }
}

export function creatingTagFailed(): ICreatingTagFailedAction {
  return {
    type: TagsActionTypes.CREATING_TAG_FAILED
  }
}

export function removeTag(uid: string, parent: ITagParent): IRemoveTagAction {
  return {
    type: TagsActionTypes.REMOVE_TAG,
    payload: { uid, parent }
  }
}

export function removingTag(uid: string, parent: ITagParent): IRemovingTagAction {
  return {
    type: TagsActionTypes.REMOVING_TAG,
    payload: { uid, parent }
  }
}

export function removedTag(uid: string, parent: ITagParent): IRemovedTagAction {
  return {
    type: TagsActionTypes.REMOVED_TAG,
    payload: { uid, parent }
  }
}

export function removingTagFailed(): IRemovingTagFailedAction {
  return {
    type: TagsActionTypes.REMOVING_TAG_FAILED
  }
}

export type TagsAction =
  ILoadTagsAction |
  ILoadingTagsAction |
  ILoadedTagsAction |
  ILoadingTagsFailedAction |
  IClearTagsAction |
  ICreateTagAction |
  ICreatingTagAction |
  ICreatedTagAction |
  ICreatingTagFailedAction |
  IRemoveTagAction |
  IRemovingTagAction |
  IRemovedTagAction |
  IRemovingTagFailedAction;
