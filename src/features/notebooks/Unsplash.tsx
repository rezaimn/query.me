import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash/debounce';

import './Unsplash.scss';
import { IState } from '../../shared/store/reducers';
import { unsplashLoad, unsplashSearchLoad } from '../../shared/store/actions/unsplashAction';
import { IUnsplashImage } from '../../shared/models/Unsplash';
import { Classes, InputGroup, Slider } from '@blueprintjs/core';
import { INotebookPageCoverImage } from '../../shared/models';
import UnsplashPositionSlider from './UnsplashPositionSlider';
import { prepareCoverImageData } from './utils';


type SelectCoverImageCallback = (coverImage: INotebookPageCoverImage, download_url?: string) => void;
type SetImageIsLoadedCallback = (value: boolean) => void;

type UnsplashProps = {
  onSelectCoverImage: SelectCoverImageCallback;
  coverImage: INotebookPageCoverImage;
  imageIsLoaded: boolean;
  setImageIsLoaded: SetImageIsLoadedCallback;
};

const Unsplash: FunctionComponent<UnsplashProps> = ({ onSelectCoverImage, coverImage, imageIsLoaded, setImageIsLoaded }: UnsplashProps) => {
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState<string>('');
  const unsplashImageList = useSelector((state: IState) => state.unsplash.unsplashImageList);

  const dispatchSearchInput = (input: string) => {
    dispatch(unsplashSearchLoad(input));
  };
  const onChangeSearchInputWithDebounce = useMemo(() => debounce(dispatchSearchInput, 800), []);

  useEffect(() => {
    dispatch(unsplashLoad());
  }, []);

  const onChangeCoverImage = (image?: IUnsplashImage, position?: number) => {
    if (imageIsLoaded) {
      const updatedCoverImage = {
        ...coverImage,
        url: image ? image.image_url : coverImage?.url,
        position: position ? {
          ...coverImage?.position,
          y: position,
        } : coverImage?.position,
        created_by: image?.created_by,
        created_by_profile_url: image?.created_by_profile_url,
      };
      onSelectCoverImage(updatedCoverImage, image ? image.download_url : '');
    }
    setImageIsLoaded(false);
  };
  const debounceOnChange = useMemo(() => debounce(onSelectCoverImage, 500), []);

  const onChangeSearchInput = (e: any) => {
    const inputValue = e.target.value;
    setSearchInput(inputValue);
    onChangeSearchInputWithDebounce(inputValue);
  };
  const onChangePosition = (position: number) => {
    debounceOnChange(prepareCoverImageData(coverImage, position));
  };
  return (
    <div className='unsplash-container'>
      <div className="unsplash_search">
        <InputGroup
          className={Classes.ROUND}
          large={true}
          leftIcon="search" placeholder="Search images"
          value={searchInput}
          onChange={onChangeSearchInput}
        />
      </div>
      <div className='unspalsh-image-list-container'>
        {
          unsplashImageList.results.map((image: IUnsplashImage, index: number) => {
            return <div key={'cover-image-item-' + index} className='unspalsh-image-list-item'>
              <img style={{ cursor: imageIsLoaded || !coverImage.url ? 'pointer' : 'default' }}
                   onClick={() => onChangeCoverImage(image, undefined)}
                   src={image.thumbnail_url}
              />
              <span style={{ color: '#aaa' }}>By <a className='profile_url' href={image.created_by_profile_url}
                                                    target='_blank'>{image.created_by}</a></span>
            </div>;
          })
        }
      </div>
      <UnsplashPositionSlider onChangeCoverImagePosition={onChangePosition} coverImage={coverImage}/>
    </div>
  );
};

export default Unsplash;
