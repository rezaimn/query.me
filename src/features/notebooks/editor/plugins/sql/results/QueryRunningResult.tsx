import React, { useEffect, useState } from 'react';
import { Button, Colors, Intent, ProgressBar } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { format } from 'date-fns';

import './QueryRunningResult.scss';

function formatDate(date: number) {
  return format(new Date(date), 'MMM dd HH:mm:ss');
}

type QueryPendingResultProps = {
  result: any;
};

const QueryRunningResultComponent = ({
  result
}: QueryPendingResultProps) => {
  const [duration, setDuration] = useState<number>(0);
  const [startDateTime, setStartDateTime] = useState<number>(0);
  const [formattedStartDateTime, setFormattedStartDateTime] = useState<string>('');

  useEffect(() => {
    if (result) {
      setStartDateTime(result.value.query.startDttm);
      setFormattedStartDateTime(formatDate(result.start_time));
      setDuration(
        Math.floor((new Date().getTime() - result.value.query.startDttm) / 1000)
      );
    }
  }, [ result ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((duration: number) => duration + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [ startDateTime ]);

  return (
    <div className="query-result__running">
      <div className="query-result__running__running">
        <ProgressBar intent={Intent.NONE} />
      </div>
      <div className="query-result__running__details">
        <div>Query started <strong>{formattedStartDateTime}</strong></div>
        <div>Running {duration > 0 && <strong>{duration} {duration > 1 ? 'seconds' : 'second'}</strong>}.</div>
      </div>
      <div className="query-result__running__toolbar">
        <Button disabled={true} text="Cancel" icon={IconNames.SYMBOL_SQUARE} color={Colors.GRAY3} />
      </div>
    </div>
  );
};

export default QueryRunningResultComponent;
