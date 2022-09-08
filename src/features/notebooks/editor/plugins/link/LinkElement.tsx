import * as React from 'react';
import { StyledElementProps } from '@udecode/plate-styled-components';
import { getLinkElementStyles, LinkNodeData } from '@udecode/plate';
import { Popover, Position } from '@blueprintjs/core';
import LinkPopover from '../../../../../shared/components/link-popover/link-popover';
import { useEffect, useState } from 'react';
import './LinkElement.scss';

/**
 * LinkElement with no default styles.
 * [Use the `styles` API to add your own styles.](https://github.com/OfficeDev/office-ui-fabric-react/wiki/Component-Styling)
 */
export const LinkElement = (props:  StyledElementProps<LinkNodeData>) => {
  const {
    attributes,
    children,
    nodeProps,
    styles: _styles,
    element,
    classNames,
    prefixClassNames,
    ...rootProps
  } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { root } = getLinkElementStyles(props);

  useEffect(()=>{
     // if(element.url){
     //   setIsOpen(true);
     // }
  },[element.url]);

  const dismissPopover = ()=>{
    setIsOpen(false);
  }

  return (
    <>
      <a
        {...attributes}
        href={element.url}
        className={root.className}
        {...rootProps}
        {...nodeProps}
        onClick={()=>setIsOpen(true)}
      >
        {children}
      </a>
      {
        isOpen &&
        <Popover
          popoverClassName="edit-link-popover"
          content={<LinkPopover onDismiss={dismissPopover} url={element.url} actionStatus='edit'/>}
          onInteraction={()=>{setIsOpen(false)}}
          position={Position.BOTTOM}
          modifiers={{ arrow: { enabled: false } }}
          disabled={!isOpen}
          isOpen={isOpen}
        >
          <span hidden={true}/>
        </Popover>
      }

    </>
  );
};
