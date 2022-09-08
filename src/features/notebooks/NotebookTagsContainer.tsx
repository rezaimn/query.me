import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IState } from '../../shared/store/reducers';
import { ITag } from '../../shared/models';
import { loadTags, createTag, removeTag } from '../../shared/store/actions/tagActions';
import { EditableTags } from '../../shared/components/list';

type OnEditModeChangeCallback = (editMode: boolean) => void;

type TagsContainerProps = {
  objectType: string;
  objectId: string;
  selectedTags: ITag[];
  disableEditMode?: boolean;
  onEditModeChange?: OnEditModeChangeCallback;
};

const TagsContainer: FunctionComponent<TagsContainerProps> = ({
  objectType, objectId, selectedTags, disableEditMode, onEditModeChange
}: TagsContainerProps) => {
  const tags = useSelector((state: IState) => state.tags.tags);
  const dispatch = useDispatch();

  const onLoadTags = () => {
    dispatch(loadTags());
  };

  const onClearTags = () => {
    // dispatch(clearTags());
  };

  const onAddTag = (tag: ITag) => {
    const index = selectedTags.indexOf(tag);
    if (index === -1) {
      dispatch(createTag({ name: tag.name }, { objectType, objectId }));
    }
  };

  const onRemoveTag = (tag: ITag) => {
    const index = selectedTags.indexOf(tag);
    if (index !== -1) {
      dispatch(removeTag(tag.uid, { objectType, objectId }));
    }
  };

  return (
    <EditableTags
      items={tags}
      selectedItems={selectedTags}
      disableEditMode={disableEditMode}
      onLoadTags={onLoadTags}
      onClearTags={onClearTags}
      onAddTag={onAddTag}
      onRemoveTag={onRemoveTag}
      onEditModeChange={onEditModeChange}
    ></EditableTags>
  );
};

export default TagsContainer;
