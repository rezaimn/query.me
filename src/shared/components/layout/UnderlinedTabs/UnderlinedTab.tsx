import React, { FunctionComponent } from 'react';
import { IconName } from '@blueprintjs/core';

type UnderlinedTabComponentProps = {
  id: string;
  title: string;
  tag?: string;
  icon?: IconName;
  width?: string;
};

export const UnderlinedTab: FunctionComponent<UnderlinedTabComponentProps> = ({
  children
}) => {
  return (
    <div></div>
  );
}
