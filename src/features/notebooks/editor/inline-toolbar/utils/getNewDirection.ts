/**
 * Get new direction if updated
 */
export const getNewDirection = (previousDir: string, dir?: string) => {
  if (!dir && previousDir) {
    return '';
  }

  if (dir === 'top' && previousDir !== 'top') {
    return 'top';
  }

  if (dir === 'bottom' && previousDir !== 'bottom') {
    return 'bottom';
  }

  if (dir === 'left' && previousDir !== 'left') {
    return 'left';
  }

  if (dir === 'right' && previousDir !== 'right') {
    return 'right';
  }
};
