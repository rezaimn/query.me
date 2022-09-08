import React, { FunctionComponent } from 'react'
import { createTeleporter } from 'react-teleporter'

const HelpTitleTeleporter = createTeleporter()

export const HelpTitleTarget = () => {
  return <HelpTitleTeleporter.Target />
}

type HelpTitleProps = {

};

export const HelpTitle: FunctionComponent<HelpTitleProps> = ({ children }) => {
  return <HelpTitleTeleporter.Source>{children}</HelpTitleTeleporter.Source>
}
