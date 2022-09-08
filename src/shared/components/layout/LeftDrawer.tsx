import React, { FunctionComponent } from 'react'
import { createTeleporter } from 'react-teleporter'

const LeftDrawerTeleporter = createTeleporter()

export const LeftDrawerTarget = () => {
  return <LeftDrawerTeleporter.Target />
}

type LeftDrawerProps = {

};

export const LeftDrawer: FunctionComponent<LeftDrawerProps> = ({ children }) => {
  return <LeftDrawerTeleporter.Source>{children}</LeftDrawerTeleporter.Source>
}
