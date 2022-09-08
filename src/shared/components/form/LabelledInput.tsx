import React, { FunctionComponent } from 'react';
import { Label } from '@blueprintjs/core';

import './LabelledInput.scss';

type LabelledInputProps = {
  inline: boolean;
  label: string;
};

const LabelledInput: FunctionComponent<LabelledInputProps> = ({
  label, inline, children
}) => {
  return (
    <div className="labelled-input">
      <Label className="labelled-input__label">{label}</Label>
      <div className="labelled-input__content">{children}</div>
    </div>
  );
};

export default LabelledInput;
