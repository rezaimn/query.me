import React, { useCallback, useState } from 'react';
import { StyledElement } from '@udecode/plate-styled-components';
import { getMediaEmbedElementStyles } from './MediaEmbedElement.styles';
import { MediaEmbedElementProps } from './MediaEmbedElement.types';
import { Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import { convertYoutubeUrlToEmbed } from '../../inline-toolbar/utils/convertYoutubeUrlToEmbed';
import { useDispatch, useSelector } from 'react-redux';
import { saveNotebookPageBlock } from '../../../../../shared/store/actions/notebookActions';
import { IState } from '../../../../../shared/store/reducers';
import './MediaEmbedElement.scss';
import AddMediaEmbed from '../../inline-toolbar/components/AddMediaEmbed';

export const MediaEmbedElement = (props: MediaEmbedElementProps) => {
  const [showEditIcon, setShowEditIcon] = useState<boolean>(false);
  const { attributes, children, nodeProps, element } = props;
  const [showAddMediaEmbedPopup, setShowAddMediaEmbedPopup] = useState<boolean>(false);
  const rootProps = StyledElement(props);
  const currentPage = useSelector((state: IState) => state.notebooks.selectedNotebookPage);
  const [mediaEmbed, setMediaEmbed] = useState(element.mediaEmbed);
  const querySeparator = mediaEmbed?.url?.includes('?') ? '' : '?';
  const styles: any = getMediaEmbedElementStyles(props);
  const dispatch = useDispatch();
  const onAddMediaEmbed = useCallback((mediaEmbedUpdated?: any) => {
    setShowAddMediaEmbedPopup(false);
    const mediaEmbedUpdatedData = { ...mediaEmbedUpdated };
    if (mediaEmbedUpdated.url) {
      mediaEmbedUpdatedData.url = convertYoutubeUrlToEmbed(mediaEmbedUpdated.url);
      setMediaEmbed(mediaEmbedUpdatedData);
      const blockIndex = currentPage?.blocks.findIndex((child: any) => child.uid === element.uid);
      if (blockIndex !== undefined && blockIndex >= 0) {
        let block: any = { ...currentPage?.blocks[blockIndex] };
        block.content_json.mediaEmbed = mediaEmbedUpdatedData;
        dispatch(saveNotebookPageBlock(element.uid, { uid: currentPage?.uid }, block));
      }
    }
  }, [element]);

  return (
    <>
      <div
        {...attributes}
        className={`${styles.root.className}`}
        {...rootProps}
        onMouseOver={() => setShowEditIcon(true)}
        onMouseLeave={() => setShowEditIcon(false)}
      >
        <Icon onClick={() => setShowAddMediaEmbedPopup(true)} icon={IconNames.EDIT} className='edit-media-btn'
              style={{ display: showEditIcon ? 'inline-flex' : 'none' }}/>
        <div contentEditable={false}>
          <div
            className={`${styles.iframeWrapper.className}`}
          >
            <iframe
              style={{ width: `${mediaEmbed?.width}px`, height: `${mediaEmbed?.height}px` }}
              className={`${styles.iframe.className}`}
              title="embed"
              src={`${mediaEmbed?.url}${querySeparator}&title=0&byline=0&portrait=0`}
              frameBorder="0"
              {...nodeProps}
            />
          </div>
        </div>
        {children}
      </div>
      <AddMediaEmbed selectedEmbedMedia={mediaEmbed} onAddMediaEmbed={onAddMediaEmbed} show={showAddMediaEmbedPopup}/>
    </>
  );
};
