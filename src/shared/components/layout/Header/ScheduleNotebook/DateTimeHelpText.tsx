import React from 'react';
import {
  Colors,
  Icon,
  Tooltip,
} from '@blueprintjs/core';
import {
  IconNames
} from '@blueprintjs/icons';

const HelpText = () => (
  <Tooltip
    minimal={true}
    content="UTC Date"
  >
    <Icon
      size={16}
      className="help-text-utc"
      color={Colors.GRAY1}
      icon={IconNames.HELP} />
  </Tooltip>
);

export default HelpText;
