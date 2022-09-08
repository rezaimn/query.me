import React, { Fragment, FunctionComponent } from 'react';
import {
  ButtonGroup,
  Callout,
  Icon,
} from '@blueprintjs/core';
import {
  IconNames
} from '@blueprintjs/icons';

interface ISelectActionProps {

}

const SelectAction: FunctionComponent<ISelectActionProps> = ({

}: ISelectActionProps) => {
  return (
    <Fragment>
      <div className="select-action-label">
        <Icon icon={IconNames.PLAY}/> Select Action:
      </div>
      <Callout className="select-action__callout">
        <div className="select-action__callout__title">
          <div>
              <ButtonGroup minimal={true}>
              <Icon icon={IconNames.MANUAL} />
              <Icon icon={IconNames.PLAY} />
              <Icon icon={IconNames.ENVELOPE} />
            </ButtonGroup>
            <span className="title-description">Send notebook via Email</span>
          </div>
          <Icon icon={IconNames.CARET_DOWN} />
        </div>
        <span
          className="select-action__callout__content">
          Executes all or selected blocks and sends contents as a HTML email to selected recipients.</span>
      </Callout>
    </Fragment>
  );
};

export default SelectAction;
