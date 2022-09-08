import React, { FunctionComponent } from 'react';
import { IconName } from '@blueprintjs/core';

type TabComponentProps = {
  id: string;
  title: string;
  icon?: IconName;
  status?: string;
  closable?: boolean;
};

const Tab: FunctionComponent<TabComponentProps> = ({
  children
}) => {
  return (
    <div></div>
  );
}

export default Tab;
