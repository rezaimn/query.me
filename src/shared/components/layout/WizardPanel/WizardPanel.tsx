import React, { FunctionComponent } from 'react';
import { Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import { PanelTitleTarget } from '../PanelTitle';
import { HelpTitleTarget } from '../HelpTitle';
import { HelpTarget } from '../Help';
import './WizardPanel.scss';

type WizardPanelProps = {

};

const WizardPanel: FunctionComponent<WizardPanelProps> = ({ children }) => {
  return (
    <div className="wizard">
      <div className="wizard__container">
        <main className="wizard__content">
          <div className="wizard__content__title"><PanelTitleTarget /></div>
          <div className="wizard__content__details">{children}</div>
        </main>
        <aside className="wizard__help">
          <div className="wizard__help__title">
            <Icon icon={IconNames.INFO_SIGN} iconSize={18} />
            <HelpTitleTarget />
          </div>
          <div className="wizard__help__content">
            <HelpTarget />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default WizardPanel;
