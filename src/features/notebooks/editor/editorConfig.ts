import Tippy from '@tippyjs/react';
import { Editor, Path } from 'slate';
import {
  createPlateComponents,
  createPlateOptions,
  withProps,
  withStyledProps,
  // withStyledPlaceHolders,
  createReactPlugin,
  createHistoryPlugin,
  createParagraphPlugin,
  createBlockquotePlugin,
  createTodoListPlugin,
  createHeadingPlugin,
  createImagePlugin,
  createHorizontalRulePlugin,
  createLinkPlugin,
  createListPlugin,
  createTablePlugin,
  createMediaEmbedPlugin,
  // createExcalidrawPlugin,
  createCodeBlockPlugin,
  createAlignPlugin,
  createBoldPlugin,
  createCodePlugin,
  createItalicPlugin,
  createHighlightPlugin,
  createUnderlinePlugin,
  createStrikethroughPlugin,
  createSubscriptPlugin,
  createSuperscriptPlugin,
  createFontColorPlugin,
  createFontBackgroundColorPlugin,
  createFontSizePlugin,
  createKbdPlugin,
  createAutoformatPlugin,
  createResetNodePlugin,
  createSoftBreakPlugin,
  createExitBreakPlugin,
  createNormalizeTypesPlugin,
  createTrailingBlockPlugin,
  createSelectOnBackspacePlugin,
  /* ELEMENT_EXCALIDRAW,
  ExcalidrawElement, */
  MARK_COLOR,
  StyledLeaf,
  MARK_BG_COLOR,
  MARK_FONT_SIZE,
  useFindReplacePlugin,
  useMentionPlugin,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_PARAGRAPH,
  ELEMENT_IMAGE,
  ELEMENT_HR,
  ELEMENT_OL,
  ELEMENT_UL,
  ELEMENT_TODO_LI,
  ELEMENT_LI,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_LINK,
  // ToolbarSearchHighlight,
  HeadingToolbar,
  MentionSelect,
  isBlockAboveEmpty,
  isSelectionAtBlockStart,
  createDndPlugin
} from '@udecode/plate';
import { getSelectableElement } from './inline-toolbar';

import {
  createSqlPlugin,
  createAceForSqlEditorPlugin,
  createTrailingWhiteSpacePlugin,
  createWithoutBoldSplitPlugin
} from './plugins/sql';
import { createParameterPlugin } from './plugins/parameter';
import { createPlotlyPlugin } from './plugins/plotly';
import { ELEMENT_SQL } from './plugins/sql/types';
import { SqlElement } from './plugins/sql/SqlElement';
import { ELEMENT_PLOTLY } from './plugins/plotly/defaults';
import { PlotlyElement } from './plugins/plotly/PlotlyElement';
import { ELEMENT_PARAMETER } from './plugins/parameter/defaults';
import { ParameterElement } from './plugins/parameter/ParameterElement';
import { ELEMENT_LAYOUT, ELEMENT_LAYOUT_ITEM } from './plugins/layout/defaults';
import { headingTypes } from './initialValue';
import { autoformatRules } from './autoformat/autoformatRules';
import { createNodeIdPlugin } from './plugins/node-id';
import { LinkElement } from './plugins/link/LinkElement';
import { createLastSelectionPlugin } from './plugins/last-selection';
import { INotebook, INotebookPage, INotebookPageBlock } from '../../../shared/models'
import { MediaEmbedElement } from './elements/media-embed';
import { createWithShowBlockTypePlugin } from './plugins/with-show-block-types-menu/createWithShowBlockTypePlugin';
import { CodeBlockElement } from './elements/code-block';

