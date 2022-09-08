import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import { useEditor, RenderElementProps } from 'slate-react';

import {
  MemoizedSelectType,
  MemoizedBooleanInput,
  MemoizedDateInput,
  MemoizedNumberInput,
  MemoizedTextInput,

  BOOLEAN_INPUT_TYPE,
  DATE_INPUT_TYPE,
  NUMBER_INPUT_TYPE,
  TEXT_INPUT_TYPE,
} from './components';
import { useNotebookEditable } from "../../../hooks/use-editable";
import BlockName from '../../components/BlockName';
import { updateElementProps } from '../../utils';

import './ParameterElement.scss';
import isHotkey from 'is-hotkey';

type OnChangeCallback = (value: any) => void;
type OnKeyPressCallback = (event: any) => void;

interface ParameterRenderElementProps extends RenderElementProps {
}

interface ISwitchInput {
  type: string;
  value: string;
  editable: boolean;
  onChange: OnChangeCallback;
  onKeyPress: OnKeyPressCallback;
}

const SwitchInput = React.memo(({
  type,
  value,
  editable,
  onChange,
  onKeyPress
}: ISwitchInput) => {
  const isBoolean = type === BOOLEAN_INPUT_TYPE;
  const isDate = type === DATE_INPUT_TYPE;
  const isNumber = type === NUMBER_INPUT_TYPE;
  const isText = type === TEXT_INPUT_TYPE;

  useEffect(() => {
    return () => {
      // on component unmount remove debounce for performance reason
      if (debounceOnChange && debounceOnChange.hasOwnProperty('cancel')) {
        debounceOnChange.cancel();
      }
    };
  }, []);
  const debounceOnChange = useMemo(() => debounce(onChange, 800), []);

  const onValueChange = useCallback((newValue: any) => {
    debounceOnChange(newValue);
  }, []);

  return (
    <Fragment>
      { isBoolean && <MemoizedBooleanInput onKeyPress={onKeyPress} value={value} editable={editable} onChange={onValueChange} /> }
      { isDate && <MemoizedDateInput value={value} editable={editable} onChange={onValueChange} /> }
      { isNumber && <MemoizedNumberInput onKeyPress={onKeyPress} value={value} editable={editable} onChange={onValueChange} /> }
      { isText && <MemoizedTextInput onKeyPress={onKeyPress} value={value} editable={editable} onChange={onValueChange} /> }
    </Fragment>
  )
});


export const ParameterElement = ({
  attributes,
  children,
  element,
}: ParameterRenderElementProps) => {
  const editor = useEditor();
  const editable = useNotebookEditable();

  const [ value, setValue ] = useState<string>((element as any).parameter_value as string || '');
  const [ showIcon, setShowIcon ] = useState<boolean>(false);
  const [ type, setType ] = useState<string>(
    element.hasOwnProperty('parameter_type') ? (element as any).parameter_type as string : TEXT_INPUT_TYPE);
  const elementUid = (element as any).uid;

  useEffect(() => {
    if (elementUid && !(element as any).parameter_type) {
      /* if element is created and type is not set, default it  */
      updateElementProps(editor, element, 'parameter_type', TEXT_INPUT_TYPE);
    }
  }, [ elementUid ]);

  const onTypeChange = useCallback((newType: string) => {
    if (newType !== type) {
      setType(newType);
      updateElementProps(editor, element, 'parameter_type', newType);
    }
  }, [ type ]);

  const onValueChange = useCallback((newValue: any) => {
    updateElementProps(editor, element, 'parameter_value', newValue);
  }, [ value ]);

  const onKeyPress = (event: any) => {
    if (isHotkey('mod+.', event)) {
      document.getElementById('action_' + elementUid)?.click();
    }
  };

  const onNameUpdate = useCallback((value: string) => {
    updateElementProps(editor, element, 'name', value);
  }, []);

  const onMouseEvent = useCallback((value: boolean) => {
    return () => {
      if (value !== showIcon) {
        setShowIcon(value);
      }
    }
  }, [ showIcon ]);

  return (
    <div className="parameter" {...attributes}
         onMouseOver={onMouseEvent(true)}
         onMouseLeave={onMouseEvent(false)}>
      <div suppressContentEditableWarning contentEditable="false" style={{userSelect: 'none'}}>
        <div className="parameter__header" data-cy='parameterTitle'>
          <BlockName
            uid={elementUid as string}
            defaultValue={(element as any).name as string}
            onUpdate={onNameUpdate} />
          {
            editable && (
              <MemoizedSelectType
                showIcon={showIcon}
                value={type}
                disable={!elementUid}
                onChange={onTypeChange} />
            )
          }
        </div>
        <SwitchInput
          type={type}
          value={value}
          editable={editable}
          onChange={onValueChange}
          onKeyPress={onKeyPress}
        />
      </div>
      <span suppressContentEditableWarning className="void-element">
        {children}
      </span>
    </div>
  );
};
