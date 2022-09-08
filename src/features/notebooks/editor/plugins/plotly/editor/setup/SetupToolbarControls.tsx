import React, { ComponentType, RefObject, useMemo, useRef, useState, useEffect, useCallback, forwardRef } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import './SetupToolbarControls.scss';

interface SetupToolbarControlsProps /* extends RenderElementProps */ {
  onNewLayer: any;
}

export const SetupToolbarControls = ({
  onNewLayer
}: SetupToolbarControlsProps) => {
  return (
    <div className="setup-toolbar">
      <Button
        icon={IconNames.ADD}
        intent={Intent.PRIMARY}
        onClick={onNewLayer ? onNewLayer : undefined}
      >
        Layer
      </Button>
    </div>
  )
};
