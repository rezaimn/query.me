import React, { useRef, useImperativeHandle, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash/debounce';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/theme-sqlserver';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';
import { format } from 'sql-formatter';

import { useEditor } from 'slate-react';

import { SqlJinjaMode } from './sqlJinjaMode';

import {
  exitEditorEndCmd,
  onExecuteKeypress,
  exitEditorStartCmd,
  onArrowDownKeypress,
  onArrowUpKeypress,
  onBackspaceKeypress,
  onDeleteKeypress,
  onAddNewBlockKeypress,
} from '../commands';
import {IState} from "../../../../../../shared/store/reducers";
import {loadDatabaseMetadata} from "../../../../../../shared/store/actions/editorActions";

type OnChangeCallback = (value: any) => void;
type OnExecuteCallback = () => void;

interface SqlEditorProps {
  element: any; // slate element
  currentDatabase: string | undefined | null;
  defaultValue: string;
  onChange: OnChangeCallback;
  onSelectionChange: OnChangeCallback;
  onExecuteRequest: OnExecuteCallback;
  isFullScreen: boolean;
  // height?: number;
}

interface ExtendedAceEditor extends AceEditor {
  databaseId: any;
}

/*
 * How autocomplete works?
 *
 * 1. get metadata from store (based on current database)
 * 2. on SQL editor focus we check:
 *   - if current database is selected
 *   - if metadata (from store) exists (is loaded) for the current database
 * 2.1. in case current database is selected and metadata exists: we do nothing
 * 2.2. in case current database is selected and metadata does NOT exists:
 *   - we dispatch loadDatabaseMetadata
 *   - metadata is added to store and retrieved
 * 3. if metadata exists:
 *   - we take editor.completers (editor in this case is the Ace Editor)
 *   - editor.completers is global (applied to all the ace editors on the page)
 *   - editor.completers is an array of objects usually containing the getCompletions function
 *   - we add an additional databaseId parameter in order to identify for which database getCompletions is used
 * 3.1 we search for a completer where databaseId parameter equals to current database (selected one)
 * 3.1.1. if found, we do nothing (we don't add a new autocomplete function
 * 3.1.2. if not found:
 *   - we create a completer (applied globally) that only allows autocompletion for the editors that
 *     have the same database selected as the currently focused ace editor;
 *   - the check happens with this line of code: e.databaseId === databaseId
 *   - we create a getCompletions function and add it to editor.completers array along with the current databaseId
 *     in order to know for which database this getCompletions function is used;
 */
const createGetCompletions = (databaseId: any, metadata: any[]) => {
  const getCompletions = (
    editor: ExtendedAceEditor,
    session: any,
    pos: any,
    prefix: string,
    callback: (error: null, wordList: object[]) => void) => {
      const e = editor as ExtendedAceEditor;

      if (!Number.isNaN(parseInt(prefix, 10))) {
        return;
      }
      if (e.databaseId === databaseId) {
        callback(null, metadata?.map(m => (
          {
            caption: m.name,
            value: m.name,
            meta: m.type,
            score: m.score,
          }))
        );
      }
  }

  return getCompletions;
};

const getRangeForReplace = (aceEditor: any) => {
  const range = aceEditor.selection.getRange();
  if (range) {
    const { start, end } = range;
    if (start.row === end.row && start.column === end.column) {
      return {
        range: {
          start: { row: 0, column: 0 },
          end: { row: Number.MAX_VALUE, column: Number.MAX_VALUE }
        },
        isSelected: false
      };
    }
  }
  return { range, isSelected: true };
};

const SqlEditor = React.forwardRef(({
  element,
  currentDatabase,
  defaultValue,
  onChange,
  onSelectionChange,
  onExecuteRequest,
  isFullScreen
  // height
}: SqlEditorProps, ref: any) => {
  const editor = useEditor();
  const aceEditorRef = useRef<any>();
  const editorId = element.id;
  const name = useMemo(() => 'code_editor_' + editorId, [ ]);
  const editorProps = useMemo(() => {
    return {
      contentEditable: false,
      $blockScrolling: true,
    }
  }, [ ]);

  const editorContainerRef = useRef<any>();
  const editorOptions = useMemo(() => {
    const options = {
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      highlightActiveLine: false,
      highlightGutterLine: false,
      minLines: isFullScreen ? undefined : 5,
      maxLines: isFullScreen ? undefined : 15,
    }

    return options
  }, [ isFullScreen ]);

  useEffect(() => {
    if(aceEditorRef.current) {

      // the Ace Editor isn't resizing when switching to full screen.
      // it should use the css 100% height, but the content is stuck with
      // a fixed inline height: attribute
      aceEditorRef.current.editor.resize();
    }
  })

  const commands = useMemo(() => {
    const normalScreenCommands = [
      exitEditorEndCmd(editor, element),
      onExecuteKeypress(onExecuteRequest),
      exitEditorStartCmd(editor, element),
      onArrowUpKeypress(editor, element),
      onArrowDownKeypress(editor, element),
      onDeleteKeypress(editor, element),
      onBackspaceKeypress(editor, element),
      onAddNewBlockKeypress(element)
    ];
    const fullScreenCommands = [
      onExecuteKeypress(onExecuteRequest),
    ];

    return isFullScreen ? fullScreenCommands : normalScreenCommands;

  }, [ isFullScreen ]);

  const dispatch = useDispatch();

  const metadata = useSelector((state: IState) => {
    if (currentDatabase) {
      return state.editor.metadata ? state.editor.metadata[currentDatabase] : null;
    }
    return null;
  });

  const debounceOnChange = useMemo(() => debounce(onChange, 1000), []);
  const debounceOnSelectionChange = useMemo(() => debounce(onSelectionChange, 400), []);

  useEffect(() => {
    if (ref.current) {
      // SQL + Jinja
      ref.current.getEditor().getSession().setMode(new SqlJinjaMode());
    }

    return () => {
      // on component unmount remove debounce for performance reason
      if (debounceOnChange && debounceOnChange.hasOwnProperty('cancel')) {
        debounceOnChange.cancel()
      }
      if (debounceOnSelectionChange && debounceOnSelectionChange.hasOwnProperty('cancel')) {
        debounceOnSelectionChange.cancel()
      }
    };
  }, []);

  const onFocus = useCallback((event: any, editor: any) => {
    editor.setOptions({
        highlightActiveLine: true,
        highlightGutterLine: true
    });
    editor.renderer.$cursorLayer.element.style.display = 'block';

    if (editor.getReadOnly()) {
      return; // it means it's in preview / not editable mode and we don't save changes to sql editor
    }

    if (!metadata && currentDatabase) {
      /*
       * only load metadata on first focus on an editor in order to avoid race conditions;
       */
      dispatch(loadDatabaseMetadata(currentDatabase));
    }
  }, [ currentDatabase, metadata ]);

  const onBlur = useCallback((event: any, editor: any) => {
    editor.setOptions({
      highlightActiveLine: false,
      highlightGutterLine: false
    });
    editor.renderer.$cursorLayer.element.style.display = 'none';
  }, [ ]);

  useEffect(() => {
    if (metadata) {
      /*
       * This is applied globally to all Ace Editors on the page (window.ace)
       * If completer is found, we don't create a new one
       */
      const completers = aceEditorRef.current.editor.completers;
      const found = completers.find((c: any) => c.databaseId === currentDatabase);

      if (!found) {
        // create completer from metadata
        aceEditorRef.current.editor.completers.push({
          getCompletions: createGetCompletions(currentDatabase, metadata),
          databaseId: currentDatabase, // we use this in order to not duplicate an autocomplete
        });
      }
    }
  }, [ metadata ]);

  useEffect(() => {
    /*
     * This feels a bit "hacky"; we apply the right auto completion to the editor based on currently selected database;
     */
    if (
      currentDatabase &&
      aceEditorRef.current &&
      currentDatabase !== aceEditorRef.current.editor.databaseId) {
      // set current database to the editor (used for auto completion)
      aceEditorRef.current.editor.databaseId = currentDatabase;
    }
  }, [ currentDatabase ]);

  /*
   * useImperativeHandle is used to expose methods of the functional component
   * to its parent one. The latter can call them using the associated ref.
   */
  useImperativeHandle(ref, () => ({
    formatBlock() {
      const selectedCode = aceEditorRef.current.editor.getSelectedText();
      const allCode = aceEditorRef.current.editor.getSession().getValue();

      let { range, isSelected } = getRangeForReplace(aceEditorRef.current.editor);
      const formattedCode = format(isSelected ? selectedCode : allCode);
      aceEditorRef.current.editor.session.replace(range, formattedCode);
    },

    getEditor() {
      return aceEditorRef.current.editor;
    }
  }));

  return (
    <div
      className="custom-block__editor__content"
      contentEditable={false}
      style={{userSelect: 'none'}}
      suppressContentEditableWarning
      ref={editorContainerRef}
      >
      <AceEditor
        ref={aceEditorRef}
        className="sql-code-editor"
        data-cy='sqlCodeEditor'
        editorProps={editorProps}
        setOptions={editorOptions}
        commands={commands}
        height="100%"
        width="calc(100% - 1px)"
        mode="text"
        theme="sqlserver"
        showPrintMargin={false}
        onChange={debounceOnChange}
        name={name}
        defaultValue={defaultValue}
        onSelectionChange={debounceOnSelectionChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    </div>
  );
});

export const MemoizedSqlEditor = React.memo(SqlEditor);
