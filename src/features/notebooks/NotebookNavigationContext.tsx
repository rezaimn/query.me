import React, {
  FunctionComponent,
  Context,
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback
} from 'react';

type PageCallback = (page: any) => void;
type BlockCallback = (block: any) => void;
type DataElementSelectionCallback = (dataElement: any) => void;
type AddDataElementListenerCallback = (blockUid: string, listener: Function) => void;
type RemoveDataElementListenerCallback = (blockUid: string) => void;

interface NotebookNavigationContextContent {
  currentPage: any;
  setCurrentPage: PageCallback;
  currentSelectedBlock: any;
  setCurrentSelectedBlock: BlockCallback;
  currentSelectedDataElement: any;
  setCurrentSelectedDataElement: BlockCallback;
  dispatchDataElementSelection: DataElementSelectionCallback;
  addDataElementListener: AddDataElementListenerCallback;
  removeDataElementListener: RemoveDataElementListenerCallback;
}

const NotebookNavigationContext: Context<NotebookNavigationContextContent> = createContext<NotebookNavigationContextContent>({
  currentPage: null,
  setCurrentPage: (page: any) => {},
  currentSelectedBlock: null,
  setCurrentSelectedBlock: (block: any) => {},
  currentSelectedDataElement: null,
  setCurrentSelectedDataElement: (block: any) => {},
  dispatchDataElementSelection: (dataElement: any) => {},
  addDataElementListener: (blockUid: string, listener: Function) => {},
  removeDataElementListener: (blockUid: string) => {}
});

type NotebookNavigationProviderProps = {

}

export const NotebookNavigationProvider: FunctionComponent<NotebookNavigationProviderProps> = ({
  children
}) => {
  const [ currentPage, setCurrentPage ] = useState<any>(null);
  const [ currentSelectedBlock, setCurrentSelectedBlock ] = useState<any>(null);
  const [ currentSelectedDataElement, setCurrentSelectedDataElement ] = useState<any>(null);
  const [ dataElementListeners, setDataElementListeners ] = useState<any>({});

  /*
    This function is responsible to dispatch events to elements that
    subscribe to action on data element tree.
   */
  const dispatchDataElementSelection = useCallback((dataElement: any) => {
    if (dataElementListeners) {
      for (const key of Object.keys(dataElementListeners)) {
        const dataElementListener = dataElementListeners[key];
        if (dataElementListener) {
          dataElementListener(dataElement);
        }
      }
    }
  }, [ dataElementListeners ]);

  const value = useMemo(
    () => ({
      currentPage,
      setCurrentPage,
      currentSelectedBlock,
      setCurrentSelectedBlock,
      currentSelectedDataElement,
      setCurrentSelectedDataElement,
      dispatchDataElementSelection,
      /*
        Registers to action on data element tree 
       */
      addDataElementListener: (blockUid: string, listener: Function) => {
        setDataElementListeners((dataElementListeners: any) => ({
          ...dataElementListeners,
          [blockUid]: listener
        }));
      },
      /*
        Unregisters to action on data element tree 
       */
      removeDataElementListener: (blockUid: string) => {
        setDataElementListeners((dataElementListeners: any) => ({
          ...dataElementListeners,
          [blockUid]: undefined
        }));
      }
    }),
    [
      currentPage, setCurrentPage,
      currentSelectedBlock, setCurrentSelectedBlock,
      currentSelectedDataElement, setCurrentSelectedDataElement,
      dataElementListeners, dispatchDataElementSelection,
    ]
  );

  return (
    <NotebookNavigationContext.Provider value={value}>
      {children}
    </NotebookNavigationContext.Provider>
  )
}

export function useNotebookCurrentPage() {
  const { currentPage, setCurrentPage } = useContext(NotebookNavigationContext);
  return { currentPage, setCurrentPage };
}

export function useNotebookCurrentBlock() {
  const { currentSelectedBlock } = useContext(NotebookNavigationContext);
  return currentSelectedBlock;
}

export function useChangeNotebookCurrentBlock() {
  const { setCurrentSelectedBlock } = useContext(NotebookNavigationContext);
  return setCurrentSelectedBlock;
}

export function useSelectedNotebookDataElement() {
  const { currentSelectedDataElement } = useContext(NotebookNavigationContext);
  return currentSelectedDataElement;
}

export function useSelectNotebookDataElement() {
  const {
    dispatchDataElementSelection,
    addDataElementListener,
    removeDataElementListener
  } = useContext(NotebookNavigationContext);
  return {
    dispatchDataElementSelection,
    addDataElementListener,
    removeDataElementListener
  };
}
