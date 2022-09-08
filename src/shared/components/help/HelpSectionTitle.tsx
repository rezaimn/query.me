import React, { FunctionComponent } from 'react';

import './HelpSectionTitle.scss';

type HelpSectionTitleProps = {
  label: string;
};

const HelpSectionTitle: FunctionComponent<HelpSectionTitleProps> = ({
  label
}) => {
  return (
    <h3 className="help-section-title">{label}</h3>
  );
}

export default HelpSectionTitle;
