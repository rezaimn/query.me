import React, { FunctionComponent } from 'react'
import { createTeleporter } from 'react-teleporter'

const LeftMenuTeleporter = createTeleporter()

export const LeftMenuTarget = () => {
  return <LeftMenuTeleporter.Target />
}

type LeftMenuProps = {

};

export const LeftMenu: FunctionComponent<LeftMenuProps> = ({ children }) => {
  return <LeftMenuTeleporter.Source>{children}</LeftMenuTeleporter.Source>
}
