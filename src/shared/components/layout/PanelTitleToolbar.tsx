import React, { FunctionComponent } from 'react'
import { createTeleporter } from 'react-teleporter'

const PanelTitleToolbarTeleporter = createTeleporter()

export const PanelTitleToolbarTarget = () => {
  return <PanelTitleToolbarTeleporter.Target />
}

type PanelTitleToolbarProps = {

};

export const PanelTitleToolbar: FunctionComponent<PanelTitleToolbarProps> = ({ children }) => {
  return <PanelTitleToolbarTeleporter.Source>{children}</PanelTitleToolbarTeleporter.Source>
}
