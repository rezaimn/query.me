import React, { FunctionComponent } from 'react';
import { Button } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Link } from 'react-router-dom';

import './DataLeftMenu.scss';
import LeftMenuItem from '../../shared/components/layout/LeftMenuItem';
import LeftMenuSubHeader from '../../shared/components/layout/LeftMenuSubHeader';

type DataLeftMenuComponentProps = {

};

const DataLeftMenuComponent: FunctionComponent<DataLeftMenuComponentProps> = ({
}: DataLeftMenuComponentProps) => {
  return (
    <div className="data-left-menu">
      <div className="data-left-menu__action">
        <Link to={`d/connect`}>
          <Button
            icon={IconNames.ADD}
            className="data-left-menu__action__button"
            intent="primary"
          >New Connection</Button>
        </Link>
      </div>
      <div className="data-left-menu__domains">
        <LeftMenuItem icon={IconNames.DATABASE} label="Databases" link="/d/d"></LeftMenuItem>
        <LeftMenuItem icon={IconNames.HEAT_GRID} label="Schemas" link="/d/s"></LeftMenuItem>
        <LeftMenuItem icon={IconNames.TH} label="Tables" link="/d/t"></LeftMenuItem>
      </div>
      <div className="data-left-menu__tags">
        <LeftMenuSubHeader label="Browse by tag" />
        <LeftMenuItem icon={IconNames.TAG} label="General"></LeftMenuItem>
        <LeftMenuItem icon={IconNames.TAG} label="Special Tag" active={true}></LeftMenuItem>
        <LeftMenuItem icon={IconNames.TAG} label="Databases"></LeftMenuItem>
        <LeftMenuItem icon={IconNames.TAG} label="Roles & Groups"></LeftMenuItem>
        <LeftMenuItem icon={IconNames.TAG} label="Integrations"></LeftMenuItem>
        <LeftMenuItem icon={IconNames.TAG} label="Usage & Logs"></LeftMenuItem>
        <LeftMenuItem icon={IconNames.TAG} label="Billing"></LeftMenuItem>
      </div>
    </div>
  )
};

export default DataLeftMenuComponent;
