import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, ControlGroup, Icon, Intent, Position, Toaster } from '@blueprintjs/core';
import './link-popover.scss';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { removeLink } from '../../../features/notebooks/editor/utils';
import { useEditor, useSlate } from 'slate-react';
import {
  SPEditor,
  DEFAULTS_LINK,
  findNode,
  isCollapsed,
  // setDefaults,
  unwrapNodes,
  upsertLinkAtSelection,
} from '@udecode/plate';
import { Editor, Range } from 'slate';

const copiedToaster = Toaster.create({
  className: 'recipe-toaster',
  position: Position.TOP_LEFT,
});
type onDismissCallback = () => void;

interface ToolbarLinkState {
  open: boolean,
  path: any,
  url: string,
}

interface LinkPopoverProps {
  url?: string;
  onDismiss: onDismissCallback;
  actionStatus: 'edit' | 'insert';
  selection?: any;
}

const LinkPopover: FunctionComponent<LinkPopoverProps> = ({ url, actionStatus, selection, onDismiss }) => {
  const editor = useEditor();
  const duplicateClickHandler = useCallback((event: any) => {
    copiedToaster.show({
      message: 'Link has been copied to clipboard!',
      intent: Intent.SUCCESS,
    });
  }, []);

  const slate = useSlate();
  const [state, setState] = useState<ToolbarLinkState>({
    open: false,
    path: null,
    url: url || '',
  });
  const [addEditMode, setAddEditMode] = useState<boolean>(actionStatus === 'insert' ? true : false);
  let link: any = { type: 'a' };

  const setUrl = (url: string) => setState(prevState => ({ ...prevState, url }));

  const options = DEFAULTS_LINK;

  useEffect(() => {
    if (actionStatus === 'insert') {
      setTimeout(() => {
        const linkInput = document.getElementById('link-input');
        if (linkInput) {
          linkInput.focus();
        }
      }, 100);
    }
    if (actionStatus === 'edit') {
      setState({
        ...state,
        url: url || '',
        path: slate.selection?.anchor.path,
      });
    }
  }, [url]);

  const onKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      insertAndEditLinkAddress();
    }
  }

  const insertAndEditLinkAddress = () => {

    const url = state.url;
    /*
     * onClose the editor loses it's selection object so we have to set it back in order to get the right node.
     */
    let path: any;

    if (actionStatus === 'edit') {
      path = state.path;
      slate.selection = Editor.range(slate, path);

    } else {
      slate.selection = selection;
      path = slate.selection?.anchor.path;
    }

    unwrapNodes(slate, {
      at: slate.selection || undefined,
      match: { type: 'a' },
    });

    if (!url) {
      /*
       * remove URL
       */
      setState(prevState => ({
        ...prevState,
        open: false,
        path: null,
        url: '',
      }));

      return;
    }

    // If our cursor is in middle of a link, then we don't want to inser it inline
    const shouldWrap: boolean =
      url !== undefined && isCollapsed(selection);

    upsertLinkAtSelection(slate as SPEditor, { url, wrap: shouldWrap, ...options });

    setState(prevState => ({
      ...prevState,
      open: false,
      path: null,
      url: '',
    }));
    onDismiss();
  };


  return (
    <>
      {
        !addEditMode &&
        <ControlGroup fill={true} vertical={false}>
          {/*<a href={state.url} target='_blank'>*/}
          {/*  */}
          {/*</a>*/}
          <a className='link-address' id='link-input' href={state.url} target='_blank'>
            <Icon icon="link" className='link-icon'/>
            <span className='link-text'>{state.url}</span>
          </a>
          <CopyToClipboard text={state.url} onCopy={duplicateClickHandler}>
            <Button icon="duplicate" className='bp3-button bp3-minimal bp3-large' />
          </CopyToClipboard>
          <Button icon="edit" className='bp3-button bp3-minimal bp3-large' onClick={() => {
            setAddEditMode(true);
          }}/>
          <Button icon="delete" className='bp3-button bp3-minimal bp3-large' onClick={() => removeLink(editor)}/>
        </ControlGroup>
      }
      {
        addEditMode &&
        <ControlGroup fill={true} vertical={false}>
          <Icon icon="link" className='link-icon' style={{paddingRight:'2px'}}/>
          <input id='link-input'
                 onChange={(e) => setUrl(e.target.value)}
                 onKeyPress={(e) => onKeyPress(e)}
                 type="text"
                 value={state.url}
                 className="bp3-input link-input bp3-large"
                 placeholder="Enter the link address..."/>
          <Button icon="tick" className='bp3-button bp3-minimal bp3-large' onClick={insertAndEditLinkAddress}/>
        </ControlGroup>
      }
    </>
  );
};

export default LinkPopover;
