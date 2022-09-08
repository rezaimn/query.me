import React, { FunctionComponent } from 'react'
import { createTeleporter } from 'react-teleporter'

const HelpTeleporter = createTeleporter()

export const HelpTarget = () => {
  return <HelpTeleporter.Target />
}

type HelpProps = {

};

export const Help: FunctionComponent<HelpProps> = ({ children }) => {
  return <HelpTeleporter.Source>{children}</HelpTeleporter.Source>
}
