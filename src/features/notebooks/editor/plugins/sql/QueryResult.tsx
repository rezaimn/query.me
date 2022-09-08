import React from 'react';

import QueryTableResult from './results/QueryTableResult';
import QueryFailureResult from './results/QueryFailureResult';
import QueryRunningResult from './results/QueryRunningResult';
import QueryPendingResult from './results/QueryPendingResult';

import './QueryResult.scss';

type QueryResultProps = {
  result: any;
};

const QueryResultComponent = ({
  result
}: QueryResultProps) => {
  switch (result.status) {
    case 'success': {
      return <QueryTableResult result={result} />
    }
    case 'failed': {
      return <QueryFailureResult result={result} />
    }
    case 'running': {
      return <QueryRunningResult result={result} />
    }
    case 'pending': {
      return <QueryPendingResult result={result} />
    }
    default:
      return (<div>status not supported</div>);
  }
}

export default QueryResultComponent;
