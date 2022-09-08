import React from 'react';
import {
  Button,
  Colors,
  Icon,
  Intent,
  Position,
  Spinner,
  Toaster,
  Tooltip,
} from '@blueprintjs/core';
import './PreviewButton.scss';
import { jinjaParamIcon } from '../../../../../../shared/utils/custom-icons';

type OnClickCallback = (value: any) => void;

interface PreviewBtnProps {
  preview: boolean;
  loadPreview: boolean;
  onClick: OnClickCallback;
}

const PreviewBtn = ({ preview, loadPreview, onClick }: PreviewBtnProps) => {
  const Loading = React.memo(() => <Spinner intent={Intent.NONE} size={18} />);

  const content = preview ? 'Switch to sql.' : 'Preview parsed Query.';

  return (
    loadPreview ? <Loading /> :
      (
        <Tooltip
          content={content}>
          <Button className="bp3-button bp3-minimal p-0"  onClick={onClick} >
            <Icon
              icon={jinjaParamIcon({fill:preview ? Colors.BLUE3 : Colors.GRAY3, viewBoxDefault:'6 -10 14 40'})}
              className="preview-button"
            />
          </Button>
        </Tooltip>
      )
  )
}

export const MemoizedPreviewBtn = React.memo(PreviewBtn);
