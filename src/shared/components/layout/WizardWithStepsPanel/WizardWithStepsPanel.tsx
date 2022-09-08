import React, { FunctionComponent } from 'react';
import { Button } from '@blueprintjs/core';

import { PanelTitleTarget } from '../PanelTitle';
import { PanelSubTitleTarget } from '../PanelSubTitle';
import { WizardStepsTarget } from '../WizardSteps';
import './WizardWithStepsPanel.scss';

type WizardWithStepsPanelProps = {

};

export const WizardWithStepsPanel: FunctionComponent<WizardWithStepsPanelProps> = ({ children }) => {
  return (
    <div className="wizard-steps">
      <header className="wizard-steps__header">
        <div className="wizard-steps__header__titles">
          <div className="wizard-steps__header__title"><PanelTitleTarget /></div>
          <div className="wizard-steps__header__subtitle"><PanelSubTitleTarget /></div>
        </div>
        <div className="wizard-steps__header__toolbar">
          <Button className="wizard-steps__header__toolbar__button">Done</Button>
        </div>
      </header>
      <main className="wizard-steps__content">
        <aside className="wizard-steps__content__steps">
          <WizardStepsTarget />
        </aside>
        <div className="wizard-steps__content__details">{children}</div>
      </main>
    </div>
  );
}
