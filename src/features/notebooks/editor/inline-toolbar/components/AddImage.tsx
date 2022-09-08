import React, {Fragment, FunctionComponent, useCallback, useState} from 'react';
import {
  Button,
  Classes,
  ControlGroup,
  Dialog,
  InputGroup,
  MenuItem,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import debounce from 'lodash/debounce';

type OnAddImageCallback = (value?: any) => void;
type OnCancelCallback = () => void;

interface IAddImage {
  onAddImage: OnAddImageCallback;
  onCancel: OnCancelCallback;
  show: boolean;
}

const AddImage: FunctionComponent<IAddImage> = ({ onAddImage,show = false, onCancel }: IAddImage) => {
  const [url, setUrl] = useState("");

  const setUrlDebounce = useCallback(debounce((url: string) => {
    setUrl(url);
  }, 400), []);

  const onClose = useCallback(() => {
    onAddImage(url);
  }, [ url ]);

  return (

    <Fragment>
      <Dialog
        isOpen={show}
        onClose={onClose}
      >
        <div className={Classes.DIALOG_HEADER}>
          Insert Image URL
        </div>
        <div className={Classes.DIALOG_BODY}>
          <ControlGroup>
            <InputGroup
              onChange={(event: any) => setUrlDebounce(event.target.value)}
              fill={true} />
              <Button icon='tick' onClick={() => onClose()}/>
              <Button icon='cross' onClick={() => onCancel()}/>
          </ControlGroup>
        </div>
      </Dialog>
    </Fragment>
  )
};

export default AddImage;
