import React, { FunctionComponent } from "react";
import { NavLink } from 'react-router-dom';
import { Button, Classes } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import './Header.scss';
import Logo from "./logo_light.svg";

interface IDummyHeaderProps {
}

const DummyHeader: FunctionComponent<IDummyHeaderProps> = ({}: IDummyHeaderProps) => {
  const className = `navigation-item bp3-large small ${Classes.MINIMAL}`;

  return (
    <header className="header">
      <NavLink to="/app" className="header__logo">
        <img src={Logo} alt="Query.me" className="header__logo__image" />
      </NavLink>
      <div className={"header__navigation no-margin " + Classes.SKELETON}>
        <div className="header__navigation__main">

          <Button className={className} text="Data" icon={IconNames.DATABASE} />
          <Button className={className} text="Notebooks" icon={IconNames.MANUAL} />
          <Button className={className} text="Search" icon={IconNames.SEARCH} />
        </div>
        <div className="header__navigation__secondary">
          <Button className={className} text="" icon={IconNames.COG} />
          <Button className={className} text="" icon={IconNames.HELP} />
          <Button className={className} text="" icon={IconNames.USER} />
        </div>
      </div>
    </header>
  );
};

export default DummyHeader;
