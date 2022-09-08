import React, { FunctionComponent, ReactNode, useState, useEffect, useMemo, Children, Fragment, MutableRefObject } from 'react';
import { Icon, Colors, Popover, Position, Classes, Menu, MenuItem } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { withResizeDetector } from 'react-resize-detector';

import './Tabs.scss';
import TabHeader from './TabHeader';

type OnSelectTabCallback = (id: string) => void;

type TabsComponentProps = {
  defaultActiveTab?: string;
  showToolbar?: boolean;
  headersBelow?: boolean;
  showHeaders?: boolean;
  stopPropagation?: boolean;
  width?: number;
  message?: string;
  onSelectTab?: OnSelectTabCallback;
};

type TabHeadersRenderProps = {
  children: ReactNode;
  showHeaders: boolean | undefined;
};

const Tabs: FunctionComponent<TabsComponentProps> = ({
  defaultActiveTab, showToolbar,
  headersBelow, showHeaders,
  stopPropagation, width,
  message,
  onSelectTab,
  children
}) => {
  const [activeTab, setActiveTab] = useState('');
  const [collapsedActiveTab, setCollapsedActiveTab] = useState(false);
  const [visibleChildren, setVisibleChildren] = useState<any[]>([]);
  const [collapsedChildren, setCollapsedChildren] = useState<any[]>([]);
  const [visibleItemCount, setVisibleItemCount] = useState(5);

  useEffect(() => {
    if (width) {
      setVisibleItemCount(Math.floor(width / 120) - 1);
    }
  }, [ width ]);

  useEffect(() => {
    if (defaultActiveTab) {
      setActiveTab(defaultActiveTab);
    }
  }, [ defaultActiveTab ]);

  useEffect(() => {
    if (children) {
      const [visibleChildren, collapsedChildren] = partitionChildren();
      setVisibleChildren(visibleChildren);
      setCollapsedChildren(collapsedChildren);
    }
  }, [ children, visibleItemCount ]);

  const partitionChildren = (): [any[], any[]] => {
    const childrenArray = React.Children.map(children, (child: React.ReactNode, index: number) => {
        return React.cloneElement(child as JSX.Element);
    });

    if (childrenArray == null) {
        return [[], []];
    }

    return [childrenArray.slice(0, visibleItemCount), childrenArray.slice(visibleItemCount)];
  }

  const handleSelectTab = (id: string, collapsed?: boolean) => {
    setActiveTab(id);
    setCollapsedActiveTab(collapsed || false);
    onSelectTab && onSelectTab(id);
  };

  if (!activeTab && defaultActiveTab) {
    setActiveTab(defaultActiveTab);
  }

  const collapsedTabsMenuContent = useMemo(() => (
    <Menu className={Classes.ELEVATION_1}>
      {
        collapsedChildren && Children.map(collapsedChildren, (tab: any) => (
          <MenuItem
            text={tab.props.title}
            icon={tab.props.icon}
            labelElement={
              (activeTab && activeTab === tab.props.id)
                && <Icon icon={IconNames.TICK} />
            }
            onClick={() => handleSelectTab(tab.props.id, true)}
          ></MenuItem>
        ))
      }
    </Menu>
  ), [ collapsedChildren ]);


  const renderHeaders = ({
    showHeaders,
    children
  }: TabHeadersRenderProps) => {
    return (
      <div className={`tabs__headers__container ${headersBelow ? 'header-below' : ''} ${!showHeaders ? 'hidden' : ''}`}>
        <div className="tabs__headers">
          { collapsedChildren.length > 0 ? (
            <Popover
              content={collapsedTabsMenuContent}
              position={Position.BOTTOM_RIGHT}
            >
              <Icon
                icon={IconNames.MORE}
                color={collapsedActiveTab ? Colors.BLUE4 : Colors.GRAY3}
                className="tabs__headers__more"
              />
            </Popover>
          ) : (
            <Icon
              icon={IconNames.MORE}
              color={collapsedActiveTab ? Colors.BLUE4 : Colors.GRAY3}
              className="tabs__headers__more"
            />
          )}
          {
            visibleChildren && Children.map(visibleChildren, (tab: any) => (
              <TabHeader
                id={tab.props.id}
                label={tab.props.title}
                icon={tab.props.icon}
                status={tab.props.status}
                active={tab.props.id === activeTab}
                closable={tab.props.closable}
                stopPropagation={stopPropagation}
                onSelectTab={handleSelectTab}
              ></TabHeader>
            ))
          }
        </div>
        <div className="tabs__headers__toolbar">
          { message && (<div className="tabs__headers__toolbar__message">{message}</div>) }
          { showToolbar && (
            <Fragment>
              <Icon icon={IconNames.SQUARE} color={Colors.GRAY3} className="tabs__headers__toolbar__item tabs__headers__toolbar__item--fill" />
              <Icon icon={IconNames.LIST_DETAIL_VIEW} color={Colors.GRAY3} className="tabs__headers__toolbar__item" />
              <Icon icon={IconNames.LIST} color={Colors.GRAY3} className="tabs__headers__toolbar__item" />
            </Fragment>
          ) }
        </div>
      </div>
    );
  }

  return (
    <div className="tabs">
      {!headersBelow && renderHeaders({ children, showHeaders })}
      <div className="tabs__active-tab">
        {
          children && Children.map(children, (tab: any) => {
            if (tab.props.id !== activeTab) return undefined;
            return tab.props.children;
          })
        }
      </div>
      {headersBelow && renderHeaders({ children, showHeaders })}
    </div>
  );
}

export default withResizeDetector(Tabs, {}) as FunctionComponent<TabsComponentProps>;
