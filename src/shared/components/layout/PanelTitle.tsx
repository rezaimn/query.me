import React, { FunctionComponent } from 'react'
import { createTeleporter } from 'react-teleporter'

const PanelTitleTeleporter = createTeleporter()

export const PanelTitleTarget = () => {
  return <PanelTitleTeleporter.Target />
}

type PanelTitleProps = {

};

export const PanelTitle: FunctionComponent<PanelTitleProps> = ({ children }) => {
  return <PanelTitleTeleporter.Source>{children}</PanelTitleTeleporter.Source>
}
