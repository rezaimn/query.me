import React, { FunctionComponent, useCallback } from 'react';
import {
  Button,
  Colors,
  ControlGroup,
  InputGroup,
  Icon,
  Intent,
  Position,
  Toaster
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface ICopyLink {
  url: string;
  isPublic: boolean;
}

const copyMessage = Toaster.create({
  className: 'copy-message',
  position: Position.TOP
});

const CopyLink: FunctionComponent<ICopyLink> = ({ url, isPublic }: ICopyLink) => {
  const onCopy = useCallback((event: any) => {
    copyMessage.show({
      message: "Link has been copied to clipboard!",
      intent: Intent.SUCCESS
    });
  }, []);

  const note = isPublic ?
    'Everyone on the internet with the link can access this notebook.' :
    'Only people with access to the notebook can open the link.';

  return (
    <div className="share-notebook__popover__content">
      <p><Icon icon={IconNames.LINK} color={Colors.GRAY1} /> Copy link:</p>
      <ControlGroup>
        <InputGroup
          className="copy-link"
          disabled={true}
          defaultValue={url}
          fill={true} />
        <CopyToClipboard text={url} onCopy={onCopy}>
          <Button icon={IconNames.DUPLICATE} />
        </CopyToClipboard>
      </ControlGroup>
      <span
        className="share-notebook__popover__note"
      >
        { note }
      </span>
    </div>
  );
}

export default CopyLink;
