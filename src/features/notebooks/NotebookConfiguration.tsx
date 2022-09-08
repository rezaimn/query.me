import React, {FunctionComponent, useCallback, useEffect, useMemo, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
import {
  Callout,
  Classes,
  Drawer,
  Icon,
  Intent,
  Position,
  Toaster,
  Tooltip
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-chrome";

import { IState } from "../../shared/store/reducers";
import {INotebook} from "../../shared/models";
import {
  saveNotebook,
  toggleConfigView,
} from "../../shared/store/actions/notebookActions";

import './NotebookConfiguration.scss';

interface NotebookConfigurationComponentProps {
  notebook: INotebook | undefined | null;
}

const toasterMessage = Toaster.create({
  className: 'toaster-message',
  position: Position.TOP
});

const example = '{ "import": [{ "id": "other_notebook_id" }] }';

const validateValueKeys = (keys: string[], structureKeys: string[]) => {
  /*
   * check if keys contain other keys than the allowed ones
   */
  const validateKeys = (newOne: any[], against: any[]) =>
    newOne.filter((key: string) => against.findIndex((_key: string) => _key === key) < 0);

  if (keys.length !== structureKeys.length) {
    throw new Error(`JSON structure should be ${example}`);
  } else {
    const cleanKeys = validateKeys(keys, structureKeys);

    if (cleanKeys.length) {
      throw new Error(`Unknown key: ${cleanKeys[0]}`);
    }
  }
  return true;
}

const validateValue = (value: string) => {
  const newValue = JSON.parse(value);

  if (newValue) {
    /*
     * validate structure
     */
    const structure = {
      import: [
        {
          id: '',
          // as: '', @TODO
        }
      ]
    }
    /*
     * check if keys contain other keys than the allowed ones
     */
    let structureKeys = Object.keys(structure);
    let keys = Object.keys(newValue);

    validateValueKeys(keys, structureKeys);

    const imports = newValue.import;
    if (imports.length) {
        structureKeys = Object.keys(structure.import[0]);
        for (let index = 0, length = imports.length; index < length; index++) {
          keys = Object.keys(imports[index]);

          validateValueKeys(keys, structureKeys);
        }
      }
  }
};

const NotebookConfigurationComponent: FunctionComponent<NotebookConfigurationComponentProps> = ({
  notebook
}: NotebookConfigurationComponentProps) => {
  const notebookUid = notebook?.uid;
  const [ value, setValue ] = useState(notebook?.params as string || '');
  const [ error, setError ] = useState('');
  const [ changed, setChanged ] = useState<boolean>(false);
  const isOpen = useSelector((state: IState) => state.notebooks.showConfigs);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      if (debounceOnChange && debounceOnChange.hasOwnProperty('cancel')) {
        debounceOnChange.cancel();
      }
    }
  }, []);

  const onClose = useCallback((event: any) => {
    dispatch(toggleConfigView());

    try {
      value && validateValue(value); // only validate if we have value

      if (notebookUid && changed) {
        dispatch(saveNotebook(notebookUid, { params: value }));
      }
    } catch (e) {
      toasterMessage.show({
        message: `Configuration not saved: ${e.message}.`,
        intent: Intent.DANGER
      });
    }
    setChanged(false); // on close, set changed to false
  }, [ value, changed ]);

  const editorProps = useMemo(() => {
    return {
      contentEditable: false,
      $blockScrolling: true,
    }
  }, [ ]);
  const editorOptions = useMemo(() => {
    return {
      useWorker: false,
      minLines: 10,
      maxLines: 20,
    }
  }, [ ]);

  const onChange = useCallback((value: any) => {
    try {
      setValue(value);
      setChanged(true);
      validateValue(value);
    } catch (e) {
      setError(e.message);
      return;
    }
    setError(''); // no errors, JSON is valid
  }, []);
  const debounceOnChange = useMemo(() => debounce(onChange, 800), []);

  if (!notebookUid) {
    return null;
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      hasBackdrop={false}
      title='Notebook Configuration'
      size='30%'
    >
      <div className={Classes.DRAWER_BODY + ' notebook-configuration'}>
        <div className={Classes.DIALOG_BODY}>
          <p>
            <span>Import notebook context </span>
            <Tooltip
              popoverClassName="info-sign-class-name"
              content={`e.g. ${example}`}
              position={Position.BOTTOM}
            ><Icon icon={IconNames.INFO_SIGN} /></Tooltip>
          </p>
          <div>
            <AceEditor
              className={`notebook-configuration__editor ${error ? 'has-error' : ''}`}
              editorProps={editorProps}
              setOptions={editorOptions}
              width="calc(100% - 1px)"
              mode="json"
              theme="chrome"
              name="notebook_configuration"
              showPrintMargin={false}
              defaultValue={value}
              onChange={debounceOnChange}
            />
          </div>
          { error && <Callout intent={Intent.DANGER}>{error}</Callout> }
        </div>
      </div>
    </Drawer>
  );
}

export default NotebookConfigurationComponent;