type EditorCommandCallback = (path: Path, action: string, options?: any, editor?: Editor, index?: number) => void;
type CreateNewPageAndAddCurrentBlockToItCallback = (notebook: INotebook | null, block: INotebookPageBlock, currentPage: INotebookPage) => void;
type MoveCurrentBlockToSelectedPageCallback = (currentPage: INotebookPage | null, targetPage: INotebookPage, block: INotebookPageBlock) => void;
type ComponentWrapperCreator = ({
  component: any;
  type?: string;
  level?: number;
  onCommand: EditorCommandCallback;
  index: number;
  createNewPageAndAddCurrentBlockToIt: CreateNewPageAndAddCurrentBlockToItCallback;
  moveCurrentBlockToSelectedPage: MoveCurrentBlockToSelectedPageCallback;
});

function createWrapperComponent({
  component, type, level, onCommand, index,
  createNewPageAndAddCurrentBlockToIt,
  moveCurrentBlockToSelectedPage
}: ComponentWrapperCreator) {
  return getSelectableElement({
      component,
      type: type || 'p',
      level,
      styles: {
        blockAndGutter: {
          padding: '4px 0'
        },
        blockToolbarWrapper: {
          height: '1.5em'
        }
      },
      filter: (editor, path) => {
        const parent: any = Editor.parent(editor, path);
        if (
          parent && (
            parent[0].type === ELEMENT_LI ||
            type === ELEMENT_LAYOUT_ITEM ||
            type === ELEMENT_LAYOUT
            )
        ) {
          // if element parent is li, don't render selectable element (filter out)
          return true;
        }
        return false;
      },
      onCommand: (editor: Editor, path: Path, action: string, options?: any) => {
        onCommand(path, action, options, editor, index);
      },
    createNewPageAndAddCurrentBlockToIt,
    moveCurrentBlockToSelectedPage
    })
}

