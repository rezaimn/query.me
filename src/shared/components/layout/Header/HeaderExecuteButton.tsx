import React, { FunctionComponent, useMemo } from 'react';
import { Popover, Menu, MenuItem, Position, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import HeaderNavigationButton from './HeaderNavigationButton';

import './HeaderExecuteButton.scss';

type ExecuteNotebookCallback = () => void;
type ExecuteNotebookPageCallback = () => void;

type HeaderExecuteButtonProps = {
  resultsToCheck: any;
  /*
   *
   */
  onExecuteNotebook: ExecuteNotebookCallback;
  onExecuteNotebookPage: ExecuteNotebookPageCallback;
};

const HeaderExecuteButton: FunctionComponent<HeaderExecuteButtonProps> = ({
  resultsToCheck,
  onExecuteNotebook,
  onExecuteNotebookPage
}: HeaderExecuteButtonProps) => {
  const pendingResults = useMemo(() => {
    return resultsToCheck ? Object.keys(resultsToCheck).filter(key => !!resultsToCheck[key]).length : 0;
  }, [ resultsToCheck ]);
  const executeBtnMenu = (
    <Menu>
      <MenuItem text="Notebook" icon={IconNames.MANUAL} onClick={onExecuteNotebook} />
      <MenuItem text="Current page" icon={IconNames.DOCUMENT} onClick={onExecuteNotebookPage} />
    </Menu>
  );

  return (
    <div className="header-new-button">
      {pendingResults > 0 && (
        <div className="header-new-button__execute-requests">
          Running {pendingResults} {pendingResults > 1 ? 'requests' : 'request'}
        </div>
      )}
      <Popover
        content={executeBtnMenu}
        position={Position.BOTTOM_LEFT}
      >
        <HeaderNavigationButton
          icon={IconNames.PLAY}
          label="Execute"
          pending={pendingResults > 0}
          intent={Intent.PRIMARY} />
      </Popover>
    </div>
  );
}

export default HeaderExecuteButton;
