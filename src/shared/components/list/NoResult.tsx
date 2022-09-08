import React, { FunctionComponent } from 'react';
import { NonIdealState, IconName } from '@blueprintjs/core';

import './NoResult.scss';

type NoResultProps = {
  icon: IconName | undefined | null;
  title: string;
  description: string;
}

export const NoResultComponent: FunctionComponent<NoResultProps> = ({ icon, title, description }: NoResultProps) => {
  return (
    <NonIdealState
        className="no-results"
        icon={icon}
        title={title}
        description={description} />
  )
}
