import React, { FunctionComponent } from 'react';
import { Icon, Colors } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import './DatabaseItem.scss';
import { IDatabaseKind } from 'shared/models';

type OnSelectCallback = (database: IDatabaseKind) => void;

type DatabaseItemProps = {
  kind: IDatabaseKind;
  onSelect?: OnSelectCallback;
};

const DatabaseItemComponent: FunctionComponent<DatabaseItemProps> = ({
  kind, onSelect
}: DatabaseItemProps) => {

  const handleSelect = () => {
    onSelect && onSelect(kind);
  };

  return (
    <div
      className="database__item"
      onClick={handleSelect}
    >
      <div>{kind.name}</div>
      <div className="database__item__icon">
        <Icon
          icon={IconNames.CIRCLE_ARROW_RIGHT}
          color={Colors.GRAY3}
          iconSize={24} />
      </div>
    </div>
  );
};

export default DatabaseItemComponent;
