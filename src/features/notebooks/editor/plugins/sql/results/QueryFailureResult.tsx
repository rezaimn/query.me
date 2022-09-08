import React, { useState } from 'react';
import { Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import './QueryFailureResult.scss';

type QueryFailureResultProps = {
  result: any;
};

const QueryFailureResultComponent = ({
  result
}: QueryFailureResultProps) => {
  const [ copied, setCopied ] = useState(false);

  const onCopied = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <div className="query-result__failed__container">
      <div className="query-result__failed">
        <div className="query-result__failed__title">
          <Icon icon={IconNames.ERROR} iconSize={18} />
          Query run failed
        </div>
        <div className="query-result__failed__details">
          {result.value.query?.errorMessage}<br/>
          for request "{result.value.query?.executedSql}"
        </div>
        <div className="query-result__failed__toolbar">
          {copied && <span className="query-result__failed__toolbar__copied">Copied!</span>}
          <CopyToClipboard text={result.value.query?.errorMessage}
            onCopy={() => onCopied()}
          >
            <Icon icon={IconNames.DUPLICATE} />
          </CopyToClipboard>            
        </div>
      </div>
    </div>
  );
};

export default QueryFailureResultComponent;
