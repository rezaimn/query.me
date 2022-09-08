import React, { FunctionComponent } from 'react'
import { createTeleporter } from 'react-teleporter'

const PanelSubTitleTeleporter = createTeleporter()

export const PanelSubTitleTarget = () => {
  return <PanelSubTitleTeleporter.Target />
}

type PanelSubTitleProps = {

};

export const PanelSubTitle: FunctionComponent<PanelSubTitleProps> = ({ children }) => {
  return <PanelSubTitleTeleporter.Source>{children}</PanelSubTitleTeleporter.Source>
}
