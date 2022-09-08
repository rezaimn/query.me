import React, { FunctionComponent, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import { useSetLayout, useLayout } from '../LayoutContext';
import { LeftDrawerTarget } from '../LeftDrawer';
import { LeftMenuTarget } from '../LeftMenu';
import { PanelTitleTarget } from '../PanelTitle';
import { PanelTitleToolbarTarget } from '../PanelTitleToolbar';
import './PanelWithLeftMenu.scss';
import { IState } from '../../../store/reducers';
import { useStorage } from '../../../hooks/use-storage';

type PanelWithLeftMenuProps = {
  displayTitle?: boolean;
  large?: boolean;
};

const InnerPanelWithLeftMenu: FunctionComponent<PanelWithLeftMenuProps> = ({
  displayTitle = true,
  large,
  children
}) => {
  const [ leftMenuClosed, setLeftMenuClosed ] = useState<boolean>(false);
  const [ leftMenuClosedInitialized, setLeftMenuClosedInitialized ] = useState<boolean>(false);
  const backgroundKind = useSelector((state: IState) => state.ui.backgroundKind);
  const isFullScreen = useSelector((state: IState) => state.ui.isFullScreen);
  const [ storageValue, setStorageValue ] = useStorage('leftMenu', {}, true);
  const location = useLocation();

  // avoiding a name clash with setLeftMenuClosed
  const { setLeftMenuClosed: setLeftMenuIsClosed } = useSetLayout();
  const { leftMenuDisplayed } = useLayout();

  useEffect(() => {
    if (storageValue && !leftMenuClosedInitialized) {
      setLeftMenuClosedInitialized(true);
      setLeftMenuClosed(storageValue[location.pathname]);
    }
  }, [ location.pathname, leftMenuClosedInitialized ]);

  useEffect(() => {
    setStorageValue({
      ...storageValue,
      [location.pathname]: leftMenuClosed
    });
  }, [ leftMenuClosed ]);

  useEffect(() => {
    setLeftMenuIsClosed(leftMenuClosed);
  }, [ leftMenuClosed ]);

  const onToggleLeftMenu = () => {
    setLeftMenuClosed(leftMenuClosed => !leftMenuClosed);
  };

  return (
    <div className="page">
      <div>
        <LeftDrawerTarget />
      </div>
      <div
        style={{
          visibility: leftMenuDisplayed ? 'initial' : 'hidden',
        }}
        className={`page__left-menu__open ${leftMenuClosed ? 'closed' : ''} ${isFullScreen ? 'full-screen' : ''}`}>
        <Button data-cy='menuOpenBtn'
          icon={IconNames.MENU_OPEN}
          minimal={true}
          onClick={onToggleLeftMenu}
        />
      </div>
      <aside className={`page__left-menu ${large ? 'large' : ''} ${leftMenuClosed ? 'closed' : ''}`}>
        <div className="page__left-menu__toolbar">
          <Button data-cy='menuCloseBtn'
            icon={IconNames.MENU_CLOSED}
            minimal={true}
            onClick={onToggleLeftMenu}
          />
        </div>

        <LeftMenuTarget />
      </aside>
      <main id="page__content" className={`page__content ${backgroundKind !== 'default' ? backgroundKind : ''} ${large ? 'large' : ''} ${leftMenuClosed ? 'no-left-menu' : ''}`}>
        {
          displayTitle && (
            <div className="page__title">
              <div className="page__title__text"><PanelTitleTarget /></div>
              <div className="page__title__toolbar"><PanelTitleToolbarTarget /></div>
            </div>
          )
        }
        <div>{children}</div>
      </main>
    </div>
  );
};

const PanelWithLeftMenu: FunctionComponent<PanelWithLeftMenuProps> = ({
  displayTitle = true,
  large,
  children
}) => (
    <InnerPanelWithLeftMenu
      displayTitle={displayTitle}
      large={large}
    >
      {children}
    </InnerPanelWithLeftMenu>
);

export default PanelWithLeftMenu;
