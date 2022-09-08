import React, { FunctionComponent } from 'react';
import { Label } from '@blueprintjs/core';

import './LabelledText.scss';

type LabelledTextProps = {
  inline: boolean;
  label: string;
  labelUppercase?: boolean;
  vAlign?: string;
  skeleton?: boolean;
  multilines?: boolean;
};

const LabelledText: FunctionComponent<LabelledTextProps> = ({
  label, inline, labelUppercase, vAlign, skeleton, multilines, children
}) => {
  return (
    <div
      className={`labelled-text ${skeleton ? 'bp3-skeleton' : ''} ${(vAlign && vAlign === 'center' ? 'align-center': '')}`}
    >
      <Label className={`labelled-text__label ${labelUppercase ? 'uppercase' : ''} ${multilines ? 'multilines' : ''}`}>{label}</Label>
      <div className="labelled-text__content">{children}</div>
    </div>
  );
};

export default LabelledText;
