import React, { FunctionComponent } from 'react';
import { Drawer, IconName, IBreadcrumbProps, Position } from '@blueprintjs/core';

import './DrawerContainer.scss';
import { DetailsHeader } from '../DetailsHeader';
import { PseudoDrawer } from './PseudoDrawer';

type OnCloseCallback = () => void;
type OnActionCallback = () => void;

type DrawerContainerProps = {
  isOpen: boolean;
  icon?: any;
  iconBackgroundColor?: string;
  noIconBackground?: boolean;
  label: string;
  image?: any;
  position?: Position;
  breadcrumb?: IBreadcrumbProps[] | null;
  detailsLink?: string | null;
  actionElement?: any;
  actionIcon?: IconName;
  actionLabel?: string;
  menuContent?: any;
  mode?: string;
  tags?: string[];
  extendedPanel?: any;
  width?: string;
  headerClassName?: string;
  pseudoDrawer?: boolean;
  canOutsideClickClose?: boolean;
  closeIcon?: IconName;
  closeIconSize?: number;
  onClose: OnCloseCallback;
  onAction?: OnActionCallback;
  children: any;
};

function createDrawer(pseudoDrawer?: boolean) {
  return pseudoDrawer ? PseudoDrawer : Drawer;
}

export const DrawerContainer: FunctionComponent<DrawerContainerProps> = ({
  isOpen, icon, iconBackgroundColor, noIconBackground, label, image, breadcrumb, detailsLink,
  actionElement, actionIcon, actionLabel, onClose, onAction, position = Position.RIGHT,
  mode = 'simple', tags, extendedPanel, menuContent, width = '598px !important', pseudoDrawer,
  canOutsideClickClose = true, headerClassName, closeIcon, closeIconSize,
  children
}: DrawerContainerProps) => {
  const DrawerElement = createDrawer(pseudoDrawer);
  
  return (
    <DrawerElement
      isOpen={isOpen}
      hasBackdrop={false}
      canOutsideClickClose={canOutsideClickClose}
      canEscapeKeyClose={true}
      className="drawer-container"
      position={position}
      usePortal={true}
      enforceFocus={true}
      style={{width: width}}
      onClose={onClose}
    >
      <DetailsHeader
        label={label}
        image={image}
        breadcrumb={breadcrumb}
        detailsLink={detailsLink}
        icon={icon}
        iconBackgroundColor={iconBackgroundColor}
        noIconBackground={noIconBackground}
        actionElement={actionElement}
        actionLabel={actionLabel}
        actionIcon={actionIcon}
        mode={mode}
        tags={tags}
        headerClassName={headerClassName}
        extendedPanel={extendedPanel}
        menuContent={menuContent}
        onClose={onClose}
        onAction={onAction}
        fromDrawer={true}
        width={width}
        closeIcon={closeIcon}
        closeIconSize={closeIconSize}
      ></DetailsHeader>
      <div style={{width: width, height: '100%'}}>{children}</div>
    </DrawerElement>
  );
};
