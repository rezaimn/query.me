import {
  createStyles,
  StyledElementProps,
} from '@udecode/plate-styled-components';

export const getCodeBlockElementStyles = (props: StyledElementProps) =>
  createStyles(
    { prefixClassNames: 'CodeBlockElement', ...props },
    {
      root: [],
    },
  );
