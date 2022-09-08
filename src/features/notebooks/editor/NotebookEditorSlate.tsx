// https://codesandbox.io/s/slate-plugins-reproductions-yxr3q?file=/index.tsx:243-1362

import React, { FunctionComponent, useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Icon, Divider } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { createEditor, Editor, Node, Path, Transforms } from 'slate';
import { Slate, ReactEditor } from 'slate-react';
import { Plate } from '@udecode/plate';
import { scroller } from 'react-scroll';

import './NotebookEditor.scss';
import useDebounce from '../../../shared/hooks/use-debounce';
import { INotebook, INotebookPage, INotebookPageBlock } from '../../../shared/models';
import { useNotebookEditable } from '../hooks/use-editable';
import {
  BalloonToolbar,
  ToolbarMark,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_UNDERLINE,
  MARK_STRIKETHROUGH,
  MARK_CODE,
  // ToolbarMediaEmbed
} from '@udecode/plate';
import { useNotebookCurrentPage } from '../NotebookNavigationContext';
import { onCommand } from './commands';
import configureEditor from './editorConfig';
import { ToolbarLink } from './elements/link/ToolbarLink';
import { SELECT_ACTIONS } from './inline-toolbar/components/Selectable';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '../../../shared/store/reducers';
import {
  createNotebookPage,
  movedNotebookPageBlockSuccess,
  saveNotebookPageBlocks,
} from '../../../shared/store/actions/notebookActions';

type SaveNotebookPageCallback = (notebookPage: INotebookPage) => void;
type SaveBlockCallback = (block: INotebookPageBlock) => void;
type EditorLoadCallback = (value: boolean) => void;

interface NotebookEditorProps {
  content: any | null;
  selectedNotebookPageBlockId: any;
  forceRefresh?: boolean;
  onSave: SaveNotebookPageCallback;
  onSaveBlock: SaveBlockCallback;
  onEditorLoad: EditorLoadCallback;
  fullScreenBlock?: INotebookPageBlock;
}

function onInit(content: any) {
  function toBlock(block: any) {
    let newChildren = block.content_json.children;

    if (block.type === 'layout') {
      newChildren = block.content_json.children.map((layoutItem: any) => {
        return {
          ...layoutItem,
          children: layoutItem.children.map(toBlock)
        }
      });
    }
    return {
      ...block.content_json,
      children: newChildren,
      uid: block.uid,
      name: block.name,
      type: block.type,
      width: block.width,
      results: block.results,
      properties: block.content_json.properties,
      comment_threads: block.comment_threads,
      block_id: block.id,
    }
  }

  return content?.blocks?.filter((block: any) => block.content_json &&
      block.content_json.children && block.content_json.children.length > 0)
    .map(toBlock);
}

