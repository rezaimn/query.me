import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  Position,
  Popover,
  Tooltip, Tabs, Tab, Icon, Spinner, SpinnerSize,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import CoverImageButton from './CoverImageButton';
import CoverImageURLForm from './CoverImageURLForm';
import './CoverImage.scss';

import { INotebookPageCoverImage } from '../../shared/models';
import { useNotebookEditable } from './hooks/use-editable';
import Unsplash from './Unsplash';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '../../shared/store/reducers';
import { unsplashRandomLoad } from '../../shared/store/actions/unsplashAction';
import { coverImageVerticalPositionDefault } from './constants';

type UrlSubmitCallback = (data: INotebookPageCoverImage, download_url?: string) => void;

type CoverImageComponentProps = {
  coverImage: INotebookPageCoverImage;
  onCoverImageUrlChange: UrlSubmitCallback;
};

const CoverImageComponent: FunctionComponent<CoverImageComponentProps> = ({
   coverImage,
   onCoverImageUrlChange,
}: CoverImageComponentProps) => {
  const [
    changeImageUrlMenuOpened,
    setChangeImageUrlMenuOpened,
  ] = useState(false);
  const editable = useNotebookEditable();
  const [selectedTabId, setSelectedTabId] = useState<string>('unsplash');
  const [imageIsLoaded, setImageIsLoaded] = useState<boolean>(false);
  const [coverImageTabsMenuIsOpen, setCoverImageTabsMenuIsOpen] = useState<boolean>(false);
  const onChangeImageUrlMenuIsOpen = (opened: boolean) => {
    setChangeImageUrlMenuOpened(opened);
  };
  const randomImage = useSelector((state: IState) => state.unsplash.unsplashRandom);
  const dispatch = useDispatch();
  useEffect(() => {
    if (randomImage) {
      const updatedCoverImage = {
        url: randomImage?.image_url || '',
        position: {
          x: 0,
          y: coverImageVerticalPositionDefault,
        },
        created_by: randomImage?.created_by || '',
        created_by_profile_url: randomImage?.created_by_profile_url || '',
      };
      return onCoverImageUrlChange(updatedCoverImage, randomImage?.download_url);
    }

  }, [randomImage]);

  const isURL = (url: string) => url.startsWith('http://') || url.startsWith('https://');

  // typeguard needed so coverImage.url in jsx below doesn't throw type error
  function isCoverImage(coverImage: INotebookPageCoverImage | null): coverImage is INotebookPageCoverImage {
    return (
      !!coverImage &&
      coverImage.hasOwnProperty('position') &&
      coverImage.hasOwnProperty('url') &&
      coverImage?.url?.length > 0 && isURL(coverImage.url)
    );
  }

  const coverImageIsSet: boolean = isCoverImage(coverImage);

  const popoverChildren = (
    <Tooltip
      content={coverImageIsSet ? <>Change image</> : <>Add a cover image</>}
      position={Position.BOTTOM}
    >
      <CoverImageButton
        icon={IconNames.MEDIA}
        label={coverImageIsSet ? 'Change Cover' : 'Add Cover'}
        minimal={!coverImageIsSet}
        style={{ opacity: changeImageUrlMenuOpened || coverImageTabsMenuIsOpen ? 1 : 0 }}
      />
    </Tooltip>
  );

  const ondSubmitUrl = (coverImage: any, download_url?: string) => {
    onChangeImageUrlMenuIsOpen(false);
    return onCoverImageUrlChange(coverImage, download_url);
  };

  const onGetRandomCoverImage = () => {
    dispatch(unsplashRandomLoad());
  };

  const onCoverImageDelete = () => {
    ondSubmitUrl(
      {
        url: '',
        position: null,
        created_by: '',
        created_by_profile_url: '',
      },
    );
    document.getElementById('cover-image-menu-btn')?.click();
  };
  const popover = (
    <Popover
      onOpened={() => setCoverImageTabsMenuIsOpen(true)}
      onClosed={() => setCoverImageTabsMenuIsOpen(false)}
      content={(
        <Tabs
          className='cover-image-tabs'
          onChange={(e: string) => {
            setSelectedTabId(e);
          }}
          selectedTabId={selectedTabId}
        >
          <Tab id="link" title="Link" panel={<CoverImageURLForm
            coverImage={coverImage}
            onUrlSubmit={ondSubmitUrl}
          />}/>
          <Tab id="unsplash"
            title={
              <>
                <Icon
                  icon={
                    <svg height='14px' role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <title/>
                      <path d="M7.5 6.75V0h9v6.75h-9zm9 3.75H24V24H0V10.5h7.5v6.75h9V10.5z"/>
                    </svg>
                  }/>
                  <span style={{marginLeft:'4px'}} >
                     Unsplash
                  </span>
              </>
            }
            panel={<Unsplash imageIsLoaded={imageIsLoaded} setImageIsLoaded={setImageIsLoaded} coverImage={coverImage} onSelectCoverImage={ondSubmitUrl}/>}
          />
          <Tabs.Expander/>
          <Icon
            onClick={() => {
              if (!coverImage.url || imageIsLoaded) {
                onGetRandomCoverImage();
                setImageIsLoaded(false);
              }
            }} className='btn-icon' icon={IconNames.REFRESH}
            style={{ cursor: imageIsLoaded || !coverImage.url ? 'pointer' : 'default' }}
          />
          <Icon
            onClick={() => {
              onCoverImageDelete();
             }}
             className='btn-icon'
             icon={IconNames.TRASH}
          />
        </Tabs>
      )}
      position={Position.BOTTOM}
      targetTagName="div"
      wrapperTagName="div"
      className={coverImageIsSet ? 'cover-image-url-popper' : 'add-cover-image-popper'}
    >
      {popoverChildren}
    </Popover>
  );

  return (
    <div className="cover-image-component"
         onMouseLeave={() => onChangeImageUrlMenuIsOpen(false)}
         onMouseOver={() => onChangeImageUrlMenuIsOpen(true)}
    >
      {
        isCoverImage(coverImage) &&
          <>
            {
              !imageIsLoaded &&
              <Spinner className='image-load-spinner' intent={'none'} size={SpinnerSize.STANDARD}  />
            }
            <img
              onLoad={() => setImageIsLoaded(true)}
              alt="notebook page cover"
              className="cover-image-component__image"
              src={coverImage?.url}
              style={{
                objectPosition: `center ${coverImage?.position?.y}%`,
              }}
            />
        </>
      }
      {editable && popover}
    </div>
  );
};

export default CoverImageComponent;
