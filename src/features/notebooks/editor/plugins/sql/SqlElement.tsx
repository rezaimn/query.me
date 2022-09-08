import React, {
  forwardRef,
  useImperativeHandle,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  Fragment
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEditor, useSelected, ReactEditor, RenderElementProps } from 'slate-react';
import {
  Button,
  Colors,
  Icon,
  Intent,
  Position,
  Toaster,
  Tooltip,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { format } from 'date-fns';
import { useHistory, useLocation, useParams} from 'react-router-dom';

import CommentModalWrapperContainer from '../../comments/CommentModalWrapperContainer'
import { IState } from '../../../../../shared/store/reducers';
import {
  updateNotebookPageProperties,
  executedNotebookPageBlock,
  updatedNotebookPageBlockExecution
} from '../../../../../shared/store/actions/notebookActions';
import {
  executeNotebookPageBlock,
  getNotebookPageBlockExecution,
  previewNotebookPageBlock,
} from '../../../../../shared/services/notebooksApi'; // @TODO - move to editorActions
import {
  MemoizedExecuteBtn,
  MemoizedPreviewBtn,
  MemoizedSelectDatabase,
  MemoizedSelectLimit,
  MemoizedSqlEditor,
} from './components';
import QueryResults from './QueryResults';
import { updateElementProps } from '../../utils';
import './SqlElement.scss';
import BlockName from "../../components/BlockName";
import { INotebookPageBlock } from '../../../../../shared/models';

import {
  // useSelectedNotebookDataElement,
  useNotebookCurrentPage,
  useSelectedNotebookDataElement,
  useSelectNotebookDataElement
} from '../../../NotebookNavigationContext';
import { useNotebookEditable } from "../../../hooks/use-editable";
import { useActions } from '../../../../../shared/components/layout/ActionContext';


type StatusChangedCallback = (status: string) => void;

interface AdditionalRenderElementProps extends RenderElementProps {
  hovered: boolean;
  onStatusChanged: StatusChangedCallback;
  startNewThread: any;
  setStartNewThread: any;
  contextMenuOpened: any;
  onContextMenuOpenChange: any;
  type: any;
  commentPopoverIsOpen: any;
  CommentModal: any;
  handlePopoverInteraction: any;
}

type OnChangeCallback = (value: any) => void;

interface ShowQueryBtnProps {
  show: boolean;
  onChange: OnChangeCallback;
}

const finishedStatus = ['success', 'failed'];

const toasterMessage = Toaster.create({
  className: 'toaster-message',
  position: Position.TOP
});

const ShowQueryBtn = React.memo(({ show, onChange }: ShowQueryBtnProps) => {
  const icon = show ? IconNames.EYE_ON : IconNames.EYE_OFF;
  const color = show ? Colors.GRAY1 : Colors.GRAY3;

  return (
    <Button className='bp3-button bp3-minimal' icon={icon} color={color} onClick={() => onChange(!show)} />
  );
});

interface FullScreenQueryBtnProps {
  uid: string | null;
  isFullScreen: boolean;
}

const FullScreenQueryBtn = React.memo(({ uid, isFullScreen }: FullScreenQueryBtnProps) => {
  const history = useHistory();
  const location = useLocation();
  const params = useParams<Record<string, string | undefined>>()
  const color = isFullScreen ? Colors.GRAY5 : Colors.GRAY3;
  const icon = isFullScreen ? IconNames.CROSS : IconNames.FULLSCREEN;

  const handleFullScreenButtonClick = useCallback(() => {
    if(!uid) {
      return null;
    }

    const newPath = !isFullScreen && params?.pageId && !!uid ?
      `/n/${params.notebookId}/${params.pageId}/${uid}` : `/n/${params.notebookId}/${params.pageId}?blockUid=${uid}`

    history.push(newPath);

  }, [ uid, isFullScreen ])

  return (
    <Button
      className='bp3-button bp3-minimal'
      icon={icon}
      color={color}
      onClick={handleFullScreenButtonClick}
      style={{
        // hide it while the uid is loaded. but still let it take up space so the ui doesn't move at all when it loads.
        pointerEvents: !uid ? 'none' : undefined,
        opacity: !uid ? 0 : undefined,
      }}
    />
  );
});

export const SqlElement = forwardRef(({
  attributes,
  children,
  element,
  hovered,
  onStatusChanged,
  startNewThread,
  setStartNewThread,
  contextMenuOpened,
  onContextMenuOpenChange,
  type,
  commentPopoverIsOpen,
  handlePopoverInteraction
}: AdditionalRenderElementProps, ref: any) => {
  const elementUid = (element as any).uid;
  const location = useLocation();
  const editor = useEditor();
  const dispatch = useDispatch();
  const [ showQuery, setShowQuery ] = useState<boolean>(
    element.hasOwnProperty('show_query') ? (element as any).show_query as boolean : true);
  const [ showResults, setShowResults ] = useState<boolean>(
    element.hasOwnProperty('show_results') ? (element as any).show_results as boolean : true);
  const [ sqlSelected, setSqlSelected ] = useState(false);
  const [ isNameValid, setIsNameValid ] = useState(true);
  const [ sql, setSql ] = useState<string>((element as any).sql as string);
  /*
   * Using an entry for the name in the state is necessary to prevent from
   * losing the name between an execution of the block and a save of the notebook page
   */
  const [ currentName, setCurrentName ] = useState<string>((element as any).name as string);
  const [ currentDatabase, setCurrentDatabase ] = useState<string>((element as any).database_id as string);
  const currentDatabaseRef = useRef<string>((element as any).database_id as string);
  const [ limit, setLimit  ] = useState((element as any).limit as string || '1000');
  const [ limitChecked, setLimitChecked ] = useState<boolean>(true);
  const [ executing, setExecuting ] = useState(false);
  const [ DBMenuIsOpen, setDBMenuIsOpen ] = useState(false);
  const [ latestResultChecked, setLatestResultChecked ] = useState(false);
  const selected = useSelected(); // @TODO - not sure about this
  const [ preview, setPreview ] = useState<boolean>(false);
  const [ loadPreview, setLoadPreview ] = useState<boolean>(false);
  const [ tmpSql, setTmpSql ] = useState(''); // used to save original SQL when preview
  const aceEditorRef = useRef<any>();
  const { addDataElementListener, removeDataElementListener } = useSelectNotebookDataElement();
  const editable = useNotebookEditable();
  const { dispatchAction, addActionListener, removeActionListener } = useActions();

  const { currentPage } = useNotebookCurrentPage();

  useEffect(() => {
    /*
     * on component init
     * - find a SQL block with a database_id and set it for the newly created SQL element;
     */
    if (!currentDatabase) {
      const blocks = editor.children as any[];
      const sqlBlockWithDatabaseId = blocks.find(b => b.type === 'sql' && b.database_id);
      if (sqlBlockWithDatabaseId) {
        onDatabaseChange(sqlBlockWithDatabaseId.database_id);
      } else {
        if (databases.length === 1) {
          onDatabaseChange(databases[0].uid);
        }
      }
    }
  }, []);

  useEffect(() => {
    /*
     * Transition from SlateEditor to AceEditor
     * if void block is selected and ace editor is not focused, move focus on ace editor
     * @NOTE: this only happens when you navigate with arrow keys
     */
    if (aceEditorRef.current && selected) {
      const aceEditor = aceEditorRef.current.getEditor();
      if (!aceEditor.$isFocused) {
        const totalLines = aceEditor.getSession().getLength();
        const elementPath: any = ReactEditor.findPath(editor, element);

        const lastSelection: any = (editor as any).lastSelection;
        const lastSelectionProps: any = lastSelection?.properties;

        let fromAbove = true; // we default to gotoLine(0, 0)
        if (lastSelectionProps && elementPath) {
          fromAbove = lastSelectionProps.anchor?.path[0] < elementPath[0];
        }
        /*
         * if cursor exists (editor was created before), focus on the last line it lost focus (usually 1st or last)
         * @TODO: fix column selection as well
         */
        aceEditor.focus();
        /*
          Todo: This is shifting focus from the block name input to the first line of the sql block
          - fix me!
        */
        aceEditor.gotoLine(fromAbove ? 0 : totalLines, 0, true);
      }
    }
  }, [ aceEditorRef, selected ]);

  const notebookUid = useSelector((state: IState) => state.notebooks.notebook?.uid);

  const block = useSelector((state: IState) => {
    /*
    * get block from state
    * This is called on every state change / re-render.
    */
    const blockId = (element as any).uid;
    if (state.notebooks.notebook) {
      const { pages } = state.notebooks.notebook;
      for (const page of pages) {
        const { blocks } = page;
        for (const block of blocks) {
          if (block.uid === blockId) {
            return block;
          }
        }
      }
    }
    return null;
  });

  useEffect(() => {
    if (!latestResultChecked && block) {
      /*
       * if latest result not checked and block exists
       */
      if (block.results && block.results.length > 0) {
        /*
         * if results do exists, check the last result status
         */
        const latestResult = block.results[0] as any; // FIFO
        if (latestResult.status && finishedStatus.indexOf(latestResult.status) < 0) {
          checkExecution(elementUid, latestResult.key, 1);
        }
      }
      /*
       * if block exists, but it doesn't have results, setLastResultChecked to true in order to avoid 2 runs:
       * - one from checkExecution triggered by the user
       * - one from the above check where we check the latestResult
       */
      setLatestResultChecked(true);
    }
  }, [ block ]);

  useEffect(() => {
    const callback = (dataElement: any) => {
      if (dataElement && selected) {
        const aceEditor = aceEditorRef.current.getEditor();
        aceEditor.session.insert(aceEditor.getCursorPosition(), dataElement.label);
      }
    };
    addDataElementListener(elementUid as string, callback);
    return () => {
      removeDataElementListener(elementUid as string);
    };
  }, [ selected ]);

  useEffect(() => {
    if (!editable && aceEditorRef.current) {
      const aceEditor = aceEditorRef.current.getEditor();
      aceEditor.setReadOnly(true);
    }
  }, [ aceEditorRef, dispatch ]);

  useEffect(() => {
    addActionListener(`sql-element-header-${elementUid}`, onTriggerCheckResult);
    return () => {
      removeActionListener(`sql-element-header-${elementUid}`);
    };
  }, []);

  const databases = useSelector((state: IState) => state.databases.databases);

  const { sql: elementSql } = useMemo(() => element as any, []);

  const onDatabaseChange = useCallback((databaseUid: string) => {
    if ((element as any).database_id === databaseUid) {
      // Database uid was not changed;
      return;
    }
    setCurrentDatabase(databaseUid);
    currentDatabaseRef.current = databaseUid;
    console.log('>> onDatabaseChange - databaseUid = ', databaseUid);

    updateElementProps(editor, element, 'database_id', databaseUid);
  }, [ element ]);

  const onNameUpdate = useCallback((value: string) => {
    updateElementProps(editor, element, 'name', value);
    // dispatch(saveNotebookPageBlock(elementUid as string, { name: value }));
    setCurrentName(value);
  }, []);

  const onLimitUpdate = useCallback((value: string) => {
    if (value && value.toString() !== limit.toString()) {
      setLimit(value);

      updateElementProps(editor, element, 'limit', value);
    }
  }, []);

  const onPreview = useCallback(() => {
    if (aceEditorRef.current && !loadPreview) {
      const newPreview = !preview;
      const aceEditor = aceEditorRef.current.getEditor();
      aceEditor.setReadOnly(newPreview);
      aceEditor.setOption('wrap', newPreview); /* soft wrap text */

      if (newPreview) { // load preview
        setLoadPreview(true);
        previewNotebookPageBlock(elementUid as string, notebookUid as string)
          .then((result: any) => {
            setLoadPreview(false);
            setPreview(newPreview);

            aceEditor.renderer.canvas.parentElement.style.background = Colors.GRAY5;

            const allCode = aceEditor.getSession().getValue();
            setTmpSql(allCode);
            aceEditor.getSession().setValue(result.preview.sql);
          })
          .catch((error: any) => {
            const message = error.response?.data?.message || "";
            setLoadPreview(false);
            setPreview(false);
            aceEditor.setReadOnly(false);
            aceEditor.setOption('wrap', false);

            toasterMessage.show({
                message: `Preview error: ${message}.`,
                intent: Intent.DANGER
              });
          });
      } else {
        aceEditor.renderer.canvas.parentElement.style.background = '';

        if (tmpSql) {
          aceEditor.getSession().setValue(tmpSql);
          setTmpSql('');
        }
        setPreview(newPreview);
      }
    }
  }, [ preview, tmpSql ]);

  const dispatchResultFinished = useCallback(() => {
    dispatchAction({ action: 'result-finished', blockUid: elementUid });
  }, [ dispatchAction, elementUid ]);

  const checkExecution: any = useCallback((elementUid: string, runId: string, counter: number = 0, shouldDispatch: boolean = false) => {
    /*
     * counter: a safety counter so we don't check more then N time;
     * shouldDispatch: used in order to dispatch execution to show execution details during execution (e.g. executedSql)
     */
    return getNotebookPageBlockExecution(elementUid, runId)
      .then((res: any) => res.result)
      .then((execution: any) => {
        const currentBlockData = {
          uid: elementUid,
          // name: currentName,
          database_id: currentDatabase
        } as Partial<INotebookPageBlock>;

        const executedSql = execution.value.query.executedSql;
        if (counter === 0) {
          /*
           * if it's first time, set the execution object
           */
          shouldDispatch && dispatch(
            executedNotebookPageBlock(elementUid, currentPage, currentBlockData, execution)
          );
          onStatusChanged && onStatusChanged(execution.status); // @TODO - improve
          /**
           * The first time the executedSql property can be null, so we need
           * to pass the hint for next execution check. When the executedSql property
           * becomes not null, we need to dispatch this hint to the store.
           * FYI executedSql is used in the query details pop both during the execution
           * and when the execution ended.
           */
          return checkExecution(elementUid, runId, counter += 1, !!executedSql);
        } else if (counter === 3600 || !execution) {
          /*
           * if no execution or we checked more then N times => Timeout
           */
          onStatusChanged && onStatusChanged('failed'); // @TODO - improve
          dispatchResultFinished();
          return false;
        } else if (execution && execution.status && finishedStatus.indexOf(execution.status) >= 0) {
          /*
           * executed
           */
          dispatch(
            updatedNotebookPageBlockExecution(elementUid as string, currentPage, currentBlockData, execution)
          );
          setExecuting(false);
          onStatusChanged && onStatusChanged(execution.status); // @TODO - improve
          dispatchResultFinished();

          return;
        }
        shouldDispatch && dispatch(
          executedNotebookPageBlock(elementUid, currentPage, currentBlockData, execution)
        );
        setTimeout(() => {
          /*
           * long polling
           */
          checkExecution(elementUid, runId, counter += 1, !!executedSql);
        }, 1000);
      })
      .catch((error: any) => {
        console.log('error', error);
      });
  }, [ currentName, currentDatabase ]);

  const onTriggerCheckResult = useCallback(({ action, blockUid, runId }) => {
    if (action !== 'check-result' || elementUid !== blockUid) {
      return;
    }

    checkExecution(blockUid, runId);
  }, [ elementUid, checkExecution ]);

  const executeRequest = useCallback(() => {
    if (/* !elementUid ||*/ !currentDatabaseRef.current || executing) {
      setDBMenuIsOpen(true);
      /*
       * if no elementUid (not created yet) or no currentDatabase selected or it is executing, or preview mode, exit;
       */
      return;
    }
    setExecuting(true);

    /*
     * In order to send the latest content of a block (because block itself contains the value before debounce),
     * we create a new block.
     */
    let newBlock: any;

    if (block) {
      const aceEditor = aceEditorRef.current.getEditor();
      const selectedCode = aceEditor.getSelectedText();
      const allCode = aceEditor.getSession().getValue();

      const sqlText = selectedCode ? selectedCode : allCode;

      newBlock = {
        ...block,
        content_json: block.content_json ? {
          ...block.content_json,
          database_id: block.content_json.database_id || currentDatabaseRef.current,
          limit: limitChecked ? limit : null,
          sql: sqlText,
          children: element.children, // @TODO - remove
        } : block.content_json
      };
    }

    executeNotebookPageBlock(elementUid as string, notebookUid, newBlock)
      .then((response: any) => {
        const { run_id: runId } = response;
        return runId;
      })
      .then((runId: string) => {
        checkExecution(elementUid as string, runId);
      }).catch((error: any) => {
        setExecuting(false);
        const message = error.response?.data?.message || "";

        toasterMessage.show({
            message: `An error occurred while running: ${message}.`,
            intent: Intent.DANGER
          });

        // console.log('Error execute block', error);
    });
  }, [ currentName, currentDatabase, block, executing, preview, (element as any).database_id ]);

  const onSqlChange = useCallback((value: any) => {
    const aceEditor = aceEditorRef.current.getEditor();
    if (aceEditor.getReadOnly()) {
      return; // it means it's in preview mode and we don't save changes to sql editor
    }
    setSql(value);

    updateElementProps(editor, element, "sql", value);
  }, [ editor, element ]);

  const onSqlSelectionChange = useCallback((value: any) => {
    if (aceEditorRef.current) {
      const aceEditor = aceEditorRef.current.getEditor();
      if (!aceEditor) {
        return;
      }

      const selectedCode = aceEditor.getSelectedText();
      setSqlSelected(selectedCode.trim() !== '');

      if (!aceEditor.$isFocused) {
        aceEditor.focus();
      }
    }
  }, [ aceEditorRef ]);

  const onSetShowQuery = useCallback((value: any) => {
    setShowQuery(value);

    updateElementProps(editor, element, "show_query", value);
  }, []);

  const onSetShowResults = useCallback((value: any) => {
    setShowResults(value);

    // editor.resize()
    if (aceEditorRef.current && selected) {
      const aceEditor = aceEditorRef.current.getEditor();
      aceEditor.resize();
    }

    updateElementProps(editor, element, "show_results", value);
  }, []);

  // @TODO - not sure about this; needs to be tested
  // this is used in SqlEditor in order for the commands for Ace Editor to work with Slate Editor
  const memoizedElement: any = useMemo(() => element, []);

  useImperativeHandle(ref, () => ({
    formatBlock() {
      aceEditorRef.current.formatBlock();
    }
  }));
  const params = useParams<Record<string, string | undefined>>()
  const blockParamUid = useMemo(() => {
    return params?.blockId || null;
  }, [ params ])


  const isFullScreen = useMemo(() => {
    return !!blockParamUid
  }, [ blockParamUid ])

  return (
    // Need contentEditable=false or Firefox has issues with certain input types.
    <div className={"sql " + (isFullScreen ? 'full-screen' : '')} {...attributes}>
      <div contentEditable={false} className="sql__title" style={{userSelect: 'none'}}>
        <div className="sql__title__text" data-cy='blockName'>
         <MemoizedSelectDatabase
           databases={databases}
           currentDatabase={currentDatabase}
           disable={!elementUid}
           onChange={onDatabaseChange}
           DBMenuIsOpen={DBMenuIsOpen}
           setDBMenuIsOpen={setDBMenuIsOpen}
         />
         <BlockName
           isNameValid={setIsNameValid}
           uid={elementUid as string}
           defaultValue={(element as any).name as string}
           onUpdate={onNameUpdate}
         />
        </div>
        <div className="sql__title__toolbar">
          {
            (hovered || selected || isFullScreen) && (
              <>
                {editable && isFullScreen && (
                  <CommentModalWrapperContainer
                    blockUid={elementUid as string}
                    blockId={(element as any).block_id as string}
                    startNewThread={startNewThread}
                    setStartNewThread={setStartNewThread}
                    contextMenuOpened={contextMenuOpened}
                    onContextMenuOpenChange={onContextMenuOpenChange}
                    type={type}
                    commentPopoverIsOpen={commentPopoverIsOpen}
                    handlePopoverInteraction={handlePopoverInteraction}
                    />

                )}
                {/*<Tooltip*/}
                {/*  hoverOpenDelay={1000}*/}
                {/*  content={<>Open in Full Screen</>}*/}
                {/*  position={Position.BOTTOM}*/}
                {/*>*/}
                {/*  <FullScreenQueryBtn*/}
                {/*    uid={!!elementUid ? elementUid as string : null}*/}
                {/*    isFullScreen={isFullScreen}*/}
                {/*    />*/}
                {/*</Tooltip>*/}
                {!isFullScreen && editable && (hovered || selected) && (
                  <Tooltip
                    hoverOpenDelay={1000}
                    content={<>Show/Hide</>}
                    position={Position.BOTTOM}
                  >
                    <ShowQueryBtn
                     show={showQuery}
                     onChange={onSetShowQuery} />
                  </Tooltip>
                )}
              </>
            )
          }
        </div>
      </div>
      <div className={`custom-block__editor ${showQuery ? 'show' : 'hide'}`}
           style={{ marginTop: !isNameValid ? '25px' : '0' }} >
        <div className="custom-block__editor__sidebar" contentEditable={false} style={{userSelect: 'none'}}>
          {
            editable && (
              <Fragment>
                <MemoizedExecuteBtn
                  preview={preview}
                  selection={sqlSelected}
                  executing={executing}
                  currentDatabase={currentDatabase}
                  onClick={executeRequest} />
                <MemoizedPreviewBtn
                  preview={preview}
                  loadPreview={loadPreview}
                  onClick={onPreview} />
              </Fragment>
            )
          }
        </div>
        <div
          className="sql-editor-container"
          style={{
          height: '100%',
          width: '100%',
        }}
        >
          <MemoizedSqlEditor
            ref={aceEditorRef}
            element={memoizedElement}
            // height={resultsSectionHeight}
            currentDatabase={currentDatabase}
            defaultValue={elementSql as string}
            onChange={onSqlChange}
            onExecuteRequest={executeRequest}
            isFullScreen={isFullScreen}
            onSelectionChange={onSqlSelectionChange} />
        </div>
        <MemoizedSelectLimit
          show={editable ? !preview : false}
          checked={limitChecked}
          onCheckedChange={setLimitChecked}
          defaultLimitValue={limit}
          onLimitChange={onLimitUpdate} />
      </div>

      <div className="query__content__results" contentEditable={false} style={{userSelect: 'none'}}>
        <div className="query__content__results__tabs">
          <QueryResults
            showResults={showResults}
            showToolbar={hovered || selected || isFullScreen}
            onChangeShowResults={onSetShowResults}
            block={block}
            results={block && block.results as any[]} />
        </div>
      </div>

      <span suppressContentEditableWarning className="void-element">
        {children}
      </span>
    </div>
  );
});
