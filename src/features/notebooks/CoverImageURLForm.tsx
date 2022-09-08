import React, { FunctionComponent, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormElement from '../../shared/components/form/FormElement';
import { INotebookPageCoverImage } from '../../shared/models';
import './CoverImageURLForm.scss';
import {
  Button,
  Classes, Icon,
} from '@blueprintjs/core';
import UnsplashPositionSlider from './UnsplashPositionSlider';
import debounce from 'lodash/debounce';
import { fromUnsplash, prepareCoverImageData } from './utils';

type UrlSubmitCallback = (data: INotebookPageCoverImage) => void;

type CoverImageURLFormComponentProps = {
  coverImage: INotebookPageCoverImage;
  onUrlSubmit: UrlSubmitCallback;
};

const CoverImageURLForm: FunctionComponent<CoverImageURLFormComponentProps> = ({ coverImage, onUrlSubmit }) => {
  const { handleSubmit, errors, control } = useForm();
  const debounceOnChange = useMemo(() => debounce(onUrlSubmit, 500), []);

  const onSubmit = ({ coverImageUrl }: any) => {
    const coverImageUpdated = prepareCoverImageData({
      url: coverImageUrl,
      position: { x: 0, y: 0 },
    }, coverImage?.position?.y || 50);
    onUrlSubmit(coverImageUpdated);
  };

  const onChangeCoverImagePosition = (position: number) => {
    const coverImageUpdated = prepareCoverImageData(coverImage, position);
    debounceOnChange(coverImageUpdated);
  };
  return (
    <>
      <form
        className="cover-image-url-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div style={{ marginBottom: '10px' }}>
          <Icon icon={'link'}/>
          <span style={{ fontSize: '16px' }}> Image URL</span>
        </div>
        <div className='cover-image-url-input-group'>
          <FormElement
            id="coverImageUrl"
            label=''
            errorMessage="Cover Image URL is required and must start with http or https"
            formConfig={{ control, errors }}
            // theres no validations, because you can set the url to empty to remove the image.
            // however, the image will only show if it starts with http:// or https://
            rules={{}}
            defaultValue={coverImage && coverImage.url ? coverImage.url : ''}
            placeholder="Enter a URL"
          />
          <div className="">
            <Button
              onClick={(e: any) => {
                e.stopPropagation();
              }}
              intent="primary"
              className={Classes.POPOVER_DISMISS}
              type="submit"
            >Apply</Button>
          </div>
        </div>
      </form>
      {
        fromUnsplash(coverImage.url) && coverImage.created_by &&
        <div style={{ marginBottom: '20px' }}>
          <span className='image-by'>
            Current Image By <a className='image-by__profile' href={coverImage?.created_by_profile_url} target='_blank'>
              {coverImage?.created_by}
            </a>  on Unsplash
          </span>
        </div>
      }
      <UnsplashPositionSlider coverImage={coverImage} onChangeCoverImagePosition={onChangeCoverImagePosition}/>
    </>
  );
};

export default CoverImageURLForm;
