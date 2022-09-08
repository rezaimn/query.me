import React, { useState, useEffect, useMemo, useCallback, Fragment } from 'react';
import { Button, Colors, Intent, Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Cell, Column, Table } from '@blueprintjs/table';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { format } from 'date-fns';

import './QueryResultHints.scss';

function formatDate(date: number) {
  return format(new Date(date), 'MMM dd HH:mm:ss');
}
  
type QueryResultProps = {
  result: any;
};

const QueryResultHintComponent = ({
  result
}: QueryResultProps) => {
  const [duration, setDuration] = useState<number>(0);
  const [startDateTime, setStartDateTime] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (result) {
      setStartDateTime(formatDate(result.value.query.startDttm));
      setDuration(
        Math.floor(((result.value.query.endDttm - result.value.query.startDttm) / 1000) * 100) / 100
      );
    }
  }, [ result ]);

  const onCopied = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div className="query-result-hint">
      <div className="query-result-hint__details">
        Query started <strong>{startDateTime}</strong>
        {
          result.status === 'success' && (
            <Fragment>
              , took <strong>{duration} seconds</strong>
            </Fragment>
          )
        }
        <Fragment>
          .<br/>
        </Fragment>
        Query execut{result.status === 'success' ? 'ed' : 'ing'} on database <strong>{result.value.query.db}</strong>.<br/>
        {
          result.status === 'success' && (
            (result.value.query.rows <= result.value.query.limit) ? (
              <Fragment>
                Returned <strong>{result.value.query.rows} rows</strong>.
                Query results limited to {result.value.query.limit} rows.
              </Fragment>
            ) : (
              <Fragment>
                Returned <strong>{result.value.query.rows} rows</strong>.
              </Fragment>
            )
          )
        }
      </div>
      <div className="query-result-hint__sql">
        <div className="query-result-hint__sql__header">
          {
            result.status === 'success' ? (
              <strong>Executed SQL:</strong>
            ) : (
              <strong>Executing SQL:</strong>
            )
          }
        </div>
        <div className="query-result-hint__sql__body">
          <div className="query-result-hint__sql__body__copy">
            {
              copied ?
                'Copied !' : (
                <CopyToClipboard
                  text={result.value.query.executedSql}
                  onCopy={() => onCopied()}
                >
                  <Icon icon={IconNames.DUPLICATE}></Icon>
                </CopyToClipboard>
              )
            }
          </div>
          {result.value.query.executedSql}
        </div>
      </div>
    </div>
  );
};

export default QueryResultHintComponent;
