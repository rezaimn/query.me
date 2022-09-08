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
  IDatabase,
  IDatabaseSharingSettings
} from '../../../../shared/models';
import { IState } from '../../../../shared/store/reducers';

import {
 shareDatabaseWithWorkspace,
} from '../../../../shared/store/actions/databaseActions';

type Callback = (value?: any) => void;

interface IWithWorkspaceContainerProps {
  database: IDatabase;
  onShare?: Callback;
}

interface IWithWorkspaceProps {
  organizationName: string;
  sharingSettings: IDatabaseSharingSettings;
  onChange: Callback;
}

const isChecked = (sharingSettings: any): boolean => {
  return (
    sharingSettings.shared_with_workspace.edit ||
    sharingSettings.shared_with_workspace.use ||
    sharingSettings.shared_with_workspace.view ||
    false
  );
}

const getOption = (sharingSettings: any) => {
  if (sharingSettings.shared_with_workspace.edit) {
    return 'edit';
  } else if (sharingSettings.shared_with_workspace.use) {
    return 'use';
  } else {
    return 'view';
  }
};

const WithWorkspace: FunctionComponent<IWithWorkspaceProps> = ({
  organizationName,
  sharingSettings,
  onChange,
}: IWithWorkspaceProps) => {
  const [ checked, setChecked ] = useState<boolean>(isChecked(sharingSettings));
  const [ selected, setSelected ] = useState(getOption(sharingSettings));

  const debounceOnChange = useMemo(() => debounce(onChange, 400), [ ]);

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
    <div className="share-database-dialog__with-workspace">
      <Switch
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

const WithWorkspaceContainer: FunctionComponent<IWithWorkspaceContainerProps> = ({
  database,
  onShare,
}: IWithWorkspaceContainerProps) => {
  const currentWorkspace = useSelector((state: IState) => state.workspaces.workspace);
  const currentSharingSettings = useSelector((state: IState) => state.databases.currentSharingSettings);
  const databaseUid = database?.uid;
  const dispatch = useDispatch();

  const organizationName = currentWorkspace?.organization.name || '';

  const onShareWithWorkspace = useCallback((action: string) => {
    onShare && onShare();
    if (databaseUid) {
      dispatch(shareDatabaseWithWorkspace(databaseUid, action));
    }
  }, [ databaseUid ]);

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
