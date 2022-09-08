import React, { FunctionComponent, useState, Fragment } from 'react';
import { Classes, Button, Intent, Radio } from '@blueprintjs/core';

import './SaveViewDialog.scss';
import { IView } from '../../../shared/models';

type AddCallback = (data: any) => void;
type SaveCallback = () => void;
type ActionCallback = () => void;

type SaveViewDialogComponentProps = {
  view?: IView | null;
  pending?: boolean;
  onAdd: AddCallback;
  onSave: SaveCallback;
  onClose: ActionCallback;
};

const SaveViewDialogComponent: FunctionComponent<SaveViewDialogComponentProps> = ({
  view, pending, onAdd, onSave, onClose
}: SaveViewDialogComponentProps) => {
  const [ actionExecuted, setActionExecuted ] = useState(false);
  const [ saveMode, setSaveMode ] = useState('save');
  const [ viewName, setViewName ] = useState('');

  if (actionExecuted && !pending) {
    onClose();
    setActionExecuted(false);
  }

  const onChangeSaveMode = (mode: string) => {
    setSaveMode(mode);
  }

  const handleSave = () => {
    onSave();
    setActionExecuted(true);
  };

  const handleAdd = () => {
    onAdd({ name: viewName });
    setActionExecuted(true);
  };

  const onHandleSaveCreate = () => {
    if (saveMode === 'save') {
      handleSave();
    } else {
      handleAdd();
    }
  };

  return (
    <Fragment>
      <div className={`${Classes.DIALOG_BODY} view`}>
        <div className="view__choice">
          <Radio
            value="save"
            checked={saveMode === 'save'}
            onChange={() => onChangeSaveMode('save')}
          />
          Save changes to the view "{view?.name}"
        </div>
        <div className="view__choice">
          <Radio
            value="createNew"
            checked={saveMode === 'createNew'}
            onChange={() => onChangeSaveMode('createNew')}
          />
          Create a new view
          <input
            className={`${Classes.INPUT} view__form__email`}
            name="name"
            id="name-input"
            defaultValue=""
            value={viewName}
            onChange={(event) => setViewName(event.target.value)}
            placeholder="Enter a new view name"
          />
        </div>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button
            onClick={onClose}
          >Cancel</Button>
          <Button
            intent={Intent.PRIMARY}
            loading={pending}
            onClick={onHandleSaveCreate}
          >{ (saveMode === 'save') ? 'Save' : 'Create' }</Button>
        </div>
      </div>
    </Fragment>
  );
};

export default SaveViewDialogComponent;
