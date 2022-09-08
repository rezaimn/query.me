import React, { FunctionComponent } from 'react';

import './HelpSectionContent.scss';

type HelpSectionContentProps = {

};

const HelpSectionContent: FunctionComponent<HelpSectionContentProps> = ({
  children
}) => {
  return (
    <div className="help-section-content">
      {children}
    </div>
  );
}

export default HelpSectionContent;
