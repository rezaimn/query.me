import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
import {
  Colors,
  Icon,
  Spinner,
  Switch,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import SelectAction from './SelectAction';
import {
  INotebookSharingSettings
} from '../../../../models';
import {IState} from "../../../../store/reducers";
import {
  loadNotebookSharingSettings,
  shareNotebookWithWorkspace,
} from '../../../../store/actions/notebookActions';

type Callback = (value?: any) => void;

interface IWithWorkspaceProps {
  organizationName: string; /* @TODO - change it to Workspace name after we allow users to create Workspaces */
  sharingSettings: INotebookSharingSettings;
  onChange: Callback;
}

const isChecked = (sharingSettings: any): boolean => {
  return (
    sharingSettings.shared_with_workspace.edit ||
    sharingSettings.shared_with_workspace.view ||
    false
  );
}

const getOption = (sharingSettings: any) => {
  return sharingSettings.shared_with_workspace.edit ? 'edit' : 'view';
};

const WithWorkspace: FunctionComponent<IWithWorkspaceProps> = ({
  organizationName,
  sharingSettings,
  onChange,
}: IWithWorkspaceProps) => {
  const [ checked, setChecked ] = useState<boolean>(isChecked(sharingSettings));
  const [ selected, setSelected ] = useState(getOption(sharingSettings));

  const debounceOnChange = useMemo(() => debounce(onChange, 400), [ ]);

  useEffect(() => {
    /*
     * this is used in case Notebook is shared with Public and we need to set Workspace enabled as well
     */
    const newChecked = isChecked(sharingSettings);
    const newSelected = getOption(sharingSettings);
    const initialChecked = checked;
    const initialSelected = selected;

    if (newChecked !== initialChecked) {
      setChecked(newChecked);
    }
    if (newSelected !== initialSelected) {
      setSelected(newSelected);
    }
  }, [ sharingSettings ]);

  const handleOnChange = useCallback((event: any) => {
    const value = event.target.checked;

    setChecked(value);
    // if value is false (shared not checked) - we don't send the permission name in order to remove sharing settings
    debounceOnChange(value ? selected : "");
  }, [ selected ]);

  const handleActionChange = useCallback((action: any) => {
    setSelected(action.value);

    if (checked) {
      debounceOnChange(action.value);
    }
  }, [ checked ]);

  const ForWorkspaceLabel = useMemo(() => (
    <>
      <Icon icon={IconNames.OFFICE} color={Colors.GRAY1} /> Everyone at {organizationName}
    </>
  ), [ ]);

  return (
    <div className="share-notebook__popover__content">
      <Switch
        className="share-notebook__popover__everyone"
        inline={true}
        large={true}
        labelElement={ForWorkspaceLabel}
        checked={checked}
        onChange={handleOnChange}
      />
      <SelectAction
        selected={selected}
        disabled={!checked} /* if not checked */
        onChange={handleActionChange} />
    </div>
  );
}

const WithWorkspaceContainer: FunctionComponent = ({}) => {
  const notebook = useSelector((state: IState) => state.notebooks.notebook);
  const currentWorkspace = useSelector((state: IState) => state.workspaces.workspace);
  const currentSharingSettings = useSelector((state: IState) => state.notebooks.currentSharingSettings);
  const notebookUid = notebook?.uid;
  const dispatch = useDispatch();

  const organizationName = currentWorkspace?.organization.name || '';

  const onShareWithWorkspace = useCallback((action: string) => {
    if (notebookUid) {
      dispatch(shareNotebookWithWorkspace(notebookUid, action));
    }
  }, [ notebookUid ]);

  if (!currentSharingSettings) {
    return <Spinner size={20} />
  }

  return (
    <WithWorkspace
      organizationName={organizationName}
      sharingSettings={currentSharingSettings}
      onChange={onShareWithWorkspace} />
  );
};

export default WithWorkspaceContainer;
