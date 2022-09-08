import React, { Fragment, useState, } from 'react';
import { Range } from 'slate';
import { useSlate } from 'slate-react';

import {
  getAbove,
  findNode,
  someNode,
  ToolbarButton,
  ToolbarButtonProps,
  ELEMENT_LINK,
} from '@udecode/plate';
import { Popover, Position } from '@blueprintjs/core';
import LinkPopover from '../../../../../shared/components/link-popover/link-popover';

interface ToolbarLinkState {
  open: boolean,
  selection: Range | null,
  url: string,
}

/**
 * This component is identical with the one from @udecode/plate with the same name.
 * onMouseDown was overwritten.
 *
 * @param link
 * @param props
 * @constructor
 */
export const ToolbarLink = ({
  link,
  ...props
}: ToolbarButtonProps/*  & LinkOptions */) => {
  const [state, setState] = useState<ToolbarLinkState>({
    open: false,
    selection: null,
    url: '',
  });

  const editor = useSlate();
  const isLink = someNode(editor, { match: { type: ELEMENT_LINK } });

  const onMouseDown = (event: any) => {
    let prevUrl = '';

    let linkNode: any = getAbove(editor, {
      match: { type:ELEMENT_LINK },
    });

    if (linkNode) {
      prevUrl = linkNode[0].url as string;
    } else {
      linkNode = findNode(editor, {
        match: { type: ELEMENT_LINK },
      });

      if (linkNode) {
        prevUrl = linkNode[0].url as string;
      }
    }

    setState(prevState => ({
      ...prevState,
      selection: editor.selection,
      open: true,
      url: prevUrl,
    }));
  };

  const dismissPopover = ()=>{
    setState({
      ...state,
      open: false
    })
  }
  return (
    <Fragment>
      <Popover
        content={<LinkPopover
          onDismiss={dismissPopover}
          selection={state.selection}
          url={state.url}
          actionStatus='insert'/>}
        position={Position.TOP_LEFT}
        modifiers={{ arrow: { enabled: false } }}
        disabled={!state.open}
      >
        <ToolbarButton
          active={isLink}
          onMouseDown={onMouseDown}
          {...props}
        />
      </Popover>
    </Fragment>
  );
};
