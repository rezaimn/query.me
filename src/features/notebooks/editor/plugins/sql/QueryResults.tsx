import React, { useCallback, useMemo, useEffect, useState, Fragment } from 'react';
import { format } from 'date-fns';

import {
  Button,
  Colors,
  Icon,
  Popover,
  Position,
  Tooltip,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import './QueryResults.scss';
import Tabs from '../../../../../shared/components/layout/Tabs/Tabs';
import Tab from '../../../../../shared/components/layout/Tabs/Tab';
import { INotebookPageBlock } from '../../../../../shared/models';
import QueryResult from './QueryResult';
import QueryResultHints from './QueryResultHints';
import {
  getNotebookPageBlockExecution
} from '../../../../../shared/services/notebooksApi';
import { useNotebookEditable } from "../../../hooks/use-editable";
import DownloadResultBtn from './DownloadResult';

function formatDateForTab(date: number) {
  return format(new Date(date), 'MMM dd HH:mm:ss');
}

function getResultSelectedMessage(result: any) {
  const duration = Math.floor(((result.value.query.endDttm - result.value.query.startDttm) / 1000) * 100) / 100;
  if (result.status === 'success') {
    const rowsNumber = result.value.query.rows;
    return `${rowsNumber} row${rowsNumber > 1 ? 's' : ''} in ${duration}s`;
  } else {
    return '';
  }
}

type ResultSelectedCallback = (result: any) => void;

type OnChangeCallback = (value: any) => void;

type OnSelectResultCallback = (value: any) => void;

type Result = {
  key: string;
  start_time: number;
  status: string;
  value: {
    // these fields are only available on the 1st result (so we don't load it via API)
    columns?: any;
    data?: any;
    query?: any;
    selected_columns?: any;
  }
};

interface QueryResultsProps {
  selected?: boolean;
  showResults: boolean; // this comes from the element and it's saved on the server
  showToolbar: boolean;
  onChangeShowResults: OnChangeCallback;
  block: INotebookPageBlock | null;
  results: Result[] | null
}

interface ShowResultsBtnProps {
  show: boolean;
  onChange: OnChangeCallback;
}

interface DetailsBtnProps {
  selectedResult: any | null;
  show: boolean;
}

interface DisplayResultsProps {
  results: any;
  selectedResult: any | null;
  onSelectResult: OnSelectResultCallback;
}

const ShowResultsBtn = React.memo(({show, onChange}: ShowResultsBtnProps) => {
  const icon = show ? IconNames.EYE_ON : IconNames.EYE_OFF;
  const color = show ? Colors.GRAY1 : Colors.GRAY3;

  return (
    <Tooltip content="Show/Hide">
      <Button className='bp3-button bp3-minimal' icon={<Icon icon={icon} color={color}  />} onClick={() => onChange(!show)} />
    </Tooltip>
  );
});

const DetailsBtn = React.memo(({ selectedResult, show }: DetailsBtnProps) => {
  if (!selectedResult || !show) {
    return null;
  }
  const resultContent = <QueryResultHints result={selectedResult} />

  return (
    <Popover
      content={resultContent}
      position={Position.BOTTOM_RIGHT}
      className="organization__trigger"
    >
      <Tooltip content="Query Details">
        <Button className='bp3-button bp3-minimal' icon={<Icon icon={IconNames.CODE} color={Colors.GRAY1} />} />
      </Tooltip>
    </Popover>
  )
});

const DisplayResults = React.memo(({ results, selectedResult, onSelectResult }: DisplayResultsProps) => {
  const noResults = !(results && results.length);

  return (
    <div className="query__content__results__tabs">
      {
        noResults ? (
          <div>No query runs.</div>
        ) : (
          <Tabs
            defaultActiveTab={selectedResult ? selectedResult.key : ""}
            headersBelow={true}
            showHeaders={true} stopPropagation={true}
            message={selectedResult ? getResultSelectedMessage(selectedResult) : ""}
            onSelectTab={onSelectResult}
          >
            {
              results.map((result: any) => (
                <Tab
                  id={result.key}
                  key={result.key}
                  title={formatDateForTab(result.start_time)}
                  icon={
                    (result.status === 'success') ?
                      IconNames.TH : (result.status === 'failed') ?
                        IconNames.ERROR : IconNames.TIME
                  }
                  status={result.status}
                  closable={false}
                >
                  <QueryResult result={result} />
                </Tab>
              ))
            }
          </Tabs>
        )
      }
    </div>
  );
});

const QueryResultsComponent = ({
  selected,
  showResults,
  showToolbar,
  onChangeShowResults,
  block,
  results,
}: QueryResultsProps) => {
  const [ selectedResult, setSelectedResult ] = useState<any>(null);
  const [ selectedResultColumns, setSelectedResultColumns ] = useState<any>(null);
  const [ loadedResults, setLoadedResults ] = useState<any[]>([]);
  const editable = useNotebookEditable();

  useEffect(() => {
    /*
     * if new result is added to the result set
     */
    if (results && results.length) {
      setLoadedResults((loadedResults: any) => results.map(result => {
        if (!result) {
          return [];
        }

        const loadedResult = loadedResults.find((r: any) => r.key === result.key);
        return loadedResult ?
          {
            ...loadedResult,
            status: result.status,
            value: (result.status !== loadedResult.status) ?
              result.value :
              loadedResult.value
          } : { ...result };
      }));

      const result = results[0];
      setSelectedResultAndColumn(result);
    }
  }, [ results ]);

  const setSelectedResultAndColumn = useCallback((result: any) => {

    if (!result) {
      return;
    }

    setSelectedResult(result);
    if (result.value && result.value.columns) {
      setSelectedResultColumns(
        result.value.columns.map((column: any) => column.name)
      );
    } else {
      setSelectedResultColumns([]);
    }
  }, []);

  const onSelectResult = useCallback((key: string) => {

    const loadedResult = loadedResults.find((r: any) => r.key === key);

    if (block && loadedResult && Object.keys(loadedResult.value).length === 0) {
      /*
       * it means this value is from results (history) - needs to be loaded
       */
      getNotebookPageBlockExecution(block.uid || "", loadedResult.key)
        .then((res: any) => res.result)
        .then((result: any) => {
          setSelectedResultAndColumn(result);

          setLoadedResults((loadedResults: any) => loadedResults.map((r: any) => {
            if (r.key === loadedResult.key) {
              return {
                ...loadedResult,
                value: result.value
              }
            }
            return r;
          }));
        });
    } else {
      setSelectedResultAndColumn(loadedResult);
    }
  }, [ loadedResults ]);

  return (
    <div className="query-results">
      <div className={`query-results__header ${showResults ? 'show-results' : ''}`}>
        <div className="query-results__header__toolbar">
          {
            showToolbar && editable && (
              <Fragment>
                <DetailsBtn
                  selectedResult={selectedResult}
                  show={showResults} />
                <DownloadResultBtn
                  selectedResult={selectedResult}
                  block={block}
                  show={showResults}
                  selectedResultColumns={selectedResultColumns} />
                <ShowResultsBtn
                  show={showResults}
                  onChange={onChangeShowResults} />
              </Fragment>
            )
          }
        </div>
      </div>
      {
        showResults && <DisplayResults
          results={loadedResults}
          selectedResult={selectedResult}
          onSelectResult={onSelectResult} />
      }
    </div>
  );
}

export default React.memo(QueryResultsComponent);
