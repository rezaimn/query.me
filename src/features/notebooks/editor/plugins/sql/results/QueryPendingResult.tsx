import React from 'react';
import { Button, Colors, Intent, ProgressBar } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import './QueryPendingResult.scss';

type QueryPendingResultProps = {
  result: any;
};

const QueryPendingResultComponent = ({
  result
}: QueryPendingResultProps) => {
  return (
    <div className="query-result__pending">
      <div className="query-result__pending__progress">
        <ProgressBar intent={Intent.NONE} />
      </div>
      <div className="query-result__pending__details">
        <div>Query will start soon</div>
      </div>
      <div className="query-result__pending__toolbar">
        <Button text="Cancel" icon={IconNames.SYMBOL_SQUARE} color={Colors.GRAY3} />
      </div>
    </div>
  );
};

export default QueryPendingResultComponent;
