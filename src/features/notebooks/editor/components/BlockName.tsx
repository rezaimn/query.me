import React, { Fragment, FunctionComponent, useCallback, useState } from 'react';
import {
  EditableText,
  Intent,
  Position,
  Tooltip,
} from '@blueprintjs/core';
import { useNotebookEditable } from "../../hooks/use-editable";
import './BlockName.scss';

type OnUpdateCallback = (value: any) => void;
type IsNameValidCallback = (value: any) => void;

interface IBlockName {
  uid: string;
  defaultValue: string;
  onUpdate: OnUpdateCallback;
  isNameValid?: IsNameValidCallback;
}

/*
 * name must be between 1 and 64 characters
 * name must not start with a number
 * name is allowed to contain on \w characters [a-zA-Z0-9_]
 */
export const nameIsValid = (value: string) => !!value && !!value.match(/^[_a-zA-Z][\w]{0,63}$/);

const BlockName: FunctionComponent<IBlockName> = ({ uid, defaultValue, onUpdate, isNameValid }: IBlockName) => {
  const [ name, setName ] = useState(defaultValue);
  const [ intent, setIntent ] = useState(name ? undefined : Intent.DANGER);
  const editable = useNotebookEditable();

  const onNameUpdate = useCallback((value: string) => {
    if (nameIsValid(value) && value !== defaultValue) {
      setIntent(undefined);
      onUpdate(value);
    }
  }, []);

  const onChange = useCallback((value: string) => {
    if(isNameValid){
      isNameValid(nameIsValid(value));
    }
    if (nameIsValid(value)) {
      if (intent === Intent.DANGER) {
        setIntent(undefined);
      }
    } else {
      setIntent(Intent.DANGER);
    }
    setName(value);
  }, []);

  let disabled = !uid; /* if block has no uid, disable edit name */
  if (!editable) {
    disabled = true;
  }

  return (
    <div>
      <EditableText
        className="editable-block-title"
        intent={intent}
        value={name}
        disabled={disabled}
        onChange={onChange}
        onConfirm={onNameUpdate}
      />
      {
        !nameIsValid(name) &&
        <p className='block-name-error-message'>Invalid characters. Only A-Z, a-z, 0-9
          and _ are allowed.</p>
      }
    </div>
  );
};

export default React.memo(BlockName);
