import React, { FunctionComponent } from 'react'
import { createTeleporter } from 'react-teleporter'

const WizardStepsTeleporter = createTeleporter()

export const WizardStepsTarget = () => {
  return <WizardStepsTeleporter.Target />
}

type WizardStepsProps = {

};

export const WizardSteps: FunctionComponent<WizardStepsProps> = ({ children }) => {
  return <WizardStepsTeleporter.Source>{children}</WizardStepsTeleporter.Source>
}
