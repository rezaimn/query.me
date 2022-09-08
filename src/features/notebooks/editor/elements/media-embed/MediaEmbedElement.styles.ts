import { createStyles } from '@udecode/plate-styled-components';
import { MediaEmbedElementProps } from './MediaEmbedElement.types';

export const getMediaEmbedElementStyles = (props: MediaEmbedElementProps) =>
  createStyles(
    { prefixClassNames: 'MediaEmbedElement', ...props },
    {
      root:'root',
      iframeWrapper:'iframe-wrapper',
      iframe:'iframe'
    },
  );