const NotebookEditorComponent: FunctionComponent<NotebookEditorProps> = ({
  content,
  selectedNotebookPageBlockId,
  forceRefresh = false,
  onSave,
  onSaveBlock,
  onEditorLoad,
  fullScreenBlock
}: NotebookEditorProps) => {
  /*
   * This is the entry point for the editor.
   *
   * This component parse blocks from the BE and renders them and it parses content and sends it back to the BE.
   */
  let editor: any = null;
  const [value, setValue] = useState<Node[]>([]);
  const [fullScreenContentLoaded, setFullScreenContentLoaded] = useState<boolean>(false);
  const [pageId, setPageId] = useState<string | null>(null);
  const [savingEnabled, setSavingEnabled] = useState<boolean>(false);
  const moveBlockSuccess = useSelector((state: IState) => state.notebooks.blockAddedToTheNewPage);
  const currentPage = useSelector((state: IState) => state.notebooks.selectedNotebookPage);
  const [selectedBlockIndexToMoveToOtherPage, setSelectedBlockIndexToMoveToOtherPage] = useState<number>(-1);
  /* notebook is readOnly by default so the user don't modify it while things are loading */
  const [ readOnly, setReadOnly ] = useState<boolean>(true);
  const debouncedValue = useDebounce(value, 1000);
  const editable = useNotebookEditable();
  const dispatch = useDispatch();
  const isFullScreen = useMemo(() => {
    return !!fullScreenBlock && !!fullScreenBlock.uid;
  }, [ fullScreenBlock ])
  const { setCurrentPage } = useNotebookCurrentPage();
  const createNewPageAndAddCurrentBlockToIt = (notebook: INotebook | null, block: INotebookPageBlock, currentPage: INotebookPage) => {
    const pageName = (notebook?.pages) ?
      `Page ${notebook?.pages.length + 1}` : 'Page 1';
    const blocks: any[] = [block];
    const updatedCurrentPage: any = { ...notebook?.pages[notebook?.pages.findIndex(page => page.uid === currentPage.uid)] };
    setSelectedBlockIndexToMoveToOtherPage(updatedCurrentPage.blocks.findIndex((blockItem: any) => blockItem.uid === block.uid));
    dispatch(createNotebookPage({
      name: pageName,
      notebookId: notebook?.id.toString() || '',
      position: notebook?.pages.length || 0,
      blocks,
    }));
  };
  const moveCurrentBlockToSelectedPage = (currentPage: INotebookPage | null, targetPage: INotebookPage, block: INotebookPageBlock) => {
    targetPage.blocks.push({ ...block });
    const selectedBlockIndex: any = currentPage?.blocks.findIndex((blockItem: any) => blockItem.uid === block.uid);
    setSelectedBlockIndexToMoveToOtherPage(selectedBlockIndex);
    dispatch(saveNotebookPageBlocks(targetPage.uid, targetPage, true));
  };

  useEffect(() => {
    if (moveBlockSuccess && selectedBlockIndexToMoveToOtherPage >= 0) {
      const path = [0, selectedBlockIndexToMoveToOtherPage];
      onCommand(path, SELECT_ACTIONS.REMOVE_BLOCK, { node: currentPage?.blocks[selectedBlockIndexToMoveToOtherPage] }, editor);
      dispatch(movedNotebookPageBlockSuccess(false));
      setSelectedBlockIndexToMoveToOtherPage(-1);
    }
  }, [moveBlockSuccess]);
  const {
    options, styledComponents, plugins
  } = useMemo(() => configureEditor(onCommand, dispatch, createNewPageAndAddCurrentBlockToIt,
    moveCurrentBlockToSelectedPage), []);
  const setSelectionToFirstNode = () => {
    try {
      // Range object from Slate
      const selection = { anchor: { offset: 0, path: [0, 0, 0] }, focus: { offset: 0, path: [0, 0, 0] } };
      Transforms.setSelection(editor, selection);
      ReactEditor.focus(editor);
    } catch (e) {
      // silent fail
    }
  }

  // Deserialize notebook content
  useEffect(() => {
    /*
     * forceRefresh is used in case the editor became not visible and it was changed back to visible;
     * - in this case, we want to reinitialize Slate
     */
    const hasNotBeenInitialized = (content && content.uid !== pageId) || forceRefresh;

    if (hasNotBeenInitialized) {
      setSelectionToFirstNode()

      /*
       * Add additional properties to slate block elements like results, name and uid (mount / init)
       */

      // setValue([{children: onInit(content)}]);
      setValue(onInit(content));

      setSavingEnabled(false); // on init / page change
      setPageId(content.uid);
      setCurrentPage(content);
    } else if (savingEnabled && content && value && value.length) {
      /*
       * Add uid to newly created blocks from value + add additional details.
       *
       * Only update value from state if uid is added to existing blocks.
       *  OR if we've changed to full screen mode?
       */
      let currentValue: any = value;
      let update = false;
      if (!currentValue) {
        return;
      }

      const newValue: any = currentValue.map((child: any, index: number) => {
          // block is either the block from content.blocks (from server) or null
          let block: any = (content.blocks.length && content.blocks[index]) || null;

          if (!block) {
            block = { content_json: {} };
          }

          const newChild = {
            ...(block.content_json || {}),
            ...child,
            results: block.results || [],
          }

          if (block.uid && !child.uid) {
            // If value.children has no uid, it means it's newly created.
            newChild.uid = block.uid;
            newChild.block_id = block.id;
            update = true;
          }

          if(!child.comment_threads) {
            newChild.comment_threads = [];
            update = true;
          }

          /* The block causes problem during race condition requests. The
             name is cleared. It must however be kept for newly created
             blocks
           */
          if (
            !block.uid &&
            !isFullScreen && ((block.name && block.name !== child.name) ||
            (!block.name && child.name && block.name !== child.name))
          ) {
            //  If block name differs or block name was deleted
            newChild.name = block.name;
            update = true;
          }

          if (block.database_id && block.database_id !== child.database_id) {
            newChild.database_id = block.database_id;
            update = true;
          }

          return newChild;
        }
      );

      if (update) {
        //TODO: upgrade (plate)
        //setValue([{ children: [...newValue] }]);
        setValue(newValue);
      }
    }
  }, [ content, fullScreenBlock ]);

  // Set selection
  useEffect(() => {
    // Added saving enabled because if content is readOnly, slate cannot find nodes;
    /*
      I don't know what the behaviour should be when clicking on the sidebar link for a block
      when you are in full screen mode, so disable it for full screen with - !isFullScreen
    */

    if (savingEnabled && !readOnly && selectedNotebookPageBlockId && !isFullScreen) {
      const index = content.blocks.findIndex((block: any) => block?.content_json?.id === selectedNotebookPageBlockId);

      if (index < 0) {
        // block index not found
        return;
      }

      const point = { anchor: { path: [0, index, 0], offset: 0 }, focus: { path: [0, index, 0], offset: 0 }};
      ReactEditor.focus(editor);
      Transforms.select(editor, point);
      setTimeout(() => {
        try {
          scroller.scrollTo(selectedNotebookPageBlockId, {
            duration: 500,
            delay: 0,
            smooth: 'easeInOutQuart',
            containerId: 'page__content'
          });
        } catch (err) {
          // Silent fail
        }
      }, 200);
    }
  }, [ content, savingEnabled, pageId, selectedNotebookPageBlockId, readOnly ]);

  const saveContent = (valueToSave: any) => {
    const editorBlocks = valueToSave;

    const contentToSave = {
      ...content,
      blocks: [] as any[]
    };

    if (!editorBlocks) {
      return;
    }

    for (const editorBlock of editorBlocks) {
      let block = content.blocks.find((b: any) => b.uid === editorBlock.uid);
      if (!block) {
        block = { content_json: {} };
      }

      // clean up editor block (slate-block) before saving it to the BE
      const { results, data, name, ...rest } = editorBlock;

      block.type = editorBlock.type;
      block.content_json = {
        ...block.content_json,
        ...rest
      };
      block.name = name || '';

      contentToSave.blocks.push(block);
    }

    if (isFullScreen) {
      const blockToSave = contentToSave.blocks.find((b: INotebookPageBlock) => b.uid === fullScreenBlock!.uid)
      onSaveBlock(blockToSave);
    }
    else {
      onSave(contentToSave);
    }
  }

  // Save notebook content with debounce
  useEffect(() => {
    if (!debouncedValue || debouncedValue?.length === 0) {
      return;
    }

    const shouldSave = savingEnabled && debouncedValue;

    if (shouldSave) {
      saveContent(debouncedValue)
    } else {
      if (value && debouncedValue) {
        /*
         * everything loaded, enable edit
         */
        setSavingEnabled(true);
        onEditorLoad(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ debouncedValue ]);

  useEffect(() => {
    if (savingEnabled) {
      /* if saving is enabled, it means the component is editable, hence not readOnly */
      /* if notebook is editable, it means it's not readOnly */
      setReadOnly(!editable);
    }
  }, [ savingEnabled ]);

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <Plate
          editor={editor}
          plugins={plugins}
          options={options}
          components={styledComponents}
          value={value}
          onChange={(newValue: Node[]) => {
            setValue(newValue);
          }}
        >
          <BalloonToolbar
            direction={'top'}
            theme={'light'}
            arrow={true}
          >
            <ToolbarLink icon={<Icon icon={IconNames.LINK} />} />
            <Divider className="toolbar-divider" />
            <ToolbarMark
              type={MARK_BOLD}
              icon={<Icon icon={IconNames.BOLD} />}
            />
            <ToolbarMark
              type={MARK_ITALIC}
              icon={<Icon icon={IconNames.ITALIC} />}
            />
            <ToolbarMark
              type={MARK_UNDERLINE}
              icon={<Icon icon={IconNames.UNDERLINE} />}
            />
            <ToolbarMark
              type={MARK_STRIKETHROUGH}
              icon={<Icon icon={IconNames.STRIKETHROUGH} />}
            />
            <ToolbarMark
              type={MARK_CODE}
              icon={<Icon icon={IconNames.CODE} />}
            />
          </BalloonToolbar>
        </Plate>
      </DndProvider>
    </div>
  )
}

export default NotebookEditorComponent;
