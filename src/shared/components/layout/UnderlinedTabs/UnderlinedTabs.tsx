import React, { FunctionComponent, ReactNode, Ref, forwardRef, useImperativeHandle, useState, Children } from 'react';

import './UnderlinedTabs.scss';
import UnderlinedTabHeader from './UnderlinedTabHeader';

type UnderlinedTabsComponentProps = {
  noTopBorder?: boolean;
  tabSelectorHeight?: string;
  tabsMargin?: string;
  defaultActiveTab?: string;
  children?: ReactNode;
  ref?: Ref<any>;
};

export const UnderlinedTabs: FunctionComponent<UnderlinedTabsComponentProps> = forwardRef(({
  noTopBorder, defaultActiveTab, tabSelectorHeight, tabsMargin, children
}: UnderlinedTabsComponentProps, ref) => {
  const [activeTab, setActiveTab] = useState('');
  const onSelectTab = (id: string) => {
    setActiveTab(id);
  };

  if (!activeTab && defaultActiveTab) {
    setActiveTab(defaultActiveTab);
  }

  useImperativeHandle(ref, () => ({
    selectTab(tabId: string) {
      onSelectTab(tabId);
    }
  }));

  return (
    <div className="underlined-tabs">
      <div className={`underlined-tabs__headers ${noTopBorder ? 'no-top-border' : ''}`}>
        {
          children && Children.map(children, (tab: any) => (
            <UnderlinedTabHeader
              id={tab.props.id}
              label={tab.props.title}
              tag={tab.props.tag}
              width={tab.props.width}
              tabSelectorHeight={tabSelectorHeight}
              tabsMargin={tabsMargin}
              active={tab.props.id === activeTab}
              onSelectTab={onSelectTab}
            ></UnderlinedTabHeader>
          ))
        }
      </div>
      <div className="underlined-tabs__active-tab">
        {
          children && Children.map(children, (tab: any) => {
            if (tab.props.id !== activeTab) return undefined;
            return tab.props.children;
          })
        }
      </div>
    </div>
  );
});
