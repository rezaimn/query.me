import React, {
  Fragment,
  Children,
  useRef,
  useState,
  useEffect,
  cloneElement,
  useMemo,
  useCallback
} from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import useMergedRef from '@react-hook/merged-ref';
import Tippy from '@tippyjs/react';
import { Editor } from 'slate';
import { useEditor, useSelected } from 'slate-react';
import { mergeStyles } from '@uifabric/styling';
import { classNamesFunction, styled } from '@uifabric/utilities';
import { useParams } from 'react-router-dom';
import {
  Button,
  Icon,
  Menu,
  MenuItem,
  Popover,
  Tooltip,
  MenuDivider,
  Position,
  Classes,
  Colors,
  Intent,
  Spinner,
  Toaster
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { useStorage } from '../../../../../shared/hooks/use-storage';
import { useDndBlock } from '../hooks/useDndBlock';
import { grabberTooltipProps } from './grabberTooltipProps';
import { getSelectableStyles } from './Selectable.styles';
import {
  SelectableProps,
  SelectableStyleProps,
  SelectableStyles,
} from './Selectable.types';
import AddImage from './AddImage';
import AddMediaEmbed from './AddMediaEmbed';
import { useNotebookEditable } from "../../../hooks/use-editable";
import { useChangeNotebookCurrentBlock } from '../../../NotebookNavigationContext';

import './Selectable.scss';

import CommentModalWrapperContainer from '../../comments/CommentModalWrapperContainer';
import { scroller } from 'react-scroll';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '../../../../../shared/store/reducers';
import { convertYoutubeUrlToEmbed } from '../utils/convertYoutubeUrlToEmbed';
import { blockTypes, IBlockTypesModel } from './constants';
import { Select } from '@blueprintjs/select';
import { isIOS, isMacOs } from 'react-device-detect';

const getClassNames = classNamesFunction<
  SelectableStyleProps,
  SelectableStyles
>();

export const copiedToaster = Toaster.create({
  className: 'recipe-toaster',
  position: Position.TOP
});

export const SELECT_ACTIONS = {
  ADD_BLOCK: 'add-block',
  REMOVE_BLOCK: 'remove-block',
  TURN_INTO_BLOCK: 'turn-into-block',
  DUPLICATE_BLOCK: 'duplicate-block',
};

const SelectableBase = ({
  children,
  element,
  type,
  className,
  styles,
  componentRef,
  dragIcon,
  path,
  onCommand,
  createNewPageAndAddCurrentBlockToIt,
  moveCurrentBlockToSelectedPage
}: SelectableProps) => {
  const elementUid = (element as any)?.uid as string;
  const elementType = (element as any)?.type as string;
  const notebook = useSelector((state: IState) => state.notebooks.notebook);
  const blockRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<any>();
  const multiRootRef = useMergedRef(componentRef, rootRef);
  const [ contextMenuOpened, setContextMenuOpened ] = useState(false);
  const [ hovered, setHovered ] = useState(false);
  const [ blockTypesList, setBlockTypesList ] = useState<IBlockTypesModel[]>(blockTypes);
  const [ newStatus, setNewStatus ] = useState<string>('');
  const [ commentPopoverIsOpen, setCommentPopoverIsOpen ] = useState<boolean>(false);
  const [ newCommentThread, setNewCommentThread ] = useState<boolean>(false);
  const [ showAddImagePopup, setShowAddImagePopup ] = useState<boolean>(false);
  const [ showAddMediaEmbedPopup, setShowAddMediaEmbedPopup ] = useState<boolean>(false);
  const [ showAddBlocks, setShowAddBlocks ] = useState(false);
  const [selectedBlockType, setSelectedBlockType] = useState<IBlockTypesModel | null>(blockTypes[0]);
  const editable = useNotebookEditable();
  const params = useParams<Record<string, string | undefined>>()
  const dispatch = useDispatch();
  const editor: any = useEditor();
  const blockParamUid = useMemo(() => {
    return params?.blockId || null;
  }, [ params ])

  const isFullScreen = useMemo(() => {
    return !!blockParamUid
  }, [ blockParamUid ])

  const selected = useSelected();
  const isEmpty = useMemo(() =>
    element &&
    element.children &&
    (element.children[0] as any).text === '' &&
    element.children.length === 1,
    [ element, element.children ]
  );

  const changeNotebookCurrentBlock = useChangeNotebookCurrentBlock();

  const [ storageValue, setStorageValue ] = useStorage('leftMenu', {}, true);

  const isElementVisible = useCallback((element: any) =>{
    if (!element) {
      return false;
    }

    const tolerance = 0.01;
    let percentX = 100;
    let percentY = 100;

    const elementRect = element.getBoundingClientRect();
    const parentRects = [];

    while(element && element.parentElement){
      parentRects.push(element.parentElement.getBoundingClientRect());
      if (element.parentElement.id === 'page__content') {
        element = { ...element, parentElement: null };
      } else {
        element = element.parentElement;
      }
    }

      const visibleInAllParents = parentRects.every((parentRect) => {
      const visiblePixelX = Math.min(elementRect.right, parentRect.right) - Math.max(elementRect.left, parentRect.left);
      const visiblePixelY = Math.min(elementRect.bottom, parentRect.bottom) - Math.max(elementRect.top, parentRect.top);
      const visiblePercentageX = visiblePixelX / elementRect.width * 100;
      const visiblePercentageY = visiblePixelY / elementRect.height * 100;
      return visiblePercentageX + tolerance > percentX && visiblePercentageY + tolerance > percentY;
    });
    return visibleInAllParents;
  }, []);

  useEffect(() => {
    if (selected) {
      const {
        block_id, database_id,
        id, name, newBlock,
        type, uid
      } = (element as any);
      changeNotebookCurrentBlock({
        block_id, database_id,
        id, name, newBlock,
        type, uid
      });
      if(element.id && !elementUid){
        const domElement = document.getElementById(element.id);
        const elementVisible = isElementVisible(domElement);
        try {
          if (!elementVisible) {
            scroller.scrollTo(element.id, {
              duration: 0,
              delay: 0,
              smooth: 'easeInOutQuart',
              containerId: 'page__content'
            });
          }
        } catch (err) {
          // Silent fail
        }
      }

    }
  }, [ selected ]);

  const { dropLine, dragRef, isDragging } = useDndBlock({
    id: element.id,
    blockRef: rootRef,
  });

  const dragWrapperRef = useRef(null);
  const multiDragRef = useMergedRef(dragRef, dragWrapperRef);

  const status = useMemo(() => {
    if (newStatus) {
      return newStatus;
    }
    const results = (element as any).results as any[];
    if (results && results.length > 0) {
      return results[0].status;
    }
    return 'unknown';
  }, [ element, (element as any).results, newStatus ]);

  const isInLayout = useMemo(() => {
    const parent: any = Editor.parent(editor, path);
    return (parent[0].type === 'layout_item')
  }, [ path ])

  const rightGutterMarginTop = useMemo(() => {
    if (elementType === 'sql') {
      return '20px';
    }
    /* if (elementType === 'parameter') {
      return '3px';
    } */
    return 'none';
  }, [ elementType ]);

  const classNames = getClassNames(styles, {
    className,
    direction: dropLine,
    isDragging,
  });

  const onDuplicateBlock = () => {
    onCommand(editor, path, SELECT_ACTIONS.DUPLICATE_BLOCK, { type, node: element });
  };

  const onAddBlock = useCallback((type?: string) => {
    setShowAddBlocks(false);
    onCommand(editor, path, 'add-block', { type, node: element });
  }, [ path, element ]);

  const onAddImage = useCallback((url?: string) => {
    setShowAddBlocks(false);
    setShowAddImagePopup(false);
    if (url) {
      onCommand(editor, path, 'add-block', { type: 'img', node: element, url });
    }
  }, [ path, element ]);

  const onAddMediaEmbed = useCallback((mediaEmbed?: any) => {
    setShowAddBlocks(false);
    setShowAddMediaEmbedPopup(false);
    if (mediaEmbed.url) {
      mediaEmbed.url=convertYoutubeUrlToEmbed(mediaEmbed.url);
      onCommand(editor, path, 'add-block', { type: 'media_embed', node: element, mediaEmbed });
    }
  }, [ path, element ]);

  const onRemoveBlock = () => {
    onCommand(editor, path, SELECT_ACTIONS.REMOVE_BLOCK, { node: element });
  };

  const onTurnIntoBlock = (type?: string) => {
    onCommand(editor, path, SELECT_ACTIONS.TURN_INTO_BLOCK, { type, node: element });
  };
  const fullScreenBlockLink:string = useMemo(() => `${window.location.origin}/n/${params.notebookId}/${params.pageId}/${elementUid}`, [ params, elementUid ]);

  const directBlockLink:string = useMemo(() => `${window.location.origin}/n/${params.notebookId}/${params.pageId}?blockUid=${elementUid}`, [ params, elementUid ]);

  const onAddComment = (type?: string) => {
    setCommentPopoverIsOpen(true);
    setNewCommentThread(true);
  };

  const onFormatBlock = () => {
    if (elementRef) {
      const current: any = elementRef.current;
      current?.formatBlock();
    }
  };
  const getSelectedBlock = (): any => {
    const currentPage = getCurrentPage();
    return currentPage?.blocks[currentPage?.blocks.findIndex((block: any) => block.uid === elementUid)];
  };

  const onCopied = () => {
    copiedToaster.show({
      message: "Shareable block URL copied to clipboard.",
      intent: Intent.SUCCESS
    });
  };

  const onSearchTextChange = (text: any) => {
    setBlockTypesList(blockTypes.filter((blockType:any) => blockType?.text.toLowerCase().includes(text.toLowerCase())));
  };

  const hotKey = (text: string) => (text.length > 0 ? <code className="bp3-code hot-key-small">{text}</code> : <></>);

  const getCurrentPage = (): any => {
    return notebook ? notebook?.pages[notebook?.pages.findIndex(page => page.uid === params.pageId)] : null;
  };

  const onBlockTypeSelect = (blockType: IBlockTypesModel) => {
    switch (blockType.text) {
      case 'Image':
        setShowAddImagePopup(!showAddImagePopup);
        break;
      case 'Embedded media':
        setShowAddMediaEmbedPopup(!showAddMediaEmbedPopup);
        break;
      default:
        onAddBlock(blockType.onClickText);
    }
  };
  const getSpatialMenuItem =(blockType: any, modifiers: any) => {
    switch (blockType.text) {
      case 'Image':
        return <MenuItem
          icon={blockType.icon}
          text={blockType.text}
          active={modifiers.active}
          aria-label="Image"
          onClick={() => setShowAddImagePopup(!showAddImagePopup)}/>
      case 'Embedded media':
        return <MenuItem
          icon={blockType.icon}
          text={blockType.text}
          active={modifiers.active}
          aria-label="Embedded media"
          onClick={() => setShowAddMediaEmbedPopup(!showAddMediaEmbedPopup)}/>
      default:
        return <MenuItem
          text=""
          aria-label=""
          onClick={() => {}}/>
    }
  }
  const generateMenuItem = (blockType: any, { modifiers, handleClick }: any) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return blockType.type === 'menu-item' ? <MenuItem
        icon={blockType.icon}
        text={blockType.text}
        aria-label={blockType.aria}
        active={modifiers.active}
        labelElement={hotKey(blockType.labelElementText)}
        onClick={() => onAddBlock(blockType.onClickText)}
      /> :
      blockType.type === 'spatial-menu-item'
        ? getSpatialMenuItem(blockType, modifiers)
        : <MenuDivider/>;
  };

  const fullScreenChangeMenu = useMemo(() => (
    <Menu className={Classes.ELEVATION_1}>
      <MenuItem
        icon={IconNames.COMMENT}
        text="Comment"
        aria-label="Comment"
        onClick={() => onAddComment()}
      ></MenuItem>
      <CopyToClipboard
        text={fullScreenBlockLink}
        onCopy={() => onCopied()}
      >
        <MenuItem
          icon={IconNames.LINK}
          text="Copy Link"
          aria-label="Link"
        >
        </MenuItem>
      </CopyToClipboard>
    </Menu>
  ),[ element ])

  const NormalModeChangeMenu = () => {
    return <div data-cy='draggableMenu'>
      <Menu className={Classes.ELEVATION_1}>
        <MenuItem
          icon={IconNames.DUPLICATE}
          text="Duplicate"
          aria-label="Duplicate"
          onClick={() => onDuplicateBlock()}
        />
        <CopyToClipboard
          text={directBlockLink}
          onCopy={() => onCopied()}
        >
          <MenuItem
            icon={IconNames.LINK}
            text="Copy Link"
            aria-label="Link"
          ></MenuItem>
        </CopyToClipboard>
        <MenuItem
          icon={IconNames.EXCHANGE}
          text="Turn into"
          aria-label="Turn into"
          data-cy='turnIntoButton'
          popoverProps={{ openOnTargetFocus: false }}
        >
          <MenuItem
            icon={IconNames.CODE}
            text="SQL"
            aria-label="SQL"
            onClick={() => onTurnIntoBlock('sql')}
          ></MenuItem>
          <MenuDivider/>
          <MenuItem
            icon={IconNames.FONT}
            text="Text"
            aria-label="Text"
            onClick={() => onTurnIntoBlock('p')}
          ></MenuItem>
          <MenuItem
            icon={IconNames.HEADER_ONE}
            text="Header 1"
            aria-label="Header 1"
            onClick={() => onTurnIntoBlock('h1')}
          ></MenuItem>
          <MenuItem
            icon={IconNames.HEADER_TWO}
            text="Header 2"
            aria-label="Header 2"
            data-cy='header2Button'
            onClick={() => onTurnIntoBlock('h2')}
          ></MenuItem>
          {
            (type !== 'sql' && type !== 'plotly' && type !== 'parameter') && (
              <Fragment>
                <MenuItem
                  icon={IconNames.LIST}
                  text="List"
                  aria-label="List"
                  data-cy='listButton'
                  onClick={() => onTurnIntoBlock('ul')}
                ></MenuItem>
                <MenuItem
                  icon={IconNames.NUMBERED_LIST}
                  text="Ordered List"
                  aria-label="Ordered List"
                  data-cy='orderedListButton'
                  onClick={() => onTurnIntoBlock('ol')}
                ></MenuItem>
              </Fragment>
            )
          }
          <MenuDivider/>
          <MenuItem
            icon={IconNames.CITATION}
            text="Blockquote"
            aria-label="Blockquote"
            data-cy='blockquoteButton'
            onClick={() => onTurnIntoBlock('blockquote')}
          ></MenuItem>
          <MenuItem
            icon={IconNames.CODE}
            text="Code block"
            aria-label="Code block"
            data-cy='codeBlockButton'
            onClick={() => onTurnIntoBlock('code_block')}
          ></MenuItem>

        </MenuItem>
        <MenuItem
          icon={IconNames.DOCUMENT_OPEN}
          text="Move to"
          aria-label="Move to"
          data-cy='moveToButton'
          popoverProps={{ openOnTargetFocus: false }}
        >
          <MenuItem
            icon={IconNames.ADD}
            text="New page"
            aria-label="New page"
            onClick={() => createNewPageAndAddCurrentBlockToIt(notebook, getSelectedBlock(),getCurrentPage())}
          ></MenuItem>
          <MenuDivider/>
          {
            notebook?.pages && notebook?.pages.map((page, index: number) => {
              return <MenuItem key={'page-' + index}
                               icon={IconNames.DOCUMENT}
                               text={page.name}
                               aria-label={page.name}
                               onClick={() => {
                                 moveCurrentBlockToSelectedPage(getCurrentPage(), page, getSelectedBlock());
                               }}
              ></MenuItem>;
            })
          }
        </MenuItem>
        <MenuDivider/>
        {
          (element as any).type === 'sql' && (
            <Fragment>
              <MenuItem
                icon={IconNames.ALIGN_RIGHT}
                text="Format"
                aria-label="Format"
                onClick={() => onFormatBlock()}/>
              <MenuDivider/>
            </Fragment>
          )
        }
        <MenuItem
          icon={IconNames.COMMENT}
          text="Comment"
          aria-label="Comment"
          onClick={() => onAddComment()}
        ></MenuItem>
        <MenuItem
          icon={IconNames.TRASH}
          intent={Intent.DANGER}
          text="Delete"
          aria-label="Delete"
          onClick={() => onRemoveBlock()}/>
      </Menu>
    </div>
  };

  const onContextMenuOpenChange = (opened: boolean) => {
    setContextMenuOpened(opened);
  };

  const handleHover = (newHovered: boolean) => {
    if (hovered !== newHovered) {
      setTimeout(() => setHovered(newHovered));
    }
  };

  const handleStatusChange = useCallback((status: string) => {
    if (newStatus !== status) {
      setNewStatus(status);
    }
  }, [ newStatus ]);

  const getContextMenuMarginTop = useCallback((type: string) => {
    switch(type) {
      case 'sql':
        return '20px';
      case 'h1':
        return '10px'
      case 'h2':
        return '7px'
      default:
        return '';
    }
  }, []);

  const contextMenuMarginTop = useMemo(() => getContextMenuMarginTop(type), [type])

  const getBorder = useCallback((selected: boolean, status: string) => {
    if (selected) {
      if (status === 'failed') {
        return `solid 1px ${Colors.RED4}`;
      }

      if (status === 'running') {
        return `solid 1px ${Colors.GREEN4}`;
      }

      return 'solid 1px #48aff0';
    }

    return 'solid 1px transparent';
  }, []);

  /*
    The popover for Comment modal is controlled.
    because we need to be able to open it from the left
    context menu. Because its controlled, all the default
    open and closing functionality gets disabled, unless you
    pass the onInteraction callback and handle the state.
  */
  const handlePopoverInteraction = (shouldOpen:boolean) :void => {
    if(!shouldOpen) {
      // newCommentThread should only be true when opened via the left context menu...
      setNewCommentThread(false);
    }
    setCommentPopoverIsOpen(shouldOpen);
  }

  return (
    <div
      className={`${classNames.root} ${isFullScreen ? 'full-screen' : ''} ${!isDragging && (selected || hovered) ? 'selected' : ''}`}
      ref={multiRootRef}
      id={element.id}
      style={{
        borderLeft: getBorder(!isDragging && (selected || hovered), status as string),
        paddingLeft: isFullScreen  ? undefined : isInLayout ? '60px' : '100px',
        paddingRight:  isFullScreen  ? undefined : isInLayout ? undefined : '200px',
        position: 'relative',
        transform: 'translate3d(0, 0, 0)'
      }}
      data-cy='selectable'
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      {
        !isFullScreen &&
        type === 'sql' &&
        !isDragging && (selected || hovered) &&
        (status === 'failed' || status === 'running') && (
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              backgroundColor: status === 'failed' ? Colors.RED4 : Colors.GREEN4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '0 4px 4px 0',
              padding: '10px'
            }}
          >
            {
              status === 'failed' && (
                <Icon
                  icon={IconNames.ERROR}
                  style={{
                    color: '#fff'
                  }}
                />
              )
            }
            {
              status === 'running' && (
                <Spinner
                  intent={Intent.NONE}
                  size={18}
                />
              )
            }
          </div>
        )
      }
      <div
        className={mergeStyles(
          classNames.blockAndGutter,
          classNames.gutterLeft
        )}
        style={{
          top: isFullScreen ? '-2px' : '0',
          left: isFullScreen ? '30px' : isInLayout ? '40px' : '80px',
          opacity: isFullScreen || contextMenuOpened ? '1' : '',
          marginTop: isFullScreen ? '0px' : contextMenuMarginTop,
          userSelect: 'none'
        }}
        data-cy='selectableGutterLeft'
        contentEditable={false}
      >
        <div className={classNames.blockToolbarWrapper}>
          <div className={isFullScreen ? mergeStyles(classNames.blockToolbar, classNames.blockToolbarFullScreen) : classNames.blockToolbar} style={{display: 'flex'}}>
            { /* <Tippy {...grabberTooltipProps}>
              <div ref={multiDragRef}>
                <button
                  type="button"
                  className={classNames.dragButton}
                  onMouseDown={(e: any) => e.stopPropagation()}
                  onClick={() => console.log('click')}
                >
                  {dragIcon}
                </button>
              </div>
            </Tippy> */}
            <div className={editable && !isFullScreen ? 'plus-selector' : ''} data-cy='plusSelector'>
              {editable && !isFullScreen && (
                <Select
                  items={blockTypesList}
                  onQueryChange={onSearchTextChange}
                  itemRenderer={generateMenuItem}
                  noResults={<MenuItem disabled={true} text="No results."/>}
                  onItemSelect={onBlockTypeSelect}
                  onActiveItemChange={setSelectedBlockType}
                  activeItem={selectedBlockType}
                  resetOnClose={true}
                >
                  <Tooltip
                    hoverOpenDelay={1000}
                    content={<><b>Click</b> to add a block below ({isIOS || isMacOs ? '⌘':'Ctrl'} + Dot)</>} position={Position.BOTTOM}>
                    <Button id={'action_' + elementUid} className='bp3-button bp3-minimal' icon={IconNames.PLUS}
                            data-cy='createButton'/>
                  </Tooltip>
                </Select>
              )}
              <AddImage onCancel={() => setShowAddImagePopup(false)} onAddImage={onAddImage} show={showAddImagePopup}/>
              <AddMediaEmbed onAddMediaEmbed={onAddMediaEmbed} show={showAddMediaEmbedPopup}/>
            </div>
            <div className={editable && !isFullScreen ? 'drag-selector' : ''} data-cy='dragSelector' ref={multiDragRef}>
              {
                editable &&
                (
                  <Popover
                    content={isFullScreen ? fullScreenChangeMenu : <NormalModeChangeMenu/>}
                    position={Position.BOTTOM_RIGHT}
                    onOpened={() => {
                      onContextMenuOpenChange(true);
                      setShowAddBlocks(false);
                    }}
                    onClosed={() => onContextMenuOpenChange(false)}
                    >
                      <Tooltip
                        disabled={isDragging}
                        hoverOpenDelay={1000}
                        content={<>{!isFullScreen && (<><b>Drag</b> to move<br /></>)}<b>Click</b> to open menu</>}
                        position={Position.BOTTOM}
                      >
                        <Button
                          icon={IconNames.DRAG_HANDLE_VERTICAL} data-cy='dragHandler' className='bp3-button bp3-minimal' />
                      </Tooltip>
                  </Popover>
                )
              }
            </div>
          </div>
        </div>
      </div>
      <div style={{display:'flex', width: '100%'}}>
        <div
          ref={blockRef}
          style={{width: '100%', position: 'relative'}}
          className={`${mergeStyles(classNames.blockAndGutter, classNames.block, classNames.blockSectionFullScreen)} ${selected && isEmpty ? 'selected-empty-element-' + type : ''}`}
        >
          {
            Children.map(children, child =>
              cloneElement(child, {
                hovered,
                onStatusChanged: handleStatusChange,
                startNewThread: newCommentThread,
                setStartNewThread: setNewCommentThread,
                contextMenuOpened,
                onContextMenuOpenChange,
                type,
                commentPopoverIsOpen,
                handlePopoverInteraction,
                ref: elementRef
              })
            )
          }

          { /* <div className={classNames.dropLine} data-cy='drag1' contentEditable={false} /> */ }
          {!!dropLine /* && (dropLine === 'top' || dropLine === 'bottom') */ && (
            <div className={classNames.dropLine} data-cy='drag1' contentEditable={false} style={{userSelect: 'none'}} />
          )}
        </div>
        { /* !!dropLine && (
          <div className={classNames.dropLine} data-cy='drag2' style={{width: '2px', height: '100%', right: 0, left: 'unset'}} contentEditable={false} />
        ) */ }
      </div>
      {!isFullScreen && (<div
        className={mergeStyles(
          classNames.blockAndGutter,
          classNames.gutterRight
        )}
        style={{
          opacity:  contextMenuOpened ? 1 : undefined,
          marginTop: rightGutterMarginTop,
          userSelect: 'none',
          padding: 0
        }}
        contentEditable={false}
      >
        <div
          className={mergeStyles(
            classNames.gutterTopIconContainer
          )}
        >
          <CommentModalWrapperContainer
            blockUid={elementUid}
            blockId={element.block_id}
            startNewThread={newCommentThread}
            setStartNewThread={setNewCommentThread}
            contextMenuOpened={contextMenuOpened}
            onContextMenuOpenChange={onContextMenuOpenChange}
            type={type}
            commentPopoverIsOpen={commentPopoverIsOpen}
            handlePopoverInteraction={handlePopoverInteraction}
            />
          </div>
        </div>
      )}
    </div>

  );
};

export const Selectable = styled<
  SelectableProps,
  SelectableStyleProps,
  SelectableStyles
>(SelectableBase, getSelectableStyles, undefined, {
  scope: 'Selectable',
});