export default function configureEditor(
  onCommand: EditorCommandCallback, dispatch: any,
  createNewPageAndAddCurrentBlockToIt: CreateNewPageAndAddCurrentBlockToItCallback,
  moveCurrentBlockToSelectedPage: MoveCurrentBlockToSelectedPageCallback
) {
  const components = createPlateComponents();
  const options = createPlateOptions();

  let styledComponents = createPlateComponents({
    ...components,
    /* [ELEMENT_MENTION]: withProps(MentionElement, {
    renderLabel: renderMentionLabel,
    }),*/
    // [ELEMENT_EXCALIDRAW]: ExcalidrawElement,
    [MARK_COLOR]: withStyledProps(StyledLeaf, {
      leafProps: {
        [MARK_COLOR]: ['color'],
      },
    }),
    [MARK_BG_COLOR]: withStyledProps(StyledLeaf, {
      leafProps: {
        [MARK_BG_COLOR]: ['backgroundColor'],
      },
    }),
    [MARK_FONT_SIZE]: withStyledProps(StyledLeaf, {
      leafProps: {
        [MARK_FONT_SIZE]: ['fontSize'],
      },
    }),
    [ELEMENT_LINK]: withProps(LinkElement, {}),
    [ELEMENT_SQL]: withProps(SqlElement, {}),
    [ELEMENT_PLOTLY]: withProps(PlotlyElement, {}),
    [ELEMENT_PARAMETER]: withProps(ParameterElement, {}),
    [ELEMENT_MEDIA_EMBED]: withProps(MediaEmbedElement, {}),
    [ELEMENT_CODE_BLOCK]: withProps(CodeBlockElement, {})
  });

  let allComponents = {
    ...components,
    ...styledComponents
  } as any;

  const draggableComponents = [
    ELEMENT_PARAGRAPH,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
    ELEMENT_OL,
    ELEMENT_UL,
    ELEMENT_TODO_LI,
    ELEMENT_BLOCKQUOTE,
    ELEMENT_CODE_BLOCK,
    ELEMENT_HR,
    ELEMENT_PARAGRAPH,
    ELEMENT_IMAGE,
    ELEMENT_SQL,
    ELEMENT_PARAMETER,
    ELEMENT_PLOTLY,
    ELEMENT_LAYOUT,
    ELEMENT_LAYOUT_ITEM,
    ELEMENT_MEDIA_EMBED
  ].map(
    (type: string, index: number) => {
      const component = allComponents[type];
      const level = 1;
      return {
        type,
        component: createWrapperComponent({
          component, type, level, onCommand, index,
          createNewPageAndAddCurrentBlockToIt,
          moveCurrentBlockToSelectedPage
        }),
        rootProps: {
          styles: {
            root: {
              margin: 0,
              lineHeight: '1.5',
            },
          },
        },
      };
    }
  ).reduce((acc, { type, component }) => ({
    ...acc,
    [type]: component
  }), {});

  allComponents = {
    ...allComponents,
    ...draggableComponents
  }

  const defaultOptions = createPlateOptions();
  const resetBlockTypesCommonRule = {
    types: [ELEMENT_BLOCKQUOTE],
    defaultType: ELEMENT_PARAGRAPH,
  };

  const plugins = [
    createReactPlugin(),
    createHistoryPlugin(),
    createParagraphPlugin(),
    createBlockquotePlugin(),
    createTodoListPlugin(),
    createHeadingPlugin(),
    createImagePlugin(),
    createHorizontalRulePlugin(),
    createLinkPlugin(),
    createListPlugin(),
    createTablePlugin(),
    createMediaEmbedPlugin(),
    // createExcalidrawPlugin(),
    createCodeBlockPlugin(),
    createAlignPlugin(),
    createBoldPlugin(),
    createCodePlugin(),
    createItalicPlugin(),
    createHighlightPlugin(),
    createUnderlinePlugin(),
    createStrikethroughPlugin(),
    createSubscriptPlugin(),
    createSuperscriptPlugin(),
    createFontColorPlugin(),
    createFontBackgroundColorPlugin(),
    createFontSizePlugin(),
    createKbdPlugin(),
    createNodeIdPlugin(),
    createLastSelectionPlugin(),
    createAutoformatPlugin({
      rules: autoformatRules
    }),
    createResetNodePlugin({
      rules: [
        {
          ...resetBlockTypesCommonRule,
          hotkey: 'Enter',
          predicate: isBlockAboveEmpty,
        },
        {
          ...resetBlockTypesCommonRule,
          hotkey: 'Backspace',
          predicate: isSelectionAtBlockStart,
        },
      ]
    }),
    createSoftBreakPlugin({
      rules: [
        {
          hotkey: 'shift+enter'
        },
        {
          hotkey: 'enter',
          query: {
            allow: [
              options.code_block.type,
              options.blockquote.type,
              // options.sql.type
            ],
          },
        },
      ]
    }),
    createExitBreakPlugin({
      rules: [
        {
          hotkey: 'mod+enter',
        },
        {
          hotkey: 'mod+shift+enter',
          before: true,
        },
        {
          hotkey: 'enter',
          query: {
            // start & end allows to break title inside the text
            start: true,
            end: true,
            allow: headingTypes
          },
        },
      ]
    }),
    createMediaEmbedPlugin(),
    createSelectOnBackspacePlugin({ allow: [ELEMENT_MEDIA_EMBED] }),
    createNormalizeTypesPlugin({
      rules: [{ path: [0], strictType: ELEMENT_H1 }],
    }),
    createTrailingBlockPlugin({ type: ELEMENT_PARAGRAPH }),
    createSelectOnBackspacePlugin({ allow: [ELEMENT_IMAGE, ELEMENT_HR] }),
    createSqlPlugin(),
    createAceForSqlEditorPlugin(),
    createTrailingWhiteSpacePlugin(),
    createWithoutBoldSplitPlugin(),
    createParameterPlugin(),
    createPlotlyPlugin(),
    createWithShowBlockTypePlugin(options),
    // Must be added to prevent commands from being executed before dnd applies
    createDndPlugin()
  ];

  return { styledComponents: allComponents, options, plugins };
};
