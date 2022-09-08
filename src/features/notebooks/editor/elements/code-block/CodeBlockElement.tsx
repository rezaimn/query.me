import React, { useState } from 'react';
import {
  StyledElement,
  StyledElementProps,
} from '@udecode/plate-styled-components';
import { Icon, Intent } from '@blueprintjs/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { getCodeBlockElementStyles } from './CodeBlockElement.styles';
import './CodeBlockElement.scss';
import { copiedToaster } from '../../inline-toolbar/components';

export const CodeBlockElement = (props: StyledElementProps) => {
  const { attributes, children, nodeProps, element } = props;
  const rootProps = StyledElement(props);
  const [duplicateIconVisible, setDuplicateIconVisible] = useState(false);
  const { lang } = element;
  const { root } = getCodeBlockElementStyles(props);
  const codeClassName = lang ? `${lang} language-${lang}` : '';

  const onCopied = () => {
    copiedToaster.show({
      message: 'Code copied to clipboard.',
      intent: Intent.SUCCESS,
    });
  };

  return (
    <>
      <pre
        onMouseOver={() => setDuplicateIconVisible(true)}
        onMouseLeave={() => setDuplicateIconVisible(false)}
        {...attributes}
        className={root.className}
        {...rootProps}
        {...nodeProps}
      >
          <CopyToClipboard
            text={element.children[0].text}
            onCopy={() => onCopied()}
          >
            <Icon icon={'duplicate'} className='duplicate-icon'
                  style={{ display: duplicateIconVisible ? 'block' : 'none' }}/>
          </CopyToClipboard>
        <code className={codeClassName}>{children}</code>
      </pre>
    </>
  );
};
