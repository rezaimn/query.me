import React from 'react';
import {
  Button,
  Colors,
  Icon,
  Intent,
  Spinner,
  Tooltip,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { isIOS, isMacOs } from 'react-device-detect';

type OnClickCallback = (value: any) => void;

interface ExecuteBtnProps {
  currentDatabase: any;
  executing: boolean;
  selection: boolean;
  preview: boolean;
  onClick: OnClickCallback;
}

const ExecuteBtn = ({ executing, selection, preview, currentDatabase, onClick }: ExecuteBtnProps) => {
  const Loading = React.memo(() => <Spinner intent={Intent.NONE} size={18} />);

  const shortcut = isIOS || isMacOs ? '⌘ + Enter' : 'Ctrl + Enter';
  const content =
    (selection ? `Execute Selected ${shortcut})` : `Execute Block (${shortcut})`);
  const color = currentDatabase ? (Colors.BLUE3 ) : Colors.GRAY3;

  return (
    executing ? <Loading/> : (
      <Tooltip
        content={content}>
        <Button
          className='bp3-button bp3-minimal'
          icon={IconNames.PLAY}
          color={color}
          onClick={onClick}
        />
      </Tooltip>
    )
  );
}

export const MemoizedExecuteBtn = React.memo(ExecuteBtn);
