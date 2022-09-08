import React, { FunctionComponent } from 'react';
import { Tag } from '@blueprintjs/core';

import './UnderlinedTabHeader.scss';

type OnSelectTabCallback = (id: string) => void;

type UnderlinedTabHeaderComponentProps = {
  id: string;
  label: string;
  tag?: string;
  active?: boolean;
  width?: string;
  tabSelectorHeight?: string;
  tabsMargin?: string;
  onSelectTab: OnSelectTabCallback;
};

const UnderlinedTabHeader: FunctionComponent<UnderlinedTabHeaderComponentProps> = ({
  id, label, tag, active, width, tabSelectorHeight, tabsMargin, onSelectTab
}) => {
  const handleSelectTab = () => {
    onSelectTab && onSelectTab(id);
  }
  return (
    <div
      className={`underlined-tab-header ${active ? 'active' : ''}`}
      style={{
        width: width,
        borderBottomWidth: tabSelectorHeight || '1px',
        margin: tabsMargin || '0 20px'
      }}
      onClick={handleSelectTab}
    >
      {label}
      {
        tag && (
          <Tag
            round={true}
            className="underlined-tab-header__tag"
          >{tag}</Tag>
        )
      }
    </div>
  );
}

export default UnderlinedTabHeader;
