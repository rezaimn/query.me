import { SelectableStyleProps, SelectableStyles } from './Selectable.types';
import {
  Colors,
} from '@blueprintjs/core';

const classNames = {
  root: 'slate-Selectable',
  gutterLeft: 'slate-gutter-left',
  gutterRight: 'slate-gutter-right',
  iconContainer: 'icon-container',
  gutterTopIconContainer: 'gutter-top-icon-container',
  blockSectionFullScreen: 'selectable-block-full-screen',
};

export const getSelectableStyles = ({
  className,
  direction,
  isDragging,
  selected,
}: SelectableStyleProps): SelectableStyles => {
  return {
    root: [
      classNames.root,
      {
        position: 'relative',
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: selected ? 'rgb(181, 215, 255)' : undefined,
        display: 'flex',
        selectors: {
          ':hover .slate-gutter-left': {
            opacity: 1,
          },
        },
      },
      className,
    ],
    block: {
      width: '100%'
    },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
      outline: 'none',
      position: 'absolute',
      top: 0,
      selectors: {
        ':focus': {
          outline: 'none'
        },
        '.bp3-icon :hover': {
          fill: Colors.GRAY4
        },
      },
    },
    blockAndGutter: {
      paddingTop: 3,
      paddingBottom: 3,
    },
    blockSectionFullScreen: {
      padding: 0,
    },
    gutterLeft: [
      {
        position: 'absolute',
        top: 0,
        transform: 'translateX(-100%)',
        display: 'flex',
        height: '100%',
        opacity: 0,
      },
      classNames.gutterLeft,
    ],
    gutterRight: [
      {
        position: 'absolute',
        right: '160px',
        display: 'flex',
        height: '100%',
        opacity: 1,
      },
      classNames.gutterRight,
    ],
    gutterTopIconContainer: [
      {
        height: 20,
        position: 'relative',
      },
      classNames.gutterTopIconContainer,
    ],
    blockToolbarWrapper: {
      display: 'flex',
      height: '1.5em',
    },
    blockToolbar: {
      width: 36,
      height: 18,
      marginRight: 4,
      pointerEvents: 'auto',
    },
    blockToolbarFullScreen: {
      position: 'relative',
      left: '36px',
      top: '1px',
    },
    dragButton: {
      minWidth: 18,
      height: 18,
      padding: 0,
      backgroundColor: 'transparent',
      backgroundRepeat: 'no-repeat',
      border: 'none',
      cursor: 'pointer',
      overflow: 'hidden',
      outline: 'none',
    },
    dropLine: {
      position: 'absolute',
      /* left: direction === 'left' ? -1 : 0,
      right: direction === 'right' ? -1 : 0,
      top: direction === 'top' ? -1 : 0,
      bottom: direction === 'bottom' ? -1 : 0, */
      left: direction === 'left' ? -5 : undefined,
      right: direction === 'right' ? -5 : undefined,
      top: direction === 'top' ? -1 : (direction === 'left' || direction === 'right') ? 0 : undefined,
      bottom: direction === 'bottom' ? -1 : undefined,
      height: (direction === 'top' || direction === 'bottom') ? 2 : '100%',
      width: (direction === 'top' || direction === 'bottom') ? '100%' : 2,
      opacity: 1,
      background: '#B4D5FF',
    },
  };
};
