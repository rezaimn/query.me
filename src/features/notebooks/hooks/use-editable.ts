import { createContext, useContext } from 'react';

/**
 * A React context for sharing the `editable` state of the notebook.
 */

export const NotebookEditableContext = createContext(true);

/**
 * Get the current `editable` state of the notebook.
 */

export const useNotebookEditable = (): boolean => {
  return useContext(NotebookEditableContext);
}
