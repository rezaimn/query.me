import React, { Fragment, FunctionComponent, useState } from 'react';
import {
  Button,
  Classes,
  Dialog,
  FormGroup,
  InputGroup,
} from '@blueprintjs/core';

import './AddMediaEmbed.scss';
import { IEmbedMedia } from '../../../constants';

type OnAddMediaEmbedCallback = (value?: any) => void;

interface IAddMediaEmbed {
  onAddMediaEmbed: OnAddMediaEmbedCallback;
  show: boolean;
  selectedEmbedMedia?: any;
}

const AddMediaEmbed: FunctionComponent<IAddMediaEmbed> = ({ onAddMediaEmbed, show = false, selectedEmbedMedia }: IAddMediaEmbed) => {
  const [embedMedia, setEmbedMedia] = useState<IEmbedMedia>(selectedEmbedMedia ? selectedEmbedMedia : {
    height: 315,
    width: 560,
    url: '',
  });
  const onChangeEmbedMedia = (value: any, type: any) => {
    setEmbedMedia({
      ...embedMedia,
      [type]: value,
    });
  };

  const onClose = () => {
    onAddMediaEmbed(embedMedia);
  };

  return (

    <Fragment>
      <Dialog
        isOpen={show}
        onClose={onClose}
        className='embed-media-dialog'
      >
        <div className={Classes.DIALOG_HEADER}>
          Insert embedded media
        </div>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup
            label='URL'
            labelFor="url"
          >
            <InputGroup
              id='url'
              className="bp3-input .modifier bp3-fill media-embed-input-field"
              placeholder='Embedded Media Url ...'
              autoFocus={true}
              value={embedMedia.url}
              onChange={(event: any) => onChangeEmbedMedia(event.target.value, 'url')}
            />
          </FormGroup>
          <div style={{ display: 'flex' }}>
            <FormGroup
              label='Width'
              labelFor="width"
              className='media-embed-width-input-group'
            >
              <InputGroup
                id='width'
                className="bp3-input .modifier bp3-fill media-embed-input-field"
                type="number" max={1024} min={100}
                placeholder="Width px" dir="auto"
                value={embedMedia.width?.toString()}
                onChange={(event) => onChangeEmbedMedia(event.target.value, 'width')}
              />
            </FormGroup>
            <FormGroup
              label='Height'
              labelFor="height"
              className='media-embed-height-input-group'
            >
              <InputGroup
                id='height'
                className="bp3-input .modifier bp3-fill media-embed-input-field"
                type="number" max={800} min={100}
                placeholder="Height px" dir="auto"
                value={embedMedia.height?.toString()}
                onChange={(event) => onChangeEmbedMedia(event.target.value, 'height')}
              />
            </FormGroup>
          </div>
          <Button className="bp3-button embed-media-dialog-btn" intent="primary" onClick={() => onClose()}>Save</Button>
        </div>
      </Dialog>
    </Fragment>
  );
};

export default AddMediaEmbed;
